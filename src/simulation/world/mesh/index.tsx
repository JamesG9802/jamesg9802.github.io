import { vec3 } from "wgpu-matrix";
import { InstanceBuffer } from "./instance_buffer";
import { MeshBuffer } from "./mesh_buffer";
import { Engine } from "simulation/engine";
import { World } from "..";

/**
 * The mesh data of models.
 */
export class Mesh {
    /**
    * A dictionary of mesh names to their file paths. 
    */
    static mesh_list: { [Name: string]: () => Promise<unknown>};

    /**
     * A dictionary of allocated meshes for instances. Insance models share the same GPUBuffer when using the same mesh.
     */
    static allocated_meshes: { [Name: string]: {
        /**
         * The actual mesh data.
        */
        data: MeshBuffer | undefined, 
        
        /**
         * The buffer each instance's uniform data is stored.
         */
        instance_buffer: InstanceBuffer | undefined,

        /**
         * The number of users of this mesh.
        */
        usage: number 
    }};

    name: string;

    mesh_buffer: MeshBuffer;

    constructor(name: string, mesh_buffer: MeshBuffer) {
        this.name = name;
        this.mesh_buffer = mesh_buffer;
    }

    /**
     * Keeps track of the file paths to every model to be able to load as needed.
     */
    static async initialize_dictionary() {
        if(Mesh.mesh_list == undefined) {
            Mesh.mesh_list = {};
            Mesh.allocated_meshes = {};
        }
        const models = await import.meta.glob(`/src/assets/meshes/*.obj`, {query: "?raw"});
        console.log("Finding model file paths.");
        for(const path in models) {
            //  https://stackoverflow.com/a/25221100
            //  Get the file name of the model
            let file_name_with_extension = path.split('\\').pop()?.split('/').pop();
            let file_name = file_name_with_extension?.substring(0, file_name_with_extension.lastIndexOf("."));
            if(file_name == undefined)
            {
                console.error(`Couldn't parse ${path}`);
                continue;
            }
            console.info(`\t${path} -> ${file_name}`);
            if(!(file_name in Mesh.mesh_list)) {
                this.mesh_list[file_name] = models[path];
                this.allocated_meshes[file_name] = {
                    data: undefined,
                    instance_buffer: undefined,
                    usage: 0
                }
            }
        }
    }

