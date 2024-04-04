import { Simulation } from "simulation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Home() {
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const [width, height] = useWindowSize();
    const simulation = useRef<Simulation>();

    /*  https://stackoverflow.com/a/19014495    to update canvas size on document size change. */
    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
          function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
          }
          window.addEventListener('resize', updateSize);
          updateSize();
          return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
    }

    function animate() {
        if(simulation.current != undefined)
            simulation.current.render();
        requestAnimationFrame(animate);
    }

    /** On initialization start animating. */
    useEffect(() => {
        async function initialize() {
            if(canvas_ref.current == undefined)
                throw Error("Canvas could not be found.");
            let new_simulation = await Simulation.create(canvas_ref.current);
            simulation.current = new_simulation;
            animate();
        }
        initialize();
        function input(event: KeyboardEvent) {
            if(simulation.current == undefined) return;
            if (event.key == "ArrowLeft") {
                simulation.current.left_pressed = true;
            }
            if (event.key == "ArrowRight") {
                simulation.current.right_pressed = true;
            }
            if (event.key == "ArrowUp") {
                simulation.current.up_pressed = true;
            }
            if (event.key == "ArrowDown") {
                simulation.current.down_pressed = true;
            }
            if (event.key == "q") {
                simulation.current.left_rotate_pressed = true;
            }
            if (event.key == "e") {
                simulation.current.right_rotate_pressed = true;
            }
        }
        function letgo(event: KeyboardEvent) {
            if(simulation.current == undefined) return;
            simulation.current.left_pressed = false;
            simulation.current.right_pressed = false;
            simulation.current.up_pressed = false;
            simulation.current.down_pressed = false;
            simulation.current.left_rotate_pressed = false;
            simulation.current.right_rotate_pressed = false;
        }
        window.addEventListener("keydown", input);
        window.addEventListener("keyup", letgo);
        return () => {
            window.removeEventListener("keydown", input);
            window.removeEventListener("keyup", letgo);
        }
    }, []);

    /** On initialization and size change, update the canvas size. */
    useEffect(() => {
        if (canvas_ref.current) {
            let rect = canvas_ref.current?.parentElement?.getBoundingClientRect();
            if(rect == undefined) 
                return;
            canvas_ref.current.width = rect.width;
            canvas_ref.current.height = rect.height;
            if(simulation.current) {
                simulation.current.resize();
            }
        }
    }, [canvas_ref, width, height]);

    
    return (<>
      <div className="flex-grow relative">
        <canvas className="absolute top-0 left-0" id="tutorial" ref={canvas_ref}/>
      </div>
    </>);
}