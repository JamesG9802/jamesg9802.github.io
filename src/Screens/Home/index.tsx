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
    }, []);

    /** On initialization and size change, update the canvas size. */
    useEffect(() => {
        if (canvas_ref.current) {
            let rect = canvas_ref.current?.parentElement?.getBoundingClientRect();
            if(rect == undefined) 
                return;
            canvas_ref.current.width = rect.width;
            canvas_ref.current.height = rect.height;
        }
    }, [canvas_ref, width, height]);

    
    return (<>
      <div className="flex-grow relative">
        <canvas className="absolute top-0 left-0" id="tutorial" ref={canvas_ref}/>
      </div>
    </>);
}