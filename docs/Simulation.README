(Last edited 4/5/2024)
# Project Structure
When the React Component (Home) mounts, it tries to create a `Simulation`. The simulation in turn creates an `Engine` and `World`. The engine is responsible for querying the WebGPU API and getting a logical device back. The world is a representation of the objects and entities that will be rendered to the screen.
## Engine
GPU related fields and data are stored inside the engine. Importantly, it creates the `ModelPipeline` here, a render pipeline responsible for drawing entities to the screen. Additionally, it handles the window resizing event and passes it to the pipeline as well. The world's main camera will resize to fit the canvas's aspect ratio.
## World
The world holds entities and a main camera. Entities are objects with world positions, rotation, and scale. The main camera also has a world position and forward direction.
# Rendering Loop
## Render (Start)
The rendering loop is first initialized in the React component right after the simulation is created. By using `requestAnimationFrame`. render requests are made at a steady rate. The React component will then invoke `render()` on simulation.
## Render (Simulation)
At the moment there is no separate update loop, so logic for handling user input and input is handled here. Afterwards, the simulation increases its tracked `frame` counter and invokes `render()` on world.
## World (Render)
This is where the render process actually starts. Since we render by accessing the user's GPU, we need to send commands to the GPU through the WebGPU API. So we invoke the model pipeline's `begin_render_command` to create the command encoder for the current render passes. This allows us to encode all the entity data and send a command to the GPU to render it.
Then for every entity in the world, we invoke the `Entity`'s `render` function.
## Entity (Render)
To render entities to the screen, we need the Model, View, and Projection matrices. First, every entity needs to compute their own Model matrices. Model matrices are a 4x4 matrix that will apply the translation (position), rotation, and scaling to the entity's model. Then we need the View matrix which can be found from the main camera. The projection matrix typically does not change and can also be found from the main camera. Finally, the entity also stores its normal matrix (computed from its model matrix).

Note that this process can be optimized with a separate update loop to only update the model and view matrices as needed.
## Model (Render)
The model pipeline will begin by setting up a render pass. This render pass is configured to clear the screen during every requestAnimationFrame and then store the GPU's output. This is so that the first render pass will clear the screen of its previous contents and every subsequent render pass will draw onto it. So when multiple objects are being drawn (which require multiple render passes), drawing one object does not wipe the screen of the previous object. We also include a depth texture to make sure objects are properly drawn based on their depth. Finally, we set the object's model, view, projection, and normal matrix in a uniform buffer and pass in the model's vertex, normal, indices, and texture coordinates.
## World (Render)
After every entity is finished rendering, the world submits a `end_render_command` to the model pipeline, which tells it to submit the instructions to the GPU for rendering.
# Meshes
To optimize memory usage, a mesh's data is stored in a single `GPUBuffer` that stores the vertex, normals, indices, and texture coordinates. This allows for duplicate copies of a mesh to use the exact same buffer. However, this does mean that any changes to one mesh will affect all other copies.