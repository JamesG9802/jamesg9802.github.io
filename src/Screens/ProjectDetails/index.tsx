import { Chip } from "@mui/material";
import App from "App";
import { Strong } from "components/Generic/Strong";
import { Text } from "components/Generic/Text";
import Touchable from "components/Generic/Touchable";
import { Project, projects } from "config/data";
import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//  Needed for tailwind to bundle properly
const title_gradient_0: string = `bg-gradient-to-bl
from-l_onBackground-100 to-l_accent1-100
dark:from-d_onBackground-100 dark:to-d_accent1-100
text-[rgba(0,0,0,0)]
bg-clip-text`;
const title_gradient_1: string = `bg-gradient-to-br
from-l_onBackground-100 to-l_accent2-100
dark:from-d_onBackground-100 dark:to-d_accent2-100
text-[rgba(0,0,0,0)]
bg-clip-text`;
const title_gradient_2: string = `bg-gradient-to-tr
from-l_onBackground-100 to-l_accent3-100
dark:from-d_onBackground-100 dark:to-d_accent3-100
text-[rgba(0,0,0,0)]
bg-clip-text`;
const title_gradient_3: string = `bg-gradient-to-tl
from-l_onBackground-100 to-l_accent4-100
dark:from-d_onBackground-100 dark:to-d_accent4-100
text-[rgba(0,0,0,0)]
bg-clip-text`;

export type TextPDProps = {
  children?: ReactNode
};

export function TextPD({children}: TextPDProps) {
  return (
    <Text className="my-3">
      {children}
    </Text>
  );
} 

export default function ProjectDetails() {
  const { index } = useParams();
  const [project, set_project] = useState<Project | null>(null);
  /**
   * When the parameters change, update the currently shown project.
   */
  useEffect(() => {
    if(Number(index) < 0 || Number(index) >= projects.length || isNaN(Number(index))) {
      set_project(projects[0]);
    }
    else {
      set_project(projects[Number(index)]);
    }
  }, [index]);

  //  


  return (
    <App current_page="Projects">
      {
        project && 
        <div className="flex flex-grow flex-col">
          <div className="py-4 px-2 bg-l_background-200 dark:bg-d_background-200 rounded-b-3xl">
            <div className={
                Number(index) % 4 == 0 ? title_gradient_0 :
                Number(index) % 4 == 1 ? title_gradient_1 :
                Number(index) % 4 == 2 ? title_gradient_2 :
                title_gradient_3
              }>
              <Text type="h0" className="text-center py-2">{project.name}</Text>
            </div>
            <Text type="h1" className="text-center font-normal">{project.short_description}</Text>
          </div>
          <div className="flex flex-wrap self-center w-full flex-col space-y-2 items-center md:w-1/2 md:flex-row md:space-y-0 md:items-start
          py-4">
            <div className="w-1/3">
              <Text type="h2" className="text-center text-l_accent1-100 dark:text-d_accent1-100">Project Owner</Text>
              <Text className="text-center"><Strong>{project.owner}</Strong></Text>
            </div>
            <div className="w-1/3">
              <Text type="h2" className="text-center text-l_accent1-100 dark:text-d_accent1-100">Timeframe</Text>
              <Text className="text-center"><Strong>{project.date_range}</Strong></Text>
            </div>
            <div className="w-1/3">
              <Text type="h2" className="text-center text-l_accent1-100 dark:text-d_accent1-100">Technologies</Text>
              {
                project.technologies.map((technology, index) => {
                  return <Chip key={index}
                    label={<Text>{technology}</Text>} 
                    variant="filled"
                    className="m-1"
                  />
                })
              }
            </div>
          </div>
          <div className="self-center w-full max-w-4xl pb-4">  
            <div className="px-8 md:px-16">
              {
                project.content
              }
            </div>
          </div>
          {/* Links to next and previous projects */}
          <div className="flex flex-grow flex-col justify-end">
            <div className="flex flex-row py-2">
              <div className="w-1/2">
                {
                  Number(index) - 1 <= projects.length - 1 && 
                  Number(index) - 1 >= 0 && 
                  <Link to={`/projects/${Number(index)-1}`}>
                    <Touchable className="p-4" onClick={()=>{window.scrollTo(0, 0)}}>
                        <Text className="select-none">
                          {`Previous: ${projects[Number(index) - 1].name}`}
                        </Text>
                    </Touchable>
                  </Link>
                }
              </div>
              <div className="w-1/2">
              {
                  Number(index) + 1 <= projects.length - 1 && 
                  Number(index) + 1 >= 0 && 
                  <Link to={`/projects/${Number(index) + 1}`}>
                      <Touchable className="p-4" onClick={()=>{window.scrollTo(0, 0)}}>
                          <Text className="select-none">
                            {`Next: ${projects[Number(index) + 1].name}`}
                          </Text>
                      </Touchable>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>  
      }
    </App>
  );
}