import { ModelPipeline } from "simulation/world/model";

/**
 * The bind group layouts needed for the engine to render .
 */
export type BindGroupLayouts = {
    model_bind_group_layout: GPUBindGroupLayout[],
    instance_bind_group_layout: GPUBindGroupLayout[],
};

export class Engine {
    adapter: GPUAdapter;
    device: GPUDevice;
    context: GPUCanvasContext;
    model_pipeline: ModelPipeline;

    /**
     * A dictionary of layouts needed in the engine.
     */
    bind_group_layouts: BindGroupLayouts;

    constructor(adapter: GPUAdapter, device: GPUDevice, context: GPUCanvasContext,
        model_pipeline: ModelPipeline, bind_group_layouts: BindGroupLayouts
    ) {
        this.adapter = adapter;
        this.device = device;
        this.context = context;
        this.model_pipeline = model_pipeline;

        this.bind_group_layouts = bind_group_layouts;
    }

    static async create(canvas: HTMLCanvasElement): Promise<Engine | undefined> {
        //  Get the adapter and device
        if(!navigator.gpu)
            throw Error("WebGPU not supported.");
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter)
            throw Error("Couldn't request WebGPU adapter.");
        const device = await adapter.requestDevice();
    
        //  Configure the context and canvas
        const context = canvas.getContext("webgpu");
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        if(!context) 
            throw Error("Couldn't get WebGPU context.");
        context.configure({
            device: device,
            format: canvasFormat,
            alphaMode: "premultiplied"
        });
    
        //  The bind groups for the pipelines.
        
        const model_bind_group_layout: GPUBindGroupLayout[] = [
            device.createBindGroupLayout({  //  group 0 - projection matrix
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
            model_bind_group_layout[0],
            device.createBindGroupLayout({  //  group 1 - storage buffer with model*view matrix + normal matrix
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "read-only-storage"
                    }
                }]
            })
        ]
        const bind_group_layouts: BindGroupLayouts = {
            model_bind_group_layout: model_bind_group_layout,
            instance_bind_group_layout: instance_bind_group_layout
        };
        
        //  Create the pipeline responsible for rendering models.
        const model_pipeline: ModelPipeline = new ModelPipeline(device, context,
            bind_group_layouts, canvasFormat);

        let engine: Engine = new Engine(
            adapter,
            device,
            context,
            model_pipeline,
            bind_group_layouts
        );
        return engine;
    }

    /**
     * Upon canvas resizing, resize the pipelines. 
     */
    resize() {
        this.model_pipeline.resize(this.device, this.context);
    }
}
