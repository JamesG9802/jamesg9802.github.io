import { Engine } from "simulation/engine";
import { Model } from "simulation/world/model";
import { World } from "simulation/world";

/**
 * Render pipeline specifically for rendering models.
 */
export class ModelPipeline {
    /**
     * Current command encoder for the rendering.
     */
    #command_encoder: GPUCommandEncoder | undefined; 

    /**
     * Current render pass for the command encoder.
     */
    #render_pass: GPURenderPassEncoder | undefined;

    /**
     * Render pipeline for models.
     */
    pipeline: GPURenderPipeline;

    /**
     * The depth texture for the model pipeline. 
     */
    depth_texture: GPUTexture;

    /**
     * Creates a new Model Pipeline.
     * @param device the GPU device
     * @param context the canvas's context
     * @param bind_group_layout the layout for the model pipeline
     * @param canvas_format the format of the target canvas
     */
    constructor(device: GPUDevice, context: GPUCanvasContext, 
        bind_group_layouts: GPUBindGroupLayout[], canvas_format: GPUTextureFormat) {
        //  Set up the shader
        const shader = device.createShaderModule({
            label: "Shader",
            code: `
                struct VertexOut {
                    @builtin(position) position : vec4f,
                    @location(0) normal : vec3f,
                    @location(1) eye_coords : vec3f
                }
                struct ModelData {
                    model_view: mat4x4f,    //  size 64, offset 0
                    normal_matrix: mat3x3f  //  size 48, offset 64
                }
                struct ProjectionData {
                    projection: mat4x4f,    //  size 64, offset 0
                }
                @group(0) @binding(0) var<uniform> projection_data: ProjectionData;
                @group(1) @binding(0) var<uniform> model_data: ModelData;

                @vertex
                fn vertexMain(
                    @location(0) pos: vec3f,
                    @location(1) normal: vec3f,
                    @location(2) texel: vec2f
                ) -> VertexOut {
                    var output: VertexOut;
                    let eye_coords = model_data.model_view * vec4f(pos, 1);
                    output.position = projection_data.projection * eye_coords;
                    //output.position = vec4f(pos, 1);
                    //output.position = eye_coords;
                    //  all models are guaranteed to have normalized normals
                    output.normal = normal;
                    output.eye_coords = eye_coords.xyz/eye_coords.w;
                    return output;
                }
                @fragment
                fn fragmentMain(
                    @location(0) normal: vec3f, 
                    @location(1) eye_coords: vec3f
                ) -> @location(0) vec4f {
                    var N : vec3f;  // normalized normal vector
                    var L : vec3f;  // unit vector pointing towards the light source
                    L = vec3f(0, 0, 1);
                    var R : vec3f;  // reflected vector of L
                    var V : vec3f;  // unit vector pointing towards the viewer
                    N = normalize( model_data.normal_matrix * normal );
                    if ( dot(L,N) <= 0.0 ) { // light does not illuminate this point
                        return vec4f(0,0,0,1);
                    }
                    else {
                        R = -reflect(L,N);
                        V = normalize(-eye_coords);  // (Assumes a perspective projection.)
                        var color = 0.8*dot(L,N) * vec3f(1,1,1);  // diffuse reflection
                            // constant multiples on colors are to avoid over-saturating the total color
                        if (dot(R,V) > 0.0) {  // add in specular reflection
                            color += 0.4*pow(dot(R,V),4) * vec3f(1,0,0);
                        }
                        return vec4f(color,1.0);
                    }
                }
            `
        });

        //  Set up the depth texture
        this.depth_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        //  Set up the bind group for the uniform buffer
        const vertex_layout: GPUVertexBufferLayout[] = [
            {   //  First buffer contains the positions: Vector3
                attributes: [ { shaderLocation:0, offset:0, format: "float32x3" } ],
                arrayStride: 12,
                stepMode: "vertex" 
            },
            {   //  Second buffer contains the normals: Vector3
                attributes: [ { shaderLocation:1, offset:0, format: "float32x3" } ],
                arrayStride: 12,
                stepMode: "vertex" 
            },
            {   //  Second buffer contains the normals: Vector3
                attributes: [ { shaderLocation:2, offset:0, format: "float32x2" } ],
                arrayStride: 12,
                stepMode: "vertex" 
            }
        ];
        
        //  Set up the pipeline
        const model_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: bind_group_layouts
        })
        this.pipeline = device.createRenderPipeline({
            label: "Model pipeline",
            layout: model_pipeline_layout,
            vertex: {
                module: shader,
                entryPoint: "vertexMain",
                buffers: vertex_layout
            },
            fragment: {
                module: shader,
                entryPoint: "fragmentMain",
                targets: [{
                    format: canvas_format
                }]
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.depth_texture.format
            }
        });
    }
    
    /**
     * When the screen is resized, the pipeline resizes its depth texture as well.
     * @param context 
     */
    resize(device: GPUDevice, context: GPUCanvasContext) {
        this.depth_texture.destroy();
        this.depth_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }

    /**
     * Creates a command encoder for the render pass to be sent to.
     * @param device 
     */
    begin_render_command(device: GPUDevice, context: GPUCanvasContext) {
        this.#command_encoder = device.createCommandEncoder();
        this.#render_pass = this.#command_encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }],
            depthStencilAttachment: {
                view: this.depth_texture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "store",
            }
        });
        this.#render_pass.setPipeline(this.pipeline);
    }

    /**
     * Submits the current command encoder to the GPU.
     * @param device 
     */
    end_render_command(device: GPUDevice) {
        if(this.#command_encoder && this.#render_pass) {
            this.#render_pass.end();
            device.queue.submit([this.#command_encoder.finish()]);
        }
    }

    /**
     * Simplest way to render model. `begin_render_command` must be called first`.
     * @param engine 
     * @param model 
     */
    render(world: World, model: Model) {
        if(!this.#command_encoder || !this.#render_pass) 
            return;
        
        //  The first binding group is for the camera's projection matrix.
        this.#render_pass.setBindGroup(0, world.main_camera.projection_bind_group);
        //  The second binding group is for the modelview and normal matries. 
        this.#render_pass.setBindGroup(1, model.bind_group);

        let vertices = model.mesh.mesh_buffer.get_vertices_buffer();
        this.#render_pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = model.mesh.mesh_buffer.get_normals_buffer();
        this.#render_pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let texels = model.mesh.mesh_buffer.get_texels_buffer();
        this.#render_pass.setVertexBuffer(2, texels.buffer, texels.offset, texels.size);

        let indices = model.mesh.mesh_buffer.get_indices_buffer();
        this.#render_pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);

        this.#render_pass.drawIndexed(model.mesh.mesh_buffer.vertices_count);
        //this.#render_pass.drawIndexedIndirect(model.mesh.mesh_buffer.indirect_params, 0);
    }
}