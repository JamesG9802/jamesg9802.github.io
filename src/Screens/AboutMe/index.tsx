import { ImageList, ImageListItem, ImageListItemBar, TextField } from "@mui/material";
import App from "App";
import { LinkText } from "components/Generic/Link";
import { Text } from "components/Generic/Text";
import skills from "config/data";
import { useState } from "react";

export default function AboutMe() {
  const [filter, set_filter] = useState("");

  return (
    <App>
      <div className="mt-8 flex flex-col">
        <div className="self-center max-w-4xl">
          <Text type="h1">Problem Solver and Researcher</Text>
          <Text className="text-l_onBackground-200 dark:text-d_onBackground-200 italic mb-8">Last updated 5/1/2024</Text>
          <Text>As a child, I always had a wild imagination. Programming—along with writing fictional stories—has always been my main outlet to share my creativity with others. Deconstructing difficult problems and designing an elegant solution is an extremely satisfying process that will never grow old. You can check out my work <LinkText className="inline-flex" to="/projects">here</LinkText> or look at my skills if you want to collaborate on a research project.
          </Text>
          <TextField 
            className="self-start"
            variant="standard"
            label="Search for skills"
            value={filter}
            onChange={(e) => {
              set_filter(e.currentTarget.value);
            }}/>
        </div>
        <ImageList sx={{}} className="flex-grow self-center grid-cols-1 sm:grid-cols-2 min-[800px]:grid-cols-3" cols={0}>
          {
            skills.map((skill, index) => {
              if(!skill.name.toLowerCase().includes(filter.toLowerCase()))
                return;
              return (
                <ImageListItem
                  key={index}
                  className="w-64 h-64 aspect-square"
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