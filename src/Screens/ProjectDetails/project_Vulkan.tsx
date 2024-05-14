import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import { TextPD } from ".";

export default function VulkanContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        During my semi-final semester at NJIT, I took 3D Game Engine programming as my elective to get more insight into how game engines were constructed. While a lot of the information seemed to make no sense at the time, I am surprised at how much of it was relevant when building this website.  
    </TextPD>
    <Text type="h1" className="mt-2">Process</Text>
    <TextPD>
        The entire semester was dedicated to learning how to work with the Vulkan API to develop a 3D game engine along with rendering techniques. My project idea was a farming game where you plant seeds to grow procedurally generated dice that you use to combat enemies.
    </TextPD>
    <div className="flex justify-center items-center">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Nj1IgXP4OMU?si=gG995J8doM2sbIdT" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
    <TextPD>
        As I have used Unity (though ironically it was going through its controversial pricing changes at the time) I decided to modify the codebase we were given to fit Unity's design pattern with a scripting system, event manager, and prefabricated entities. I also modified the existing rendering system to add stylized rendering to the engine.
    </TextPD>
    <TextPD>
        Making a user interface in the game engine was definitely one of the more challenging aspects of the semester as it required more complicated math to project mouse coordinates properly. In the end I was able to get it to work, at the expense of some technical debt. 
    </TextPD>
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        I can say that the lack of familiarity with 3D graphics APIs definitely caused a lot of pain points when developing my product. It is only when I began remaking a 3D engine again that the purpose of the code was made clear and I could comprehend how the system all worked together. When working in C, I also should have chosen a more appropriate approach for my engine instead of blindly copying ideas from Unity without understanding why they were used.
    </TextPD>
    <TextPD>
        But taken as a whole, I am happy with how the project turned out as it provided the foundational knowledge for me to build my own 3D engines.
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802/gf3d">
      Source Code - https://github.com/JamesG9802/gf3d
      </Link>
    </Text>
  </>
}