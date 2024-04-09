import { model_uniform_bytelength } from "simulation/world/model";

export function get_model_shader(is_model_shader: boolean) {

    const vertex_out = is_model_shader ?
    `struct VertexOut {
        @builtin(position) position : vec4f,
        @location(1) normal : vec3f,
        @location(2) eye_coords : vec3f
    }`
    :
    `struct VertexOut {
        @builtin(position) position : vec4f,
        @location(0) @interpolate(flat) i_index: u32,
        @location(1) normal : vec3f,
        @location(2) eye_coords : vec3f
    }`;
    const model_bindings = is_model_shader ?
    `@group(1) @binding(0) var<uniform> model_data: ModelData;`
    :
    `@group(1) @binding(0) var<storage, read> model_data: array<f32>;`;

    const model_view_declaration = is_model_shader ?
    `let model_view = model_data.model_view;`
    :
    `var model_view: mat4x4f;
    model_view[0][0] = model_data[i_index * (${model_uniform_bytelength / 4})+ 0];
    model_view[0][1] = model_data[i_index * (${model_uniform_bytelength / 4})+ 1];
    model_view[0][2] = model_data[i_index * (${model_uniform_bytelength / 4})+ 2];
    model_view[0][3] = model_data[i_index * (${model_uniform_bytelength / 4})+ 3];
    model_view[1][0] = model_data[i_index * (${model_uniform_bytelength / 4})+ 4];
    model_view[1][1] = model_data[i_index * (${model_uniform_bytelength / 4})+ 5];
    model_view[1][2] = model_data[i_index * (${model_uniform_bytelength / 4})+ 6];
    model_view[1][3] = model_data[i_index * (${model_uniform_bytelength / 4})+ 7];
    model_view[2][0] = model_data[i_index * (${model_uniform_bytelength / 4})+ 8];
    model_view[2][1] = model_data[i_index * (${model_uniform_bytelength / 4})+ 9];
    model_view[2][2] = model_data[i_index * (${model_uniform_bytelength / 4})+10];
    model_view[2][3] = model_data[i_index * (${model_uniform_bytelength / 4})+11];
    model_view[3][0] = model_data[i_index * (${model_uniform_bytelength / 4})+12];
    model_view[3][1] = model_data[i_index * (${model_uniform_bytelength / 4})+13];
    model_view[3][2] = model_data[i_index * (${model_uniform_bytelength / 4})+14];
    model_view[3][3] = model_data[i_index * (${model_uniform_bytelength / 4})+15];
    `;
    const normal_matrix_declaration = is_model_shader ?
    `let normal_matrix = model_data.normal_matrix;`
    :
    `var normal_matrix: mat3x3f;
    normal_matrix[0][0] = model_data[i_index * (${model_uniform_bytelength / 4})+16+0];
    normal_matrix[0][1] = model_data[i_index * (${model_uniform_bytelength / 4})+16+1];
    normal_matrix[0][2] = model_data[i_index * (${model_uniform_bytelength / 4})+16+2];
    normal_matrix[1][0] = model_data[i_index * (${model_uniform_bytelength / 4})+16+4];
    normal_matrix[1][1] = model_data[i_index * (${model_uniform_bytelength / 4})+16+5];
    normal_matrix[1][2] = model_data[i_index * (${model_uniform_bytelength / 4})+16+6];
    normal_matrix[2][0] = model_data[i_index * (${model_uniform_bytelength / 4})+16+8];
    normal_matrix[2][1] = model_data[i_index * (${model_uniform_bytelength / 4})+16+9];
    normal_matrix[2][2] = model_data[i_index * (${model_uniform_bytelength / 4})+16+10];`;

    const set_vertex_out = is_model_shader ?
    `output.position = projection_data.projection * eye_coords;
    //  all models are guaranteed to have normalized normals
    output.normal = normal;
    output.eye_coords = eye_coords.xyz/eye_coords.w;`
    :
    `output.i_index = i_index;
    output.position = projection_data.projection * eye_coords;
    //  all models are guaranteed to have normalized normals
    output.normal = normal;
    output.eye_coords = eye_coords.xyz/eye_coords.w;`;

    const vertex_arguments = is_model_shader ?
    `@location(0) pos: vec3f,
    @location(1) normal: vec3f,
    @location(2) texel: vec2f`
    :
    `@builtin(instance_index) i_index: u32,
    @location(0) pos: vec3f,
    @location(1) normal: vec3f,
    @location(2) texel: vec2f`;

    const fragment_arguments = is_model_shader ?
    `@location(1) normal: vec3f, 
    @location(2) eye_coords: vec3f`
    :
    `@location(0) @interpolate(flat) i_index: u32,
    @location(1) normal: vec3f, 
    @location(2) eye_coords: vec3f`;

    const code = `
    ${vertex_out}
    struct ModelData {
        model_view: mat4x4f,    //  size 64, offset 0
        normal_matrix: mat3x3f  //  size 48, offset 64
    }
    struct ProjectionData {
        projection: mat4x4f,    //  size 64, offset 0
    }
    @group(0) @binding(0) var<uniform> projection_data: ProjectionData;
    ${model_bindings}
    
    @vertex
    fn vertexMain(
        ${vertex_arguments}
    ) -> VertexOut {
        ${model_view_declaration}
        let eye_coords = model_view * vec4f(pos, 1);
        var output: VertexOut;
        ${set_vertex_out}
        return output;
    }
    @fragment
    fn fragmentMain(
       ${fragment_arguments}
    ) -> @location(0) vec4f {
        ${normal_matrix_declaration}
        var N : vec3f;  // normalized normal vector
        var L : vec3f;  // unit vector pointing towards the light source
        L = vec3f(0, 0, 1);
        var R : vec3f;  // reflected vector of L
        var V : vec3f;  // unit vector pointing towards the viewer
        N = normalize( normal_matrix * normal );
        if ( dot(L,N) <= 0.0 ) { // light does not illuminate this point
            return vec4f(0,0,0,1);
        }
        else {
            R = -reflect(L,N);
            V = normalize(-eye_coords);  // (Assumes a perspective projection.)
            var color = 0.8*dot(L,N) * vec3f(1,1,1);  // diffuse reflection
                // constant multiples on colors are to avoid over-saturating the total color
            if (dot(R,V) > 0.0) {  // add in specular reflection
                color += 0.4*pow(dot(R,V),4) * vec3f(1,0,0);
            }
            return vec4f(color,1.0);
        }
    }
    `
    return code;
}