import { ModelPipeline } from "simulation/world/model";

/**
 * The engine handles all connections with the WebGPU API. It also holds the pipelines for rendering
 * objects to the screen.
 */
export class Engine {
    /**
     * The adapter represents the physical GPU.
     */
    adapter: GPUAdapter;
    
    /**
     * The device represents the logical GPU.
     */
    device: GPUDevice;

    /**
     * The context of the HTML Canvas that the engine renders to.
     */
    context: GPUCanvasContext;

    /**
     * The model pipeline responsible for drawing models to the screens.
     */
    model_pipeline: ModelPipeline;

    /**
     * Creates a new Engine. Use `create()` instead.
     * @param adapter 
     * @param device 
     * @param context 
     * @param model_pipeline 
     */
    constructor(adapter: GPUAdapter, device: GPUDevice, 
        context: GPUCanvasContext, model_pipeline: ModelPipeline,
    ) {
        this.adapter = adapter;
        this.device = device;
        this.context = context;
        this.model_pipeline = model_pipeline;
    }

    /**
     * Creates and returns a Promise containing a new Engine. Returns undefined on failure.
     * @param canvas 
     * @returns 
     */
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
        const model_pipeline: ModelPipeline = ModelPipeline.create(device, context, canvasFormat);

        let engine: Engine = new Engine(
            adapter,
            device,
            context,
            model_pipeline
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
