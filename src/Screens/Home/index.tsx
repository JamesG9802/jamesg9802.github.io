import { Simulation } from "simulation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./index.css";
import RingEntity from "simulation/logic/RingEntity";
import { GenericComponentProps } from "components/Generic";
import { Vec4, vec4 } from "wgpu-matrix";
import { Text } from "components/Generic/Text";
import App from "App";
import { LinkText } from "components/Generic/Link";

type LinkHoverProps = {
    text: string,
    link: string,
    button_number: 1 | 2 | 3 | 4,
    color: Vec4
} & GenericComponentProps;

export default function Home() {
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);

    /**
     * Whether the user explicitly wants WebGPU animation to stop.
     */
    const animation_disabled = useRef(false);
    
    const [webgpu_supported, set_webgpu_supported] = useState(false);
    const [width, height] = useWindowSize();
    const simulation = useRef<Simulation>();
    const is_dark_mode = useRef<boolean>(false); 
    const mouse_position= useRef<[number, number]>([0, 0]);

    //  Only used when the simulation first initializes to get the proper canvas height
    //  afterwards the resizer will properly handle the size
    const canvas_width = useRef<number>(1), canvas_height = useRef<number>(1);

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

    /**
     * If the simulation exists and is not paused, animate.
     */
    function animate() {
        if(simulation.current != undefined && !animation_disabled.current){
            simulation.current.update(mouse_position.current);
            simulation.current.render();
        }
        requestAnimationFrame(animate);
    }

    /**
     * Pass mouse position to the simulation.
     * @param ev 
     * @returns 
     */
    function update_mouse_position(ev: MouseEvent) {
        if(!canvas_ref.current) return;
        let bounding_rect = canvas_ref.current?.getBoundingClientRect();
        mouse_position.current = [
            2 * (ev.clientX - bounding_rect.left) / canvas_width.current - 1, 
            2 * (ev.clientY - bounding_rect.top) / canvas_height.current - 1
        ];
    };

    /** On initialization start animating. */
    useEffect(() => {
        async function initialize() {
            if(canvas_ref.current == undefined)
                throw Error("Canvas could not be found.");
            //  https://stackoverflow.com/a/75495293
            //  Get the system theme preference
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            if (mq.matches) {
                is_dark_mode.current = true;
            }
            mq.addEventListener("change", (evt) => {
                is_dark_mode.current = evt.matches;
                simulation.current?.set_clear_color(is_dark_mode.current ? 
                    [0.129, 0.114, 0.102, 1] : 
                    [0.953, 0.949, 1, 1]);
            });

            let new_simulation = await Simulation.create(canvas_ref.current, 
                is_dark_mode.current ? 
                [0.129, 0.114, 0.102, 1] : 
                [0.953, 0.949, 1, 1]);
            simulation.current = new_simulation;
            if(simulation.current) {
                simulation.current.resize(canvas_width.current, canvas_height.current);
                set_webgpu_supported(true);
            }
            animate();
            
        }
        initialize();

        canvas_ref.current?.addEventListener('mousemove', update_mouse_position);
          
        return () => {
            simulation.current?.destroy();
            simulation.current = undefined;
            canvas_ref.current?.removeEventListener('mousemove', update_mouse_position);
        };
    }, []);

    /** On initialization and size change, update the canvas size. */
    useEffect(() => {
        if (canvas_ref.current) {
            let rect = canvas_ref.current?.parentElement?.getBoundingClientRect();
            if(rect == undefined) 
                return;
            canvas_ref.current.width = !simulation.current ? rect.width : Math.max(1, Math.min(rect.width, simulation.current.engine.device.limits.maxTextureDimension2D));
            canvas_ref.current.height = !simulation.current ? rect.height : Math.max(1, Math.min(rect.height, simulation.current.engine.device.limits.maxTextureDimension2D));
            if(simulation.current) {
                simulation.current.resize(canvas_ref.current.width, canvas_ref.current.height);
            }
            else {
                canvas_width.current = canvas_ref.current.width;
                canvas_height.current = canvas_ref.current.height;
            }
        }
    }, [canvas_ref, width, height]);

    function LinkHover({text, link, button_number, color}: LinkHoverProps) {
        //  I hate tailwind 🙄🙄🙄
        //  It won't bundle the tailwind classes correctly unless I hardcode the stylings.
        let class_string;
        switch(button_number) {
            case 1:
                class_string = "bg-l_accent1-100/80 dark:bg-d_accent1-100/80 hover:bg-l_accent1-100 hover:dark:bg-d_accent1-100";
                break;
            case 2:
                class_string = "bg-l_accent2-100/80 dark:bg-d_accent2-100/80 hover:bg-l_accent2-100 hover:dark:bg-d_accent2-100";
                break;
            case 3:
                class_string = "bg-l_accent3-100/80 dark:bg-d_accent3-100/80 hover:bg-l_accent3-100 hover:dark:bg-d_accent3-100";
                break;
            case 4:
                class_string = "bg-l_accent4-100/80 dark:bg-d_accent4-100/80 hover:bg-l_accent4-100 hover:dark:bg-d_accent4-100";
                break;
        }
        return (
        <LinkText to={link}
            containerClassName={`grow p-3 m-3 rounded-full ${class_string}`
            }
            className="pointer-events-auto cursor-pointer"
            onMouseOverCapture={(_e) => { 
                RingEntity.FAST = true;
                simulation.current?.set_global_light_color(color);
            }} 
            /**
             * In order for the text to not block the canvas, they need to continue passing the mouse event to the canvas.
             */
            onMouseMoveCapture={(_e) => {
                update_mouse_position(_e.nativeEvent);
            }}
            onMouseLeave={() => {
                RingEntity.FAST = false;
            }}>
            <Text type="h2">{text}</Text>
        </LinkText>
        )
    }
    return (<App hide_header>
        <div className="flex-grow relative Engine-Container">
            <canvas className="top-0 left-0" id="tutorial" ref={canvas_ref}/>
            <div className="absolute top-0 left-0 pointer-events-none w-full h-full flex flex-col">
                <div className="flex flex-grow-0 flex-col items-center justify-center mt-4">
                    <Text type="title">James Gaiser</Text>
                    <Text type="h3">Computer Programmer and Researcher</Text>
                </div>
                <div className="flex flex-grow justify-center items-center self-stretch">
                    <div className="flex flex-grow-0 flex-col justify-center 
                        md:flex-grow md:flex-row md:justify-between">
                        <LinkHover text="About Me" link="/aboutme" button_number={1} color={vec4.fromValues(0, 0, 1)}/>
                        <LinkHover text="Projects" link="/projects" button_number={2} color={vec4.fromValues(1, 0, 0)}/>
                        <LinkHover text="Contact" link="/contact" button_number={3} color={vec4.fromValues(0, 1, 0)}/>
                        <LinkHover text="This Website" link="ad" button_number={4} color={vec4.fromValues(1, 0, 1)}/>
                    </div>
                </div>
            </div>
        </div>
    </App>);
}