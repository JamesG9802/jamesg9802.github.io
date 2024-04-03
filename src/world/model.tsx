import { Engine } from "engine";
import { vec3 } from "gl-matrix";
import { mat4 } from "gl-matrix";

/**
 * Buffer containing the model's vertices, normals, and indices
 */
export class MeshBuffer {

    vertices_count: number;

    /**
     * Buffer containing all the information for a model.
     */
    #buffer: GPUBuffer;

    #normals_offset: number;
    #indices_offset: number;

    constructor(device: GPUDevice, mesh_name: string, vertices: number[], 
        normals: number[], texels: number[], indices: number[]
    ) {
        this.vertices_count = indices.length;
        //  Vertices are always positioned first so their offset is always 0
        //  Normals and indices default to 0 before being set in `create_model_buffer`.
        this.#normals_offset = 0;
        this.#indices_offset = 0;

        this.#buffer = this.#create_mesh_buffer(device, mesh_name, new Float32Array(vertices), 
            new Float32Array(normals), new Uint32Array(indices));
    }

    #create_mesh_buffer(device: GPUDevice, 
        mesh_name: string, 
        vertices: Float32Array, 
        normals: Float32Array, 
        indices: Uint32Array,
    ): GPUBuffer {
        let mesh_buffer = device.createBuffer({
            label: mesh_name + "'s mesh buffer",
            size: vertices.byteLength + normals.byteLength + indices.byteLength,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | 
                GPUBufferUsage.INDEX | GPUBufferUsage.VERTEX,
            mappedAtCreation: false
        });
        device.queue.writeBuffer(mesh_buffer, 0, vertices);

        this.#normals_offset = vertices.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#normals_offset, normals);

        this.#indices_offset = this.#normals_offset + normals.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#indices_offset, indices);
        return mesh_buffer;
    }

    /**
     * Get the correct spacing into ModelBuffer for vertices.
     * @returns 
     */
    get_vertices_buffer(): { buffer: GPUBuffer, offset: number, size: number} {
        return {
            buffer: this.#buffer,
            offset: 0,
            size: this.#normals_offset
        };
    }

    /**
     * Get the correct spacing into ModelBuffer for normals.
     * @returns 
     */
    get_normals_buffer(): { buffer: GPUBuffer, offset: number, size: number} {
        return {
            buffer: this.#buffer, 
            offset: this.#normals_offset, 
            size: this.#indices_offset - this.#normals_offset
        };
    }

    /**
     * Get the correct spacing into ModelBuffer for indices.
     * @returns 
     */
    get_indices_buffer(): { buffer: GPUBuffer, offset: number, size: number} {
        return {
            buffer: this.#buffer,
            offset: this.#indices_offset,
            size: this.#buffer.size - this.#indices_offset
        };
    }
    
    destroy() {
        this.#buffer.destroy();
    }
}

/**
 * Render pipeline specifically for rendering models.
 */
export class ModelPipeline {

    /**
     * Render pipeline for models.
     */
    pipeline: GPURenderPipeline;
    
    /**
     * Bind group layout for this pipeline.
     */
    bind_group_layout: GPUBindGroupLayout;

    /**
     * Creates a new Model Pipeline.
     * @param device the GPU device
     * @param canvas_format the format of the target canvas
     */
    constructor(device: GPUDevice, canvas_format: GPUTextureFormat) {
        //  Set up the shader
        const shader = device.createShaderModule({
            label: "Shader",
            code: `
                @group(0) @binding(0) var<uniform> model_view: mat4x4<f32>;
                @vertex
                fn vertexMain(@location(0) pos: vec3f, @location(1) normal: vec3f) -> @builtin(position) vec4f {
                    return vec4f(pos.x, pos.y, pos.z, 1);
                }
                @fragment
                fn fragmentMain() -> @location(0) vec4f {
                    return vec4f(1, model_view[0][0], model_view[0][1], 1);
                }
            `
        });

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
            }
        ];

        this.bind_group_layout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {
                    type: 'uniform',
                },
            }],
        });
        const model_pipeline_layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.bind_group_layout]
        })
        this.pipeline = device.createRenderPipeline({
            label: "Model pipeline",
            layout: model_pipeline_layout,
            vertex: {
                module: shader,
                entryPoint: "vertexMain",
                buffers: vertex_layout
            },
            fragment: {
                module: shader,
                entryPoint: "fragmentMain",
                targets: [{
                    format: canvas_format
                }]
            }
        });
    }
    
    /**
     * Simplest way to render model.
     * @param engine 
     * @param model 
     */
    render(engine: Engine, model: Model) {
        const encoder: GPUCommandEncoder = engine.device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: engine.context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, model.bind_group);

        let vertices = model.mesh_buffer.get_vertices_buffer();
        pass.setVertexBuffer(0, vertices.buffer, vertices.offset, vertices.size);

        let normals = model.mesh_buffer.get_normals_buffer();
        pass.setVertexBuffer(1, normals.buffer, normals.offset, normals.size);

        let indices = model.mesh_buffer.get_indices_buffer();

        pass.setIndexBuffer(indices.buffer, "uint32", indices.offset, indices.size);

        pass.drawIndexed(model.mesh_buffer.vertices_count);
        pass.end();
        engine.device.queue.submit([encoder.finish()]);
    }
}

/**
 * The type of data to be passed into the shader for rendering models
 */
export type ModelUniform = {
    model_view: mat4,
}

export let model_uniform_bytelength: number = 64;

export class Model {
    /**
     * A dictionary of mesh names to their file paths. 
     */
    static mesh_list: { [Name: string]: () => Promise<unknown>};

    /**
     * A dictionary of allocated meshes. Models share the same GPUBuffer when using the same mesh.
     */
    static allocated_meshes: { [Name: string]: {
        /**
         * The actual mesh data.
         */
        data: MeshBuffer | undefined, 
        
        /**
         * The number of users of this mesh.
         */
        usage: number 
    }};
    
    /**
     * Buffer containing the model's vertices, normals, and indices
     */
    mesh_buffer: MeshBuffer;

    /**
     * Buffer containing the model's uniform data.
     */
    uniform_buffer: GPUBuffer;

    /**
     * Bind group holding model resources.
     */
    bind_group: GPUBindGroup;

    constructor(device: GPUDevice, model_pipeline: ModelPipeline, mesh_buffer: MeshBuffer, model_name: string) {
        this.mesh_buffer = mesh_buffer;
        this.uniform_buffer = device.createBuffer({
            label: model_name + "'s uniform buffer",
            size: model_uniform_bytelength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: false
        });
        this.bind_group = device.createBindGroup({
            label: "Renderer bind group",
            layout: model_pipeline.bind_group_layout,
            entries: [{
                binding: 0,
                resource: {buffer: this.uniform_buffer}
            }]
        })
    }

    /**
     * Keeps track of the file paths to every model to be able to load as needed.
     */
    static async initialize_dictionary() {
        if(Model.mesh_list == undefined) {
            Model.mesh_list = {};
            Model.allocated_meshes = {};
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
            if(!(file_name in Model.mesh_list)) {
                this.mesh_list[file_name] = models[path];
                this.allocated_meshes[file_name] = {
                    data: undefined,
                    usage: 0
                }
            }
        }
    }

    static async load_from_file(device: GPUDevice, model_pipeline: ModelPipeline, model_name: string
        ): Promise<Model | undefined> {
        //  Mesh does not exist
        if(!(model_name in Model.mesh_list)) {
            console.error(`Model ${model_name} cannot be found.`);
            return;
        }
        //  Mesh does exist,
        else {
            //  but this is the first time loading it.
            if(Model.allocated_meshes[model_name].usage == 0) {  
                const obj_data: string[] = ((await Model.mesh_list[model_name]()) as any).default.split("\n");
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
                        console.error(`Model ${model_name} has improperly formatted faces.`);
                        return;
                    }
                    mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 0]);
                    mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 1]);
                    mesh_vertices.push(vertices[(Number(face_delineated[0]) - 1) * 3 + 2]);
                    
                    mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 0]);
                    mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 1]);
                    mesh_texels.push(texels[(Number(face_delineated[1]) - 1) * 3 + 2]);
                    
                    //  Normalizing normals.
                    let normal_vector = vec3.normalizen(vec3.fromValues(normals[(Number(face_delineated[2]) - 1) * 3 + 0],
                        normals[(Number(face_delineated[2]) - 1) * 3 + 1],
                        normals[(Number(face_delineated[2]) - 1) * 3 + 2]
                    ));
                    mesh_normals.push(normal_vector[0]);
                    mesh_normals.push(normal_vector[1]);
                    mesh_normals.push(normal_vector[2]);
                }

                Model.allocated_meshes[model_name].data = new MeshBuffer(device, model_name, mesh_vertices,
                    mesh_normals, mesh_texels, mesh_indices);
                let buffer = Model.allocated_meshes[model_name].data;
                if(buffer != undefined) {   
                    Model.allocated_meshes[model_name].usage++;
                    return new Model(device, model_pipeline, buffer, model_name);
                }
                else
                    return undefined;
            }
            //  Or the mesh already exists
            else {
                let buffer = Model.allocated_meshes[model_name].data;
                if(buffer != undefined) {
                    Model.allocated_meshes[model_name].usage++;
                    return new Model(device, model_pipeline, buffer, model_name);
                }
                else {
                    console.error("The model is being used, but for some reason it does not exist.");
                    return undefined;
                }
            }
        }
    }

    /**
     * Sets the model matrix of the model (position, rotation, scale) to the uniform buffer.
     * @param matrix 
     */
    set_model_matrix(device:GPUDevice, matrix: mat4) {
        device.queue.writeBuffer(this.uniform_buffer, 0, mat4.toFloat32Array(matrix));
    }

    /**
     * Frees up resources.
     */
    destroy() {
        this.mesh_buffer.destroy();
        this.uniform_buffer.destroy();
    }
}