import { Model } from "simulation/world/model";
import { World } from "simulation/world";
import { get_model_shader } from "../shaders/model";

// (1 and 4 are currently the only possible values.)
const multi_sample_count = 4;

/**
 * A render pipeline for specifically models.
 */
export class ModelPipeline {
    /**
     * The current command encoder for the rendering.
     */
    #command_encoder: GPUCommandEncoder | undefined; 

    /**
     * The depth texture for the model pipeline. 
     */
    #depth_texture: GPUTexture;

    /**
     * The texture for multisampling for the model pipeline.
     */
    #multisampling_texture: GPUTexture;
    
    /**
     * The view into the multisampling texture.
     */
    #multisampling_view: GPUTextureView;

    /**
     * The current render pass for the unique models pipeline.
     */
    #unique_render_pass: GPURenderPassEncoder | undefined;

    /**
     * The current render pass for the instance models pipeline.
     */
    #instance_render_pass: GPURenderPassEncoder | undefined;

    /**
     * Render pipeline for uniques.
     */
    unique_pipeline: GPURenderPipeline;

    /**
     * Render pipeline for instances.
     */
    instance_pipeline: GPURenderPipeline;

    /**
     * The clear color of the pipelines.
     */
    clear_color: GPUColor;

    /**
     * Creates a new Model Pipeline. Use `create()` instead.
     */
    constructor(
        depth_texture: GPUTexture,
        multisampling_texture: GPUTexture,
        multisampling_view: GPUTextureView,
        unique_pipeline: GPURenderPipeline,
        instance_pipeline: GPURenderPipeline,
        clear_color: GPUColor
    ) {
        this.#depth_texture = depth_texture;
        this.#multisampling_texture = multisampling_texture;
        this.#multisampling_view = multisampling_view;
        this.unique_pipeline = unique_pipeline;
        this.instance_pipeline = instance_pipeline;
        this.clear_color = clear_color;
    }
    
