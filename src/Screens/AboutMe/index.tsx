import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import App from "App";
import { Text } from "components/Generic/Text";
import { skills } from "config/data";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AboutMe() {
  const [filter, _set_filter] = useState("");

  return (
    <App current_page="About Me">
      <div className="mt-8 flex flex-col">
        <div className="self-center w-full max-w-4xl pb-8">
          <Text type="h0">Problem Solver and Researcher</Text>
          <div className="px-12 md:px-32">
            <Text className="pb-4">
              A natural problem-solver at heart, I love exploring new topics and technologies to share my creativity with other people. In my spare time, I work on software projects and research on random topics. 
            </Text>
            <Text>
              You can check out <Link className="inline-flex" to="/projects">some of my projects here</Link> or look at my skills below.
            </Text>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <ImageList 
            className="flex-grow self-center
              grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 min-[850px]:grid-cols-4 lg:grid-cols-5 mt-4 !overflow-hidden" 
            cols={0}
            gap={8}>
            {
              skills.map((skill, index) => {
                if(!skill.name.toLowerCase().includes(filter.toLowerCase()))
                  return;
                return (
                  <ImageListItem
                    key={index}
                    className="w-48 h-48 aspect-square Slide-Up"
                    style={{
                      animationDelay: 100 * index + 100 + "ms"
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
      </div>
    </App>
  );
}