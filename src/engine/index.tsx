import { ModelPipeline } from "../world/model";


export class Engine {
    adapter: GPUAdapter;
    device: GPUDevice;
    context: GPUCanvasContext;
    model_pipeline: ModelPipeline;

    constructor(adapter: GPUAdapter, device: GPUDevice, context: GPUCanvasContext,
        model_pipeline: ModelPipeline
    ) {
        this.adapter = adapter;
        this.device = device;
        this.context = context;
        this.model_pipeline = model_pipeline;    
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
    
        //  Create the pipeline responsible for rendering models.
        const model_pipeline: ModelPipeline = new ModelPipeline(device, canvasFormat);
        
        let engine: Engine = new Engine(
            adapter,
            device,
            context,
            model_pipeline
        );
        return engine;
    }
}