    /**
     * Creates a new depth texture
     * @param device 
     * @param context 
     * @returns 
     */
    static #create_depth_texture(device: GPUDevice, context: GPUCanvasContext): GPUTexture {
        return device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: multi_sample_count
        });
    }

    /**
     * Creates a new multisampling texture and view.
     * @param device 
     * @param context 
     * @param canvas_format 
     * @returns 
     */
    static #create_multisampling(device: GPUDevice, context: GPUCanvasContext, 
        canvas_format: GPUTextureFormat    
    ): {
        multisampling_texture: GPUTexture,
        multisampling_view: GPUTextureView
    } {
        let multisampling_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            sampleCount: multi_sample_count,  
            format: canvas_format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        let multisampling_view = multisampling_texture.createView();
        return {
            multisampling_texture: multisampling_texture,
            multisampling_view: multisampling_view
        }
    }

    /**
     * Creates the unique and instance render pipelines.
     * @param device 
     * @param canvas_format 
     * @param depth_texture 
     * @returns 
     */
    static #create_pipelines(device: GPUDevice, canvas_format: GPUTextureFormat, 
        depth_texture: GPUTexture
    ): {
        unique_pipeline: GPURenderPipeline,
        instance_pipeline: GPURenderPipeline
    } {
        //  The vertex layout for position, normals, and texles
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
            {   //  Third buffer contains the texels: Vector3
                attributes: [ { shaderLocation:2, offset:0, format: "float32x2" } ],
                arrayStride: 12,
                stepMode: "vertex" 
            }
        ];

        //  Set up the bind group layouts 
        const unique_bind_group_layout: GPUBindGroupLayout[] = [
            device.createBindGroupLayout({  //  group 0 - projection matrix + global light
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                    },
                }],
            }),
            device.createBindGroupLayout({  //  group 1 - uniform buffer with model*view matrix + normal matrix
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform',
                    },
                }],
            }),
        ]
        const instance_bind_group_layout: GPUBindGroupLayout[] = [
            unique_bind_group_layout[0],
            device.createBindGroupLayout({  //  group 1 - storage buffer with model*view matrix + normal matrix
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "read-only-storage"
                    }
                }]
            })
        ];

        //  Set up the shaders
        const unique_shader = device.createShaderModule({
            label: "Model shader",
            code: get_model_shader(true)
        });
        const instance_shader = device.createShaderModule({
            label: "Instance shader",
            code: get_model_shader(false)
        });

        //  Set up the pipeline layouts
        const unique_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: unique_bind_group_layout
        });
        const instance_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: instance_bind_group_layout
        });

        //  Set up the pipelines
        const unique_pipeline = device.createRenderPipeline({
            label: "Model (Unique) pipeline",
            layout: unique_pipeline_layout,
            multisample: { count: multi_sample_count },
            vertex: {
                module: unique_shader,
                entryPoint: "vertexMain",
                buffers: vertex_layout
            },
            fragment: {
                module: unique_shader,
                entryPoint: "fragmentMain",
                targets: [{
                    format: canvas_format
                }]
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: depth_texture.format
            }
        });
        const instance_pipeline = device.createRenderPipeline({
            label: "Model (Instance) pipeline",
            layout: instance_pipeline_layout,
            multisample: { count: multi_sample_count },
            vertex: {
                module: instance_shader,
                entryPoint: "vertexMain",
                buffers: vertex_layout
            },
            fragment: {
                module: instance_shader,
                entryPoint: "fragmentMain",
                targets: [{
                    format: canvas_format
                }]
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: depth_texture.format
            }
        });
        return {
            unique_pipeline: unique_pipeline,
            instance_pipeline: instance_pipeline
        }
    }

    /**
     * Creates a new Model Pipeline.
     * @param device 
     * @param context 
     * @param canvas_format 
     * @param clear_color
     * @returns 
     */
    static create(device: GPUDevice, context: GPUCanvasContext, 
        canvas_format: GPUTextureFormat, clear_color: GPUColor
    ): ModelPipeline {
        //  Set up the depth texture
        const depth_texture = ModelPipeline.#create_depth_texture(device, context);

        //  Set up the multisampling texture and view
        const {multisampling_texture, multisampling_view} = 
            ModelPipeline.#create_multisampling(device, context, canvas_format);

        const {unique_pipeline, instance_pipeline} = ModelPipeline.#create_pipelines(device, canvas_format, depth_texture);
        
        return new ModelPipeline(
            depth_texture,
            multisampling_texture,
            multisampling_view,
            unique_pipeline,
            instance_pipeline,
            clear_color
        );
    }

    /**
     * When the screen is resized, the pipeline resizes its depth and multisampling texture as well.
     * @param context 
     */
    resize(device: GPUDevice, context: GPUCanvasContext) {
        this.#depth_texture.destroy();
        this.#depth_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: multi_sample_count
        });
        this.#multisampling_texture.destroy();
        this.#multisampling_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            sampleCount: multi_sample_count,  
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.#multisampling_view = this.#multisampling_texture.createView();
    }

    set_clear_color(clear_color: GPUColor) {
        this.clear_color = clear_color;
    }

    /**
     * Creates a command encoder for the unique render pass to be sent to.
     * @param device 
     */
    begin_unique_render(device: GPUDevice, context: GPUCanvasContext) {
        this.#command_encoder = device.createCommandEncoder();
        this.#unique_render_pass = this.#command_encoder.beginRenderPass({
            colorAttachments: [{
                view: this.#multisampling_view,
                resolveTarget: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: this.clear_color
            }],
            depthStencilAttachment: {
                view: this.#depth_texture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "store",
            }
        });
        this.#unique_render_pass.setPipeline(this.unique_pipeline);
        
    }

    /**
     * Submits the unique command encoder to the GPU.
     * @param device 
     */
    end_unique_render(device: GPUDevice) {
        if(this.#command_encoder && this.#unique_render_pass) {
            this.#unique_render_pass.end();
            device.queue.submit([this.#command_encoder.finish()]);
        }
    }

    /**
     * Creates a command encoder for the instance render pass to be sent to.
     * @param device 
     */
    begin_instance_render(device: GPUDevice, context: GPUCanvasContext) {
        this.#command_encoder = device.createCommandEncoder();
        this.#instance_render_pass = this.#command_encoder.beginRenderPass({
            colorAttachments: [{
                view: this.#multisampling_view,
                resolveTarget: context.getCurrentTexture().createView(),
                loadOp: "load",    //  because instances are drawn after models, they need to store the previous view
                storeOp: "store",
                clearValue: this.clear_color
            }],
            depthStencilAttachment: {
                view: this.#depth_texture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: "load",    //  same reason why we need to load the previous view.
                depthStoreOp: "store",
            }
        });
        this.#instance_render_pass.setPipeline(this.instance_pipeline);
    }

    /**
     * Submits the instance command encoder to the GPU.
     * @param device 
     */
    end_instance_render(device: GPUDevice) {
        if(this.#command_encoder && this.#instance_render_pass) {
            this.#instance_render_pass.end();
            device.queue.submit([this.#command_encoder.finish()]);
        }
    }

    /**
     * Renders unique models.
     * @param engine 
     * @param model 
     */
    render_unique(world: World, model: Model) {
        if(!this.#command_encoder || !this.#unique_render_pass) 
            return;
        //  The first binding group is for the camera's projection matrix.
        this.#unique_render_pass.setBindGroup(0, world.main_camera.projection_bind_group);
        //  The second binding group is for the modelview and normal matries. 
        this.#unique_render_pass.setBindGroup(1, model.uniform_buffer.bind_group);

        let vertices = model.mesh.mesh_buffer.get_vertices_buffer();
        this.#unique_render_pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = model.mesh.mesh_buffer.get_normals_buffer();
        this.#unique_render_pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let texels = model.mesh.mesh_buffer.get_texels_buffer();
        this.#unique_render_pass.setVertexBuffer(2, texels.buffer, texels.offset, texels.size);

        let indices = model.mesh.mesh_buffer.get_indices_buffer();
        this.#unique_render_pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);

        this.#unique_render_pass.drawIndexed(model.mesh.mesh_buffer.vertices_count);
        //this.#model_render_pass.drawIndexedIndirect(model.uniform_buffer.indirect_buffer, 0);
    }
    
    /**
     * Renders instance models.
     * @param world 
     * @param model 
     * @returns 
     */
    render_instance(world: World, model: Model) {
        if(!this.#command_encoder || !this.#instance_render_pass) 
            return;
        //  The first binding group is for the camera's projection matrix.
        this.#instance_render_pass.setBindGroup(0, world.main_camera.projection_bind_group);
        //  The second binding group is for the modelview and normal matries.
        this.#instance_render_pass.setBindGroup(1, model.uniform_buffer.bind_group);

        let vertices = model.mesh.mesh_buffer.get_vertices_buffer();
        this.#instance_render_pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = model.mesh.mesh_buffer.get_normals_buffer();
        this.#instance_render_pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let texels = model.mesh.mesh_buffer.get_texels_buffer();
        this.#instance_render_pass.setVertexBuffer(2, texels.buffer, texels.offset, texels.size);

        let indices = model.mesh.mesh_buffer.get_indices_buffer();
        this.#instance_render_pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);

        this.#instance_render_pass.drawIndexedIndirect(model.uniform_buffer.indirect_buffer, 0);
    }

    destroy() {
        this.#depth_texture.destroy();
        this.#multisampling_texture.destroy();
    }
}