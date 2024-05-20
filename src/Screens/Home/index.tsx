import { Simulation } from "simulation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./index.css";
import RingEntity from "simulation/logic/RingEntity";
import { GenericComponentProps } from "components/Generic";
import { Vec4, vec4 } from "wgpu-matrix";
import { Text } from "components/Generic/Text";
import App from "App";
import { LinkText } from "components/Generic/Link";
import LinkEntity from "simulation/logic/LinkEntity";
import { useInView } from "react-intersection-observer";
import { Strong } from "components/Generic/Strong";
import { Link } from "react-router-dom";
import { projects } from "config/data";

import NJIT from "assets/images/NJIT.png";

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
  
  const [_webgpu_supported, set_webgpu_supported] = useState(false);
  const [width, height] = useWindowSize();
  const simulation = useRef<Simulation>();
  const is_dark_mode = useRef<boolean>(false); 
  const mouse_position = useRef<[number, number]>([0, 0]);
  const current_color = useRef<Vec4>(vec4.fromValues(1, 1, 1, 1));

  const [scrollY, set_scrollY] = useState(0);

  const [aboutme_ref] = useInView({onChange: (visible: boolean) => { 
    if(visible) current_color.current = vec4.fromValues(0, 0, 1, 1); 
  }})
  const [projects_ref] = useInView({onChange: (visible: boolean) => { 
    if(visible) current_color.current = vec4.fromValues(1, 0, 0, 1); 
  }})
  const [contact_ref] = useInView({onChange: (visible: boolean) => { 
    if(visible) current_color.current = vec4.fromValues(0, 1, 0, 1); 
  }})
  const [source_code_ref] = useInView({onChange: (visible: boolean) => { 
    if(visible) current_color.current = vec4.fromValues(1, 0, 1, 1); 
  }})

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
        simulation.current.set_global_light_color(current_color.current);
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
        2 * (ev.clientX - bounding_rect.left) / canvas_ref.current.width - 1, 
        1 - 2 * (ev.clientY - bounding_rect.top) / canvas_ref.current.height
    ];
  };

  /**
   * Updates the scroll position when the windows is scrolled.
   */
  function update_scroll() {
    set_scrollY(window.scrollY);
    LinkEntity.offset = window.scrollY / 500;
  }

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
    update_scroll();
    window.addEventListener("scroll", update_scroll, { passive: true });

    return () => {
      simulation.current?.destroy();
      simulation.current = undefined;
      window.removeEventListener("scroll", update_scroll)
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

  function LinkHover({text, link, button_number}: LinkHoverProps) {
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
      <div className="flex flex-grow justify-center items-center self-stretch">
          <LinkText to={link}
            target={button_number == 4 ? "_blank" : "_self"}
            containerClassName={`grow p-3 m-3 md:mt-16 rounded-full flex flex-row justify-center ${class_string}`
            }
            className="pointer-events-auto cursor-pointer"
            onMouseOverCapture={(_e) => { 
            }} 
            /**
             * In order for the text to not block the canvas, they need to continue passing the mouse event to the canvas.
             */
            onMouseMoveCapture={(_e) => {
              update_mouse_position(_e.nativeEvent);
            }}
            onClick={(_e) => {
              RingEntity.FAST = false;
              window.scrollTo(0, 0);
            }}
            onMouseLeave={() => {
            }}>
            <Text type="h2">{text}</Text>
          </LinkText>
      </div>
    )
  }
  return (
    <App current_page="Home" hide_header>
      <div className="flex-grow relative Engine-Container" 
        onMouseMoveCapture={(e)=>{
          update_mouse_position(e.nativeEvent);
        }}
      >
        <canvas className={"fixed top-0 left-1/2 -translate-x-1/2 -z-10 " + 
          (
            scrollY < 80 ? "" :
            scrollY < 160 ? "Home-Blur-1" :
            scrollY < 240 ? "Home-Blur-2" :
            scrollY < 320 ? "Home-Blur-3" :
            scrollY < 400 ? "Home-Blur-4" :
            "Home-Blur-5"
          )
        } id="renderer" ref={canvas_ref}/>
        
        <div className="flex flex-grow-0 flex-col items-center justify-center my-4
        bg-gradient-to-br
        from-l_onBackground-100 to-l_primary-100
        dark:from-d_onBackground-100 dark:to-d_primary-100
        text-[rgba(0,0,0,0)]
        bg-clip-text
        ">
          <Text type="title">James Gaiser</Text>
          <Text type="h3">Computer Programmer and Researcher</Text>
        </div>
      </div>
      <div className="flex flex-col z-10"
        onMouseMoveCapture={(e) => {
          update_mouse_position(e.nativeEvent);
        }}
      >
        <div className="Home-Section rounded-t-3xl py-24 px-8 md:py-32 md:px-24
        bg-l_accent1-100/20 dark:bg-d_accent1-100/20" ref={aboutme_ref}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 px-8">
              <Text type="h0">Who am I?</Text>
              <Text type="h2">
                <Strong>
                  Programming since the age of 12, I always enjoyed breaking down and analyzing complex systems. It’s no wonder then that besides programming, chief amongst my interests are worldbuilding and statistical research. 
                </Strong>
              </Text>
              <Text type="h2" className="mt-8">
                <Strong>
                  I honed my talents in college and graduated from NJIT in 2024.
                </Strong>
              </Text>
            </div>
            <div className="w-full md:w-1/2 pt-24">
              <img src={NJIT} className="w-full h-auto" />
            </div>
          </div>
          <LinkHover 
            text="Read more" 
            link="/aboutme" 
            button_number={1} 
            color={vec4.fromValues(0, 0, 1)}
          />
        </div>
        <div className="Home-Section py-24 px-8 md:py-32 md:px-24
        bg-l_accent2-100/20 dark:bg-d_accent2-100/20" ref={projects_ref}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 order-1 md:order-2 px-8">
              <Text type="h0">Projects</Text>
              <Text type="h2">
                <Strong>
                  My most recent project was the <Link to="/projects/0"type="h2" className="font-bold">{projects[0].name}.</Link>
                </Strong>
              </Text>
              <Text type="h2" className="mt-8 font-normal italic">
                {projects[0].short_description}
              </Text>
            </div>
            <div className="flex justify-center items-center w-full md:w-1/2 pt-24 p-8 order-2 md:order-1">
              <img src={projects[0].image_path} className="w-full h-auto" />
            </div>
          </div>
          <LinkHover 
                text="View All Projects" 
                link="/projects" 
                button_number={2} 
                color={vec4.fromValues(1, 0, 0)}
          />
        </div>
        <div className="Home-Section py-24 px-8 md:py-32 md:px-24
        bg-l_accent3-100/20 dark:bg-d_accent3-100/20" ref={contact_ref}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 px-8">
              <Text type="h0">Contact</Text>
              <Text type="h2">
                <Strong>
                  Want to get in touch? Feel free to reach out and send me a message. 
                </Strong>
              </Text>
            </div>
            <div className="w-full md:w-1/2 pt-24">
              {/* <img src={AboutMePicture} className="w-full h-auto" /> */}
            </div>
          </div>
          <LinkHover 
                text="Send a Message" 
                link="/contact" 
                button_number={3} 
                color={vec4.fromValues(0, 1, 0)}
          />
        </div>
        <div className="Home-Section rounded-b-3xl py-24 px-8 md:py-32 md:px-24 mb-8
        bg-l_accent4-100/20 dark:bg-d_accent4-100/20" ref={source_code_ref}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 order-1 md:order-2 px-8">
              <Text type="h0">This Website</Text>
              <Text type="h2">
                <Strong>
                  This website was built using the React framework and Vite build tool. It uses WebGPU for 3D rendering. You are free to use this code with attribution if you follow the <Link to="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">license.</Link>
                </Strong>
              </Text>
            </div>
            <div className="flex justify-center w-full md:w-1/2 order-2 md:order-1 pt-24">
              <img src={"https://vitejs.dev/logo-with-shadow.png"} className="w-auto h-64" />
            </div>
          </div>
          <LinkHover 
                text="View Source Code"  
                link="https://github.com/JamesG9802/jamesg9802.github.io" 
                button_number={4} 
                color={vec4.fromValues(1, 0, 1)}
          />
        </div>
      </div>
    </App>
  );
}