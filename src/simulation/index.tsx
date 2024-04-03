import { Engine } from "engine";
import { World } from "world";
import { Camera, Eye } from "world/camera";
import { Entity } from "world/entity";
import { onev3, zerov3 } from "world/extensions";
import { Model } from "world/model";
import { quat } from "gl-matrix";

export class Simulation {
    #frame: number;

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
            eye: new Eye(),
            project_matrix: Camera.compute_projection_matrix(1, Math.PI, .1, 100)
        }
        if(engine != undefined)
        {
            await Model.initialize_dictionary();
            let model = await Model.load_from_file(engine.device, engine.model_pipeline, "cube");
            console.log(model);
            if(model == undefined)
            {
                console.error("model is undefined");
                return;
            }
            let entities: Entity[] = [new Entity(zerov3, quat.fromEulern(0, 0, 0), onev3, model),
                new Entity(zerov3, quat.fromEulern(0, 0, 0), onev3, model)];
            let world: World = new World(camera, entities)
            console.log("Successfully created simulation.");
            return new Simulation(engine, world);
        }
        console.error("Failed to create simulation.");
        return;
    }

    render() {
        this.world.render(this.engine);
    }
}