import { Pool } from "utilitity/pool";
import { model_uniform_bytelength } from "../model";
import { Mat3, Mat4 } from "wgpu-matrix";
import { Engine } from "simulation/engine";

/**
 * An instance buffer containing the all uniform data to properly draw instances.
 */
export class InstanceBuffer {
    //  https://www.w3.org/TR/webgpu/#dom-gpurendercommandsmixin-drawindirect
    indirect_params: Uint32Array;
    indirect_buffer: GPUBuffer;

    /**
     * The array containing all instance uniform data;
     */
    uniform_data: Float32Array;
    /**
     * Buffer containing the uniform data for each instance.
     */
    uniform_buffer: GPUBuffer;
    /**
     * The bind group connecting the buffer to the shader.
     */
    uniform_bind_group: GPUBindGroup;

    /**
     * Instances are given a unique number to track them.
     */
    tracked_instances: Pool<number>;

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

    constructor(engine: Engine, 
        mesh_name: string,
        indirect_params: number[]
    ) {
        //  Setting the indirect parameters
        this.indirect_params = new Uint32Array(5);
        this.indirect_params.set(indirect_params);
        this.indirect_buffer = engine.device.createBuffer({
            label: `${mesh_name} instance's indirect buffer`,
            size: 20,    // 5 indirect paramaters of 4 bytes each
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDIRECT,
            mappedAtCreation: false 
        });

        //  each float is 4 bytes
        this.uniform_data = this.#create_uniform_data(1);
        this.uniform_buffer = this.#create_uniform_buffer(engine.device, 
            `${mesh_name} instance's storage buffer`, 1);

        this.uniform_bind_group = engine.device.createBindGroup({
            label: `${mesh_name} instance's bind group`,
            layout: engine.model_pipeline.instance_pipeline.getBindGroupLayout(1),
            entries: [{
                binding: 0,
                resource: {buffer: this.uniform_buffer}
            }]
        });

        this.tracked_instances = new Pool<number>();
        this.count_changed = false;
        this.offset = 0;
    }

    /**
     * Creates an array for the uniform data on the CPU side.
     * @param count 
     * @returns 
     */
    #create_uniform_data(count: number) { return new Float32Array(count * model_uniform_bytelength / 4)}

    /**
     * Creates the buffer for the uniform data on the GPU side.
     * @param device 
     * @param label 
     * @param count 
     * @returns 
     */
    #create_uniform_buffer(device: GPUDevice, label: string, count: number) { 
        return device.createBuffer({
            label: label,
            size: model_uniform_bytelength * count,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
            mappedAtCreation: false 
        });
    }

    /**
     * Returns a unique ID for the instance to identify itself with.
     * @returns 
     */
    add_instance(): number {
        let instance_id: number;
        if(this.tracked_instances.has_unused())
            instance_id = this.tracked_instances.get_unused() as number;
        else    
        {
            //  If there are no unused instances, then all elements are in tracked_instances
            //  so the count will be a unique number.
            instance_id = this.tracked_instances.count;
            this.tracked_instances.add_element(instance_id);
        }
        this.count_changed = true;
        return instance_id;        
    }
    remove_instance(instance_id: number) {
        if(this.tracked_instances.remove_element(instance_id))
        {
            console.error(`Tried to delete instance id #${instance_id} but failed for some reason.`);
        }
        this.count_changed = true;
        return instance_id;        
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
            this.indirect_params.set([this.tracked_instances.count], 1);
            engine.device.queue.writeBuffer(this.indirect_buffer, 0, this.indirect_params);
            this.uniform_buffer.destroy();
            this.uniform_data = this.#create_uniform_data(this.tracked_instances.count);
            this.uniform_buffer = this.#create_uniform_buffer(engine.device, this.uniform_buffer.label, this.tracked_instances.count);
            this.uniform_bind_group = engine.device.createBindGroup({
                label: `${this.uniform_bind_group.label}`,
                layout: engine.model_pipeline.instance_pipeline.getBindGroupLayout(1),
                entries: [{
                    binding: 0,
                    resource: {buffer: this.uniform_buffer}
                }]
            });
            this.count_changed = false;
        }
        
        this.uniform_data.set(model_view, this.offset+0);
        this.uniform_data.set(normal_matrix, this.offset+16);
        this.offset += model_uniform_bytelength / 4;

    }
    
    /**
     * Called when all instance's have submitted their uniform data for rendering.
     * Will write all data to the GPU.
     * @param device 
     */
    write_uniform(device: GPUDevice) {
        device.queue.writeBuffer(this.uniform_buffer, 0, this.uniform_data);
    }

    destroy() {
        this.indirect_buffer.destroy();
        this.uniform_buffer.destroy();
    }
}