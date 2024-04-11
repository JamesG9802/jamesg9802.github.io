import { model_uniform_bytelength } from ".";
import { Mat3, Mat4 } from "wgpu-matrix";
import { Engine } from "simulation/engine";

/**
 * An instance buffer containing the all uniform data to properly draw instances.
 */
export class ModelBuffer {
    //  https://www.w3.org/TR/webgpu/#dom-gpurendercommandsmixin-drawindirect

    /**
     * The indirect parameters needed to draw the model on the CPU side.
     */
    indirect_params: Uint32Array;
    
    /**
     * The indirect buffer needed to draw the model.
     */
    indirect_buffer: GPUBuffer;

    /**
     * The array containing all instance uniform data;
     */
    data: Float32Array;

    /**
     * Buffer containing the uniform data for each instance.
     */
    buffer: GPUBuffer;

    /**
     * The bind group connecting the buffer to the shader.
     */
    bind_group: GPUBindGroup;

    /**
     * True if the buffer is intended to be shared amongst instances instead of uniques.
     */
    #for_instance: boolean;

    /**
     * True if had written the CPU side uniform data to the GPU already. 
     */
    wrote_uniform_already: boolean;

    /**
     * Instances are given a unique number to track them.
     */
    #instance_count: number;

    /**
     * True if the number of tracked instances has changed.
     */
    count_changed: boolean;

    /**
     * The exact order of instance data doesn't really matter.
     * So for optimization instances write to the buffer+offset
     * and update offset afterwards.
     */
    offset: number;

    /**
     * Creates a new MeshBuffer.
     * @param engine 
     * @param mesh_name 
     * @param vertices_count 
     */
    constructor(engine: Engine, 
        mesh_name: string,
        vertices_count: number,
    ) {
        //  Setting the indirect parameters
        this.indirect_params = new Uint32Array(5);
        this.indirect_params.set([vertices_count, 1, 0, 0, 0]);
        this.indirect_buffer = engine.device.createBuffer({
            label: `${mesh_name} instance's indirect buffer`,
            size: 20,    // 5 indirect paramaters of 4 bytes each
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDIRECT,
            mappedAtCreation: false 
        });
        engine.device.queue.writeBuffer(this.indirect_buffer, 0, this.indirect_params);


        this.#for_instance = false;
        this.wrote_uniform_already = false;
        this.#instance_count = 1;
        this.count_changed = false;
        this.offset = 0;

        this.data = this.#create_uniform_data();

        const { uniform_buffer, uniform_bind_group } = this.#create_uniform_buffer(engine, 
            `${mesh_name} instance's buffer`, 
            `${mesh_name} instance's bind group`);
        this.buffer = uniform_buffer;
        this.bind_group = uniform_bind_group;
    }

    /**
     * Creates an array for the uniform data on the CPU side.
     * @param count 
     * @returns 
     */
    #create_uniform_data(): Float32Array { 
        return new Float32Array(this.#instance_count * model_uniform_bytelength / 4);
    }

    /**
     * Creates the buffer for the uniform data on the GPU side.
     * @param device 
     * @param label 
     * @param count 
     * @returns 
     */
    #create_uniform_buffer(engine: Engine, buffer_name: string, bind_group_name: string): {
        uniform_buffer: GPUBuffer,
        uniform_bind_group: GPUBindGroup
    } { 
        if(this.#for_instance)
        {
            const buffer = engine.device.createBuffer({
                label: buffer_name,
                size: model_uniform_bytelength * this.#instance_count,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
                mappedAtCreation: false 
            });
            const bind_group = engine.device.createBindGroup({
                label: bind_group_name,
                layout: engine.model_pipeline.instance_pipeline.getBindGroupLayout(1),
                entries: [{
                    binding: 0,
                    resource: {buffer: buffer}
                }]
            });
            return {
                uniform_buffer: buffer,
                uniform_bind_group: bind_group
            }
        }
        else {
            const buffer = engine.device.createBuffer({
                label: buffer_name,
                size: model_uniform_bytelength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
                mappedAtCreation: false 
            });
            const bind_group = engine.device.createBindGroup({
                label: bind_group_name,
                layout: engine.model_pipeline.unique_pipeline.getBindGroupLayout(1),
                entries: [{
                    binding: 0,
                    resource: {buffer: buffer}
                }]
            });
            return {
                uniform_buffer: buffer,
                uniform_bind_group: bind_group
            }
        }
    }

    /**
     * Permanently converts the model buffer to work with only instances.
     * @param engine 
     * @returns 
     */
    convert_to_instance(engine: Engine) {
        if(this.#for_instance) return;
        this.#for_instance = true;

        this.buffer.destroy();

        this.data = this.#create_uniform_data();
        const { uniform_buffer, uniform_bind_group } = 
            this.#create_uniform_buffer(engine, this.buffer.label, this.bind_group.label);

        this.buffer = uniform_buffer;
        this.bind_group = uniform_bind_group;
    }

    /**
     * Adds an instance that is using this data.
     * @returns 
     */
    add_instance(){
        this.#instance_count++;
        this.count_changed = true;        
    }

    /**
     * Removes an instance that is using this data.
     */
    remove_instance() {
        this.#instance_count--;
        this.count_changed = true;     
    }

    /**
     * Writes an instance's uniform data into the CPU side array.
     * @param device 
     * @param model_view 
     * @param normal_matrix 
     */
    update_uniform(engine: Engine, model_view: Mat4, normal_matrix: Mat3) {
        //  If the count changed, then the buffer is now the wrong size and needs to be recreated.
        //  The count changed property will be reset after the instance renders.
        if(this.count_changed) {
            this.indirect_params.set([this.#instance_count], 1);
            engine.device.queue.writeBuffer(this.indirect_buffer, 0, this.indirect_params);
            
            this.buffer.destroy();

            
            this.data = this.#create_uniform_data();
            const { uniform_buffer, uniform_bind_group } = this.#create_uniform_buffer(engine, 
                this.buffer.label, 
                this.bind_group.label);
            this.buffer = uniform_buffer;
            this.bind_group = uniform_bind_group;

            this.count_changed = false;
        }
        this.data.set(model_view, this.offset+0);
        this.data.set(normal_matrix, this.offset+16);
        this.offset += model_uniform_bytelength / 4;

    }
    
    /**
     * Called when all instance's have submitted their uniform data for rendering.
     * Will write all data to the GPU.
     * @param device 
     */
    write_uniform(device: GPUDevice) {
        if(!this.for_instance) {
            device.queue.writeBuffer(this.buffer, 0, this.data);
            this.wrote_uniform_already = true;
            this.offset = 0;
        }
        if(!this.wrote_uniform_already && this.#for_instance)
        {
            device.queue.writeBuffer(this.buffer, 0, this.data);
            this.wrote_uniform_already = true;
            this.offset = 0;
        }
    }

    /**
     * Frees any resources this buffer is using.
     */
    destroy() {
        this.indirect_buffer.destroy();
        this.buffer.destroy();
    }

    get instance_count(): number { return this.#instance_count; }
    get for_instance(): boolean { return this.#for_instance; }
}