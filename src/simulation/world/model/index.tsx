import { Engine } from "simulation/engine";
import { ModelPipeline } from "simulation/engine/webgpu/pipelines/model";
import { Mesh } from "simulation/world/mesh";
import { Mat3, Mat4, } from "wgpu-matrix";
import { ModelBuffer } from "./model_buffer";

/**
 * The type of data to be passed into the shader for rendering models
 * (This is isn't actually used anywhere, this is just for reference)
 */
export type ModelUniform = {
    model_view: Mat4,
    normal_matrix: Mat3,
}

//  Model uniform is made of 32 bit floats (4 bytes) so divide by 4 to get total number of floats.
export let model_uniform_bytelength: number = 112;

/**
 * The model of an entity. DO NOT SHARE MODELS BETWEEN ENTITIES. IT IS EXPECTED FOR A MODEL TO BE USED BY A SINGLE ENTITY.
 * If you get a model through `load_from_file`, only one entity should use it. However, you can load multiple copies of 
 * the same model through `load_from_file`. You can 'share' models by creating an instance copy.
 */
export class Model {
    /**
     * Buffer containing the model's vertices, normals, and indices
     */
    mesh: Mesh;

    /**
     * The buffer containing the model's uniform data.
     */
    uniform_buffer: ModelBuffer;

    /**
     * 
     * @param engine 
     * @param mesh 
     * @param model_name 
     * @param instance_id if the instance id == -1, then the model is an instance
     */
    constructor(engine: Engine, mesh: Mesh, uniform_buffer?: ModelBuffer) {
        this.mesh = mesh;

        if(uniform_buffer) {
            this.uniform_buffer = uniform_buffer;
            if(this.uniform_buffer.for_instance)
                this.uniform_buffer.add_instance();
        }
        else 
            this.uniform_buffer = new ModelBuffer(
                engine, 
                mesh.name,
                this.mesh.mesh_buffer.vertices_count
            );
    }

    /**
     * Loads a model from a file.
     * @param engine 
     * @param mesh_name 
     * @returns 
     */
    static async load_from_file(engine: Engine, mesh_name: string
    ): Promise<Model | undefined> {
        const mesh: Mesh | undefined = await Mesh.get_mesh(engine, mesh_name);
        if(mesh)
            return new Model(engine, mesh);
    }

    /**
     * Permanently converts this model from a unique to an instance model.
     * Also returns an instance model that shares the model data.
     * @param engine 
     * @returns 
     */
    create_instance_copy(engine: Engine): Model {
        this.uniform_buffer.convert_to_instance(engine);
        return new Model(engine, this.mesh, this.uniform_buffer);
    }

    /**
     * Updates the CPU side uniform data.
     * @param engine 
     * @param model_view 
     * @param normal_matrix 
     */
    update_uniform(engine: Engine, model_view: Mat4, normal_matrix: Mat3) {
        this.uniform_buffer.update_uniform(engine, model_view, normal_matrix);
    }

    /**
     * Writes the CPU side uniform data to the GPU.
     * @param engine 
     */
    write_uniform(engine: Engine) {
        this.uniform_buffer.write_uniform(engine.device);
    }

    /**
     * Frees up resources.
     */
    destroy() {
        if(!this.uniform_buffer.for_instance) 
            this.mesh.destroy();
        else if(this.uniform_buffer.instance_count >= 1) {
            this.uniform_buffer.remove_instance();
        }
        else {
            this.mesh.destroy();
            this.uniform_buffer.destroy();
        }
    }

    get is_instance(): boolean { return this.uniform_buffer.for_instance; }
}

export { ModelPipeline };
