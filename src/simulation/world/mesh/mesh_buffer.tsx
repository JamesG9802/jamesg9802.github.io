import { Engine } from "simulation/engine";

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

    /**
     * The vertex data of the mesh.
     */
    vertices: Float32Array;

    /**
     * The normal data of the mesh.
     */
    normals: Float32Array;

    /**
     * The UV image coordinate data of the mesh.
     */
    texels: Float32Array;

    /**
     * The index data of the mesh.
     */
    indices: Uint32Array;

    /**
     * The offset into the buffer where the normal data starts.
     */
    #normals_offset: number;

    /**
     * The offset into the buffer where the index data starts.
     */
    #indices_offset: number;

    /**
     * The offset into the buffer where the texel data starts.
     */
    #texels_offset: number;

    /**
     * Creates a new MeshBuffer.
     * @param device 
     * @param mesh_name 
     * @param vertices 
     * @param normals 
     * @param texels 
     * @param indices 
     */
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

        this.vertices = new Float32Array(vertices);
        this.normals = new Float32Array(normals);
        this.texels = new Float32Array(texels);
        this.indices = new Uint32Array(indices);

        this.#buffer = this.#create_buffer(device);
    }

    /**
     * Creates the GPU buffer.
     * @param device 
     * @returns 
     */
    #create_buffer(device: GPUDevice): GPUBuffer {
        let mesh_buffer = device.createBuffer({
            label: this.name + "'s mesh buffer",
            size: this.vertices.byteLength + 
                this.normals.byteLength + 
                this.indices.byteLength + 
                this.texels.byteLength,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | 
                GPUBufferUsage.INDEX | GPUBufferUsage.VERTEX,
            mappedAtCreation: false
        });
        device.queue.writeBuffer(mesh_buffer, 0, this.vertices);

        this.#normals_offset = this.vertices.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#normals_offset, this.normals);

        this.#indices_offset = this.#normals_offset + this.normals.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#indices_offset, this.indices);

        this.#texels_offset = this.#indices_offset + this.indices.byteLength;
        device.queue.writeBuffer(mesh_buffer, this.#texels_offset, this.texels);
        return mesh_buffer;
    }

    /**
     * Returns a deep clone of the mesh buffer.
     * @param engine 
     * @returns 
     */
    clone(engine: Engine): MeshBuffer {
        let vertices: number[] = [];
        let normals: number[] = [];
        let texels: number[] = [];
        let indices: number[] = [];

        for(let i = 0; i < this.vertices.length; i++)
            vertices[i] = this.vertices[i];

        for(let i = 0; i < this.normals.length; i++)
            normals[i] = this.normals[i];

        for(let i = 0; i < this.texels.length; i++)
            texels[i] = this.texels[i];
        
        for(let i = 0; i < this.indices.length; i++)
            indices[i] = this.indices[i];

        return new MeshBuffer(engine.device, this.name, vertices,
            normals, texels, indices);
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
    
    /**
     * Frees the resources the MeshBuffer uses.
     */
    destroy() {
        this.#buffer.destroy();
    }
}