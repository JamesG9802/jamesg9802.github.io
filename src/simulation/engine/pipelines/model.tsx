import { BindGroupLayouts, Engine } from "simulation/engine";
import { Model } from "simulation/world/model";
import { World } from "simulation/world";
import { get_model_shader } from "../shaders/model";
import { Mesh } from "simulation/world/mesh";

// (1 and 4 are currently the only possible values.)
const multi_sample_count = 4;

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
    #model_render_pass: GPURenderPassEncoder | undefined;

    #instance_render_pass: GPURenderPassEncoder | undefined;

    /**
     * Render pipeline for models.
     */
    default_pipeline: GPURenderPipeline;

    /**
     * Render pipeline for instances.
     */
    instance_pipeline: GPURenderPipeline;

    /**
     * The depth texture for the model pipeline. 
     */
    depth_texture: GPUTexture;

    /**
     * The texture for multisampling for the model pipeline.
     */
    multisampling_texture: GPUTexture;

    /**
     * The view into the multisampling texture.
     */
    multisampling_view: GPUTextureView;

    /**
     * Creates a new Model Pipeline.
     * @param device the GPU device
     * @param context the canvas's context
     * @param bind_group_layout the layout for the model pipeline
     * @param canvas_format the format of the target canvas
     */
    constructor(device: GPUDevice, context: GPUCanvasContext, 
        bind_group_layouts: BindGroupLayouts, canvas_format: GPUTextureFormat) {
        //  Set up the depth texture
        this.depth_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: multi_sample_count
        });

        //  Set up the multisampling texture
        this.multisampling_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            sampleCount: multi_sample_count,  
            format: canvas_format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.multisampling_view = this.multisampling_texture.createView();

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
        
        //  Set up the model pipeline
        const model_shader = device.createShaderModule({
            label: "Model shader",
            code: get_model_shader(true)
        });
        const model_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: bind_group_layouts.model_bind_group_layout
        })
        this.default_pipeline = device.createRenderPipeline({
            label: "Model pipeline",
            layout: model_pipeline_layout,
            multisample: { count: multi_sample_count },
            vertex: {
                module: model_shader,
                entryPoint: "vertexMain",
                buffers: vertex_layout
            },
            fragment: {
                module: model_shader,
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
        
        //  Set up the instance pipeline
        const instance_shader = device.createShaderModule({
            label: "Instance shader",
            code: get_model_shader(false)
        })
        const instance_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: bind_group_layouts.instance_bind_group_layout
        });
        this.instance_pipeline = device.createRenderPipeline({
            label: "Instance pipeline",
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
                format: this.depth_texture.format
            }
        });
        //console.info("Model Shader");
        //console.info(get_model_shader(true));
        //console.info("Instance Shader");
        //console.info(get_model_shader(false));
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
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: multi_sample_count
        });
        this.multisampling_texture.destroy();
        this.multisampling_texture = device.createTexture({
            size: [context.canvas.width, context.canvas.height],
            sampleCount: multi_sample_count,  
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.multisampling_view = this.multisampling_texture.createView();
    }

    /**
     * Creates a command encoder for the render pass to be sent to.
     * @param device 
     */
    begin_model_render(device: GPUDevice, context: GPUCanvasContext) {
        this.#command_encoder = device.createCommandEncoder();
        this.#model_render_pass = this.#command_encoder.beginRenderPass({
            colorAttachments: [{
                view: this.multisampling_view,
                resolveTarget: context.getCurrentTexture().createView(),
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
        this.#model_render_pass.setPipeline(this.default_pipeline);
        
    }

    /**
     * Submits the current command encoder to the GPU.
     * @param device 
     */
    end_model_render(device: GPUDevice) {
        if(this.#command_encoder && this.#model_render_pass) {
            this.#model_render_pass.end();
            device.queue.submit([this.#command_encoder.finish()]);
        }
    }

    /**
     * Creates a command encoder for the render pass to be sent to.
     * @param device 
     */
    begin_instance_render(device: GPUDevice, context: GPUCanvasContext) {
        this.#command_encoder = device.createCommandEncoder();
        this.#instance_render_pass = this.#command_encoder.beginRenderPass({
            colorAttachments: [{
                view: this.multisampling_view,
                resolveTarget: context.getCurrentTexture().createView(),
                loadOp: "load",    //  because instances are drawn after models, they need to store the previous view
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }],
            depthStencilAttachment: {
                view: this.depth_texture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: "load",    //  same reason why we need to load the previous view.
                depthStoreOp: "store",
            }
        });
        this.#instance_render_pass.setPipeline(this.instance_pipeline);
    }

    /**
     * Submits the current command encoder to the GPU.
     * @param device 
     */
    end_instance_render(device: GPUDevice) {
        if(this.#command_encoder && this.#instance_render_pass) {
            this.#instance_render_pass.end();
            device.queue.submit([this.#command_encoder.finish()]);
        }
    }

    /**
     * Simplest way to render model. `begin_render_command` must be called first`.
     * @param engine 
     * @param model 
     */
    render_model(world: World, model: Model) {
        if(!this.#command_encoder || !this.#model_render_pass || !model.bind_group) 
            return;
        
        //  The first binding group is for the camera's projection matrix.
        this.#model_render_pass.setBindGroup(0, world.main_camera.projection_bind_group);
        //  The second binding group is for the modelview and normal matries. 
        this.#model_render_pass.setBindGroup(1, model.bind_group);

        let vertices = model.mesh.mesh_buffer.get_vertices_buffer();
        this.#model_render_pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = model.mesh.mesh_buffer.get_normals_buffer();
        this.#model_render_pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let texels = model.mesh.mesh_buffer.get_texels_buffer();
        this.#model_render_pass.setVertexBuffer(2, texels.buffer, texels.offset, texels.size);

        let indices = model.mesh.mesh_buffer.get_indices_buffer();
        this.#model_render_pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);

        this.#model_render_pass.drawIndexed(model.mesh.mesh_buffer.vertices_count);
    }
    
    render_instance(world: World, mesh_name: string) {
        if(!this.#command_encoder || !this.#instance_render_pass) 
            return;
        let instance_information = Mesh.allocated_meshes[mesh_name];
        if(!instance_information.instance_buffer || !instance_information.data)
            return;
        
        //  The first binding group is for the camera's projection matrix.
        this.#instance_render_pass.setBindGroup(0, world.main_camera.projection_bind_group);
        //  The second binding group is for the modelview and normal matries.
        this.#instance_render_pass.setBindGroup(1, instance_information.instance_buffer.uniform_bind_group);

        let vertices = instance_information.data.get_vertices_buffer();
        this.#instance_render_pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = instance_information.data.get_normals_buffer();
        this.#instance_render_pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let texels = instance_information.data.get_texels_buffer();
        this.#instance_render_pass.setVertexBuffer(2, texels.buffer, texels.offset, texels.size);

        let indices = instance_information.data.get_indices_buffer();
        this.#instance_render_pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);
        this.#instance_render_pass.drawIndexedIndirect(instance_information.instance_buffer.indirect_buffer, 0);
    }
}