    static parse_obj(mesh_name: string, obj_data: string[]): {
        mesh_vertices: number[],
        mesh_texels: number[],
        mesh_normals: number[],
        mesh_indices: number[],
    } | undefined {
        let vertices: number[] = [];
        let normals: number[] = [];
        let texels: number[] = [];  //  not support atm
        let faces: string[] = [];

        //  For each line
        for(let line = 0; line < obj_data.length; line++) {
            //  Split up data by spaces
            const data = obj_data[line].split(" ");
            if(data.length <= 1)
                continue;
            const identifier = data[0];
            for(let i = 1; i < data.length; i++) {
                if(identifier == "v")   //  vertex
                    vertices.push(Number(data[i]));
                else if(identifier == "vn") //  normals
                    normals.push(Number(data[i]));
                else if(identifier == "vt") //  texels
                    texels.push(Number(data[i]));
                else if(identifier == "f") {    //  faces   
                    faces.push(data[i]);
                }
            }
        }
        
        //  To be more efficient, we read the faces to figure out the correct indices of vertices
        //  We also normalize the normals so that shaders do not need to do it themselves.

        //  based off https://carmencincotti.com/2022-06-06/load-obj-files-into-webgpu/
        //  https://github.com/ccincotti3/webgpu_cloth_simulator/blob/a7929ff10975ba06bbd6ef7a495d55faeedd1ccb/src/ObjLoader.ts
        
        let mesh_vertices: number[] = [];
        let mesh_texels: number[] = [];
        let mesh_normals: number[] = [];
        let mesh_indices: number[] = [];

        let seen_indices: Record<string, number> = {};
        let index = 0;
        for (let i = 0; i < faces.length; i++) {
            let face: string = faces[i];
            //  This means that this vertex combination has been found before.
            //  So we just add the index to the list.
            if(seen_indices[face] != undefined) {
                mesh_indices.push(seen_indices[face]);
                continue;
            }
            //  Otherwise we never found it before so we add it to the tracked combinations.
            //  Then we increment the index for the next new combination.
            seen_indices[face] = index;
            mesh_indices.push(index++);

            //  Finally we need to parse the string so that the mesh's indices point to 
            //  the correct vertices, normals, and texels.
            //  .OBJ files are 1-indexed so we need to correct that.
            let face_delineated: string[] = face.split("/");
            if(face_delineated.length < 0) {
                console.error(`Model ${mesh_name} has improperly formatted faces.`);
                return;
            }
            mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 0]);
            mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 1]);
            mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 2]);
            
            mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 0]);
            mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 1]);
            mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 2]);
            
            //  Normalizing normals.;
            let normal_vector = vec3.normalize(vec3.fromValues(normals[(Number(face_delineated[2]) - 1) * 3 + 0],
                normals[(Number(face_delineated[2]) - 1) * 3 + 1],
                normals[(Number(face_delineated[2]) - 1) * 3 + 2]));
            mesh_normals.push(normal_vector[0]);
            mesh_normals.push(normal_vector[1]);
            mesh_normals.push(normal_vector[2]);
        }
        return {
            mesh_vertices: mesh_vertices,
            mesh_normals: mesh_normals,
            mesh_texels: mesh_texels,
            mesh_indices: mesh_indices
        }
    }

    /**
     * Creates a mesh. If the mesh is an instance, it will add it to the allocated meshes.
     */
    static create_mesh(engine: Engine, is_instance: boolean, mesh_name: string, mesh_vertices: number[],
        mesh_normals: number[], mesh_texels: number[], mesh_indices: number[]
    ): {mesh: Mesh, instance_id?: number} {
        let instance_id: number | undefined;
        let mesh_buffer = new MeshBuffer(engine.device, mesh_name, mesh_vertices,
            mesh_normals, mesh_texels, mesh_indices);
    
        //  Non instances do not share their meshes and thus do not
        //  track their meshes in the global pool
        if(is_instance) {
            Mesh.allocated_meshes[mesh_name].data = mesh_buffer;
            Mesh.allocated_meshes[mesh_name].instance_buffer 
                = new InstanceBuffer(engine, mesh_name, [mesh_indices.length, 0, 0, 0, 0]);
            Mesh.allocated_meshes[mesh_name].usage++;
            instance_id = Mesh.allocated_meshes[mesh_name].instance_buffer?.add_instance() as number;
        }
        return {
            mesh: new Mesh(mesh_name, mesh_buffer),
            instance_id: instance_id
        };
    }

    /**
     * Gets a preallocated mesh for an instance.
     * @param mesh_name the name of the mesh
     * @returns 
     */
    static get_allocated_mesh(mesh_name: string): {mesh: Mesh, instance_id: number} | undefined {
        let instance_id: number;
        let mesh_buffer = Mesh.allocated_meshes[mesh_name].data;
        if(mesh_buffer != undefined) {
            Mesh.allocated_meshes[mesh_name].usage++;
            instance_id = Mesh.allocated_meshes[mesh_name].instance_buffer?.add_instance() as number;
            return {
                mesh: new Mesh(mesh_name, mesh_buffer),
                instance_id: instance_id
            };
        }
        else {
            console.error("The model is being used, but for some reason it does not exist.");
            return undefined;
        }
    }

    static render_instance(engine: Engine, world: World, mesh_name: string) {
        if(Mesh.allocated_meshes[mesh_name].usage == 0)
            return;
        else if(!Mesh.allocated_meshes[mesh_name].data  || !Mesh.allocated_meshes[mesh_name].instance_buffer) {
            console.warn(`${mesh_name} is being used but its data/instance buffer doesn't exist.`);
            return;
        }
        (Mesh.allocated_meshes[mesh_name].instance_buffer as InstanceBuffer).write_uniform(engine.device);
        engine.model_pipeline.render_instance(world, mesh_name);
        //  Reset tracking variables so the next iteration's writes will work properly.
        (Mesh.allocated_meshes[mesh_name].instance_buffer as InstanceBuffer).offset = 0;
        (Mesh.allocated_meshes[mesh_name].instance_buffer as InstanceBuffer).count_changed = false;
    }

    /**
     * Called when the mesh's data needs to be freed. If the mesh came from a non-instance,
     * it isn't in the global allocated meshes.
     * @param is_instance 
     * @returns 
     */
    destroy(is_instance: boolean, instance_id: number) {
        //  Non instances have unique mesh data and so can be safely destroyed.
        if(!is_instance) {
            this.mesh_buffer.destroy();
            return;
        }

        if(!(this.mesh_buffer.name in Mesh.allocated_meshes)) {
            console.warn(`Couldn't find this mesh ${this.mesh_buffer.name} in the allocated mesh list.`);
            this.mesh_buffer.destroy();
            return;
        }
        Mesh.allocated_meshes[this.mesh_buffer.name].usage--;
        
        //  Instances need to unregister themselves
        Mesh.allocated_meshes[this.mesh_buffer.name].instance_buffer?.remove_instance(instance_id);

        //  Nobody is using this mesh anymore so it can be freed safely.
        if(Mesh.allocated_meshes[this.mesh_buffer.name].usage <= 0) {
            this.mesh_buffer.destroy();
            Mesh.allocated_meshes[this.mesh_buffer.name].data = undefined;
            if(Mesh.allocated_meshes[this.mesh_buffer.name].instance_buffer == undefined) {
                console.error(`${this.mesh_buffer.name} is an instance, yet no instance buffer was found.`);
            }
            Mesh.allocated_meshes[this.mesh_buffer.name].instance_buffer?.destroy();
            Mesh.allocated_meshes[this.mesh_buffer.name].instance_buffer = undefined;
        }
    }
}