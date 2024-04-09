import { Engine } from "simulation/engine";
import { ModelPipeline } from "simulation/engine/pipelines/model";
import { Mesh } from "simulation/world/mesh";
import { Mat3, Mat4, } from "wgpu-matrix";

/**
 * The type of data to be passed into the shader for rendering models
 * (This is isn't actually used anywhere, this is just for reference)
 */
export type ModelUniform = {
    model_view: Mat4,
    normal_matrix: Mat3,
}
export let model_uniform_bytelength: number = 112;

/**
 * The model of an entity. DO NOT SHARE MODELS BETWEEN ENTITIES. IT IS EXPECTED FOR A MODEL TO BE USED BY A SINGLE ENTITY.
 * If you get a model through `load_from_file`, only one entity should use it. However, you can load multiple copies of 
 * the same model through `load_from_file`.
 */
export class Model {
    /**
     * Whether or not the model is a unique model or an instance. 
     * Instances all share the same mesh (so changing one affects everything else).
     * Non-instances have their own mesh data.
     * 
     */
    is_instance: boolean;
    
    instance_id: number;

    /**
     * Buffer containing the model's vertices, normals, and indices
     */
    mesh: Mesh;

    /**
     * Data where the uniform data is stored in.
     */
    uniform_data: Float32Array;

    /**
     * Buffer containing the model's uniform data (projection, modelview, etc.).
     */
    uniform_buffer: GPUBuffer | undefined;

    /**
     * Bind group holding model resources.
     */
    bind_group: GPUBindGroup | undefined;

    /**
     * 
     * @param engine 
     * @param mesh 
     * @param model_name 
     * @param instance_id if the instance id == -1, then the model is an instance
     */
    constructor(engine: Engine, mesh: Mesh, model_name: string, instance_id: number = -1) {
        this.mesh = mesh;
        this.is_instance = instance_id != -1;
        this.instance_id = instance_id;
        //  4 bytes per float
        this.uniform_data = new Float32Array(this.is_instance ? 0 : model_uniform_bytelength / 4 );
        
        //  Non instances are responsible for tracking their own uniform buffer.
        if(!this.is_instance) {
            this.uniform_buffer = engine.device.createBuffer({
                label: model_name + "'s uniform buffer",
                size: model_uniform_bytelength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
                mappedAtCreation: false
            });
            this.bind_group = engine.device.createBindGroup({
                label: "Renderer bind group",
                layout: engine.bind_group_layouts.model_bind_group_layout[1],
                entries: [{
                    binding: 0,
                    resource: {buffer: this.uniform_buffer}
                }]
            });
        }
    }

    static async load_from_file(engine: Engine, mesh_name: string, 
        is_instance: boolean = true
    ): Promise<Model | undefined> {
        //  Mesh does not exist
        if(!(mesh_name in Mesh.mesh_list)) {
            console.error(`Mesh ${mesh_name} cannot be found.`);
            return;
        }
        //  Mesh does exist,
        else {
            //  but this is either the first time loading it OR this is not an instance model
            //  (which means that a new mesh must be fetched because there is no guarantees that
            //  the existing mesh is unaltered from instances using it.
            if(Mesh.allocated_meshes[mesh_name].usage <= 0 || !is_instance) {  
                const obj_data: string[] = ((await Mesh.mesh_list[mesh_name]()) as any).default.split("\n");
                const obj = Mesh.parse_obj(mesh_name, obj_data);
                if(obj != undefined) {
                    const {mesh, instance_id} = Mesh.create_mesh(engine, is_instance, mesh_name, obj.mesh_vertices,
                        obj.mesh_normals, 
                        obj.mesh_texels, 
                        obj.mesh_indices);
                    return new Model(engine, mesh,mesh_name, instance_id);
                }
            }
            //  Or the mesh already exists
            else {
                const allocated = Mesh.get_allocated_mesh(mesh_name);
                if(allocated)
                    return new Model(engine, allocated.mesh, mesh_name, allocated.instance_id);
            }
        }
    }

    update_uniform(engine: Engine, model_view: Mat4, normal_matrix: Mat3) {
        //  Non instances have their own mesh data.
        if(!this.is_instance && this.uniform_buffer) {
            this.uniform_data.set(model_view, 0);
            this.uniform_data.set(normal_matrix, 16);
            engine.device.queue.writeBuffer(this.uniform_buffer, 0, this.uniform_data);
        }
        //  Instances share an instance buffer.
        else if (this.is_instance) {
            let instance_buffer = Mesh.allocated_meshes[this.mesh.name].instance_buffer;
            if(instance_buffer == undefined) {
                console.error(`${this.mesh.name}'s instance buffer is invalid.`);
                return;
            }
            instance_buffer.update_uniform(engine, model_view, normal_matrix);
        }
    }

    /**
     * Frees up resources.
     */
    destroy() {
        this.mesh.destroy(this.is_instance, this.instance_id);
        if(this.uniform_buffer)
            this.uniform_buffer.destroy();
    }
}

export { ModelPipeline };
