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