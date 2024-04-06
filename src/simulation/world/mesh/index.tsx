/**
 * Buffer containing the model's vertices, normals, and indices
 */
export class MeshBuffer {

    /**
     * The name of the MeshBuffer.
     */
    name: string;

    /**
     * The number of vertices to be rendered.
     */
    vertices_count: number;

    /**
     * Buffer containing all the information for a model.
     */
    #buffer: GPUBuffer;

    #normals_offset: number;
    #indices_offset: number;
    #texels_offset: number;

    constructor(device: GPUDevice, mesh_name: string, vertices: number[], 
        normals: number[], texels: number[], indices: number[]
    ) {
        this.name = mesh_name;
        this.vertices_count = indices.length;
        //  Vertices are always positioned first so their offset is always 0
        //  Normals and indices default to 0 before being set in `create_model_buffer`.
        this.#normals_offset = 0;
        this.#indices_offset = 0;
        this.#texels_offset = 0;

        this.#buffer = this.#create_mesh_buffer(device, mesh_name, new Float32Array(vertices), 
            new Float32Array(normals), new Uint32Array(indices), new Float32Array(texels));
    }

    #create_mesh_buffer(device: GPUDevice, 
        mesh_name: string, 
        vertices: Float32Array, 
        normals: Float32Array, 
        indices: Uint32Array,
        texels: Float32Array,
    ): GPUBuffer {
        let mesh_buffer = device.createBuffer({
            label: mesh_name + "'s mesh buffer",
            size: vertices.byteLength + normals.byteLength + indices.byteLength + texels.byteLength,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | 
                GPUBufferUsage.INDEX | GPUBufferUsage.VERTEX,
            mappedAtCreation: false
        });
        device.queue.writeBuffer(mesh_buffer, 0, vertices);

        this.#normals_offset = vertices.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#normals_offset, normals);

        this.#indices_offset = this.#normals_offset + normals.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#indices_offset, indices);

        this.#texels_offset = this.#indices_offset + indices.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#texels_offset, texels);
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
            size: this.#texels_offset - this.#indices_offset
        };
    }

    /**
     * Get the correct spacing into ModelBuffer for texels.
     * @returns
     */
    get_texels_buffer(): { buffer: GPUBuffer, offset: number, size: number} {
        return {
            buffer: this.#buffer,
            offset: this.#texels_offset,
            size: this.#buffer.size - this.#texels_offset
        }
    }
    
    destroy() {
        this.#buffer.destroy();
    }
}

/**
 * The mesh data of models.
 */
export class Mesh {
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
                    usage: 0
                }
            }
        }
    }

    destroy() {
        if(!(this.mesh_buffer.name in Mesh.allocated_meshes)) {
            console.warn(`Couldn't find this mesh ${this.mesh_buffer.name} in the allocated mesh list.`);
            this.mesh_buffer.destroy();
            return;
        }
        Mesh.allocated_meshes[this.mesh_buffer.name].usage--;
        //  Nobody is using this mesh anymore so it can be freed safely.
        if(Mesh.allocated_meshes[this.mesh_buffer.name].usage <= 0) {
            this.mesh_buffer.destroy();
            Mesh.allocated_meshes[this.mesh_buffer.name].data = undefined;
        }
    }
}