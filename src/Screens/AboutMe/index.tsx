import { ImageList, ImageListItem, ImageListItemBar, TextField } from "@mui/material";
import App from "App";
import { LinkText } from "components/Generic/Link";
import { Text } from "components/Generic/Text";
import { skills } from "config/data";
import { useState } from "react";

export default function AboutMe() {
  const [filter, set_filter] = useState("");

  return (
    <App current_page="About Me">
      <div className="mt-8 flex flex-col">
        <div className="self-center max-w-4xl">
          <Text type="h1">Problem Solver and Researcher</Text>
          {/* <Text className="text-l_onBackground-200 dark:text-d_onBackground-200 italic mb-8">Last updated 5/1/2024</Text> */}
          <Text>Programming—along with writing fictional stories—has always been my main outlet to share my creativity with others. There is nothing more satisfying than facing down an insurmountable problem and then designing an elegant solution. I am always looking for opportunities to hone my skills and learn cutting-edge technologies. You can check out my work <LinkText className="inline-flex" to="/projects">here</LinkText> or look at my skills if you want to collaborate on a research project.
          </Text>
        </div>
        <ImageList 
          className="flex-grow self-center
            grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 min-[850px]:grid-cols-4 lg:grid-cols-5 mt-4" 
          cols={0}
          gap={8}>
          {
            skills.map((skill, index) => {
              if(!skill.name.toLowerCase().includes(filter.toLowerCase()))
                return;
              return (
                <ImageListItem
                  key={index}
                  className="w-48 h-48 aspect-square Flip"
                  style={{
                    animationDelay: Math.random() > .3333 ? 100 + "ms" :
                    Math.random() > .5 ? 200 + "ms" : 300 + "ms"
                  }}
                >
                  <img
                    src={skill.image_path}
                    alt={skill.name}
                    loading={"lazy"}
                    className="object-contain pb-20"
                  />
                  <ImageListItemBar
                    title={
                    <>
                      <Text>{`Started in ${skill.start_year}`}</Text>
                      <Text type="h3">
                      {
                        skill.experience <= 2 ? "Beginner" :
                        skill.experience <= 3.5 ? "Intermediate" :
                        "Proficient"
                      }
                      </Text>
                    </>}
                  />
                </ImageListItem>
              )
            })
          }
        </ImageList>
      </div>
    </App>
  );
}