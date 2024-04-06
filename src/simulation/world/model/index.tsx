import { Engine } from "simulation/engine";
import { ModelPipeline } from "./pipeline";
import { Mesh, MeshBuffer } from "simulation/world/mesh";
import { Mat4, vec3 } from "wgpu-matrix";

/**
 * The type of data to be passed into the shader for rendering models
 */
export type ModelUniform = {
    model_view: Mat4,
    normal_matrix: Mat4,
}
export let model_uniform_bytelength: number = 128;

/**
 * The model of an entity. DO NOT SHARE MODELS BETWEEN ENTITIES. IT IS EXPECTED FOR A MODEL TO BE USED BY A SINGLE ENTITY.
 * If you get a model through `load_from_file`, only one entity should use it. However, you can load multiple copies of 
 * the same model through `load_from_file`.
 */
export class Model {
    /**
     * Buffer containing the model's vertices, normals, and indices
     */
    mesh: Mesh;

    /**
     * Buffer containing the model's uniform data (projection, modelview, etc.).
     */
    uniform_buffer: GPUBuffer;

    /**
     * Bind group holding model resources.
     */
    bind_group: GPUBindGroup;

    constructor(engine: Engine, mesh: Mesh, model_name: string) {
        this.mesh = mesh;
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

    static async load_from_file(engine: Engine, mesh_name: string
        ): Promise<Model | undefined> {
        //  Mesh does not exist
        if(!(mesh_name in Mesh.mesh_list)) {
            console.error(`Mesh ${mesh_name} cannot be found.`);
            return;
        }
        //  Mesh does exist,
        else {
            //  but this is the first time loading it.
            if(Mesh.allocated_meshes[mesh_name].usage <= 0) {  
                const obj_data: string[] = ((await Mesh.mesh_list[mesh_name]()) as any).default.split("\n");
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

                let mesh_buffer = new MeshBuffer(engine.device, mesh_name, mesh_vertices,
                    mesh_normals, mesh_texels, mesh_indices);
                Mesh.allocated_meshes[mesh_name].data = mesh_buffer;
                if(mesh_buffer != undefined) {   
                    Mesh.allocated_meshes[mesh_name].usage++;
                    return new Model(engine, new Mesh(mesh_name, mesh_buffer), mesh_name);
                }
                else
                    return undefined;
            }
            //  Or the mesh already exists
            else {
                let mesh_buffer = Mesh.allocated_meshes[mesh_name].data;
                if(mesh_buffer != undefined) {
                    Mesh.allocated_meshes[mesh_name].usage++;
                    return new Model(engine, new Mesh(mesh_name, mesh_buffer), mesh_name);
                }
                else {
                    console.error("The model is being used, but for some reason it does not exist.");
                    return undefined;
                }
            }
        }
    }

    /**
     * Frees up resources.
     */
    destroy() {
        this.mesh.destroy();
        this.uniform_buffer.destroy();
    }
}

export { ModelPipeline };
