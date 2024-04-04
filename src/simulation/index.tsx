import { Engine } from "engine";
import { World } from "world";
import { Camera, Eye } from "world/camera";
import { Entity } from "world/entity";
import { Model } from "world/model";
import { Mesh } from "world/mesh";
import { quat, vec3 } from "wgpu-matrix";

export class Simulation {
    #frame: number;
    left_pressed: boolean = false;
    right_pressed: boolean = false;
    up_pressed: boolean = false;
    down_pressed: boolean = false;
    left_rotate_pressed: boolean = false;
    right_rotate_pressed: boolean = false;
    engine: Engine;
    world: World;

    constructor(engine: Engine, world: World) {
        this.#frame = 0;

        this.engine = engine;
        this.world = world;
    }
    static async create(canvas: HTMLCanvasElement): Promise<Simulation | undefined> {
        let engine: Engine | undefined = await Engine.create(canvas);

        let camera: Camera = {
            eye: new Eye(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, -1)),
            project_matrix: Camera.compute_projection_matrix(Math.PI / 5, 1, .1, 100)
        }
        if(engine != undefined)
        {
            await Mesh.initialize_dictionary();
            let model1 = await Model.load_from_file(engine.device, engine.model_pipeline, "cube");
            let model2 = await Model.load_from_file(engine.device, engine.model_pipeline, "cliff");
            if(model1 == undefined || model2 == undefined)
            {
                console.error("model is undefined");
                return;
            }
            let e1 = new Entity(vec3.fromValues(0, 0, 0), quat.fromEuler(0, 0, 0, "xyz"), vec3.fromValues(.125, .125, .125), model1);
        //    let e2 = new Entity(vec3.fromValues(1, 2, 4), quat.fromEuler(0, 0, 2 * Math.PI, "xyz"), vec3.fromValues(2, 2, 2), model2);
            
        //    let entities: Entity[] = [e1, e2];
            let entities: Entity[] = [e1];
            let world: World = new World(camera, entities)
            console.log("Successfully created simulation.");
            return new Simulation(engine, world);
        }
        console.error("Failed to create simulation.");
        return;
    }

    /**
     * Upon a resize event, GPU related fields need to be updated
     */
    resize() {
        this.engine.resize();
    }

    render() {
        let old_pos = this.world.main_camera.eye.position;
        if(this.left_pressed)
            this.world.main_camera.eye.set_position(vec3.add(this.world.main_camera.eye.position, vec3.fromValues(1/100, 0, 0)));
        if(this.right_pressed)
            this.world.main_camera.eye.set_position(vec3.add(this.world.main_camera.eye.position, vec3.fromValues(-1/100, 0, 0)));
        if(this.up_pressed)
            this.world.main_camera.eye.set_position(vec3.add(this.world.main_camera.eye.position, vec3.fromValues(0, 0, 1/100)));
        if(this.down_pressed)
            this.world.main_camera.eye.set_position(vec3.add(this.world.main_camera.eye.position, vec3.fromValues(0, 0, -1/100)));
        if(this.left_rotate_pressed)
            this.world.main_camera.eye.set_target(vec3.rotateY(this.world.main_camera.eye.forward, vec3.fromValues(0, 0, 0), Math.PI / 64));
        if(this.right_rotate_pressed)
            this.world.main_camera.eye.set_target(vec3.rotateY(this.world.main_camera.eye.forward, vec3.fromValues(0, 0, 0), -Math.PI / 64));
        if(Math.abs(vec3.distance(this.world.main_camera.eye.position, vec3.fromValues(0, 0, 0))) >= 1) {
            this.world.main_camera.eye.set_position(old_pos);    
        }
        //    this.world.main_camera.eye.set_position(vec3.fromValues(5*Math.sin(this.#frame/100), 0, 5*Math.cos(this.#frame/100)));
        this.#frame += 1;
        if(this.#frame % 20 == 0)
            console.log(this.#frame, this.world.main_camera.eye.position[0], this.world.main_camera.eye.position[2] );
        this.world.render(this.engine);
    }
}