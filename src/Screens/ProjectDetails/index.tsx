import App from "App";
import { Text } from "components/Generic/Text";
import Touchable from "components/Generic/Touchable";
import { Project, projects } from "config/data";
import { useEffect, useRef, useState } from "react";
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


export default function ProjectDetails() {
  const { index } = useParams();
  const [project, set_project] = useState<Project>();
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
          <div className="py-4 bg-l_background-200 dark:bg-d_background-200">
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
          <div className="flex flex-row self-center w-1/2 
          py-4">
            <div className="w-1/2">
              <Text type="h2" className="text-center text-l_accent1-100 dark:text-d_accent1-100">Project Owner</Text>
              <Text className="text-center font-bold">{project.owner}</Text>
            </div>
            <div className="w-1/2">
              <Text type="h2" className="text-center text-l_accent1-100 dark:text-d_accent1-100">Timeframe</Text>
              <Text className="text-center font-bold">{project.date_range}</Text>
            </div>
          </div>
          <div className="px-12 md:px-32">
            {
              project.content
            }
          </div>
          <div className="flex flex-grow flex-col justify-end">
            <div className="flex flex-row py-2">
              <div className="w-1/2">
                {
                  Number(index) > 0 && 
                  <Link to={`/projects/${Number(index)-1}`}>
                    <Touchable className="p-4">
                        <Text className="select-none">
                          {`Previous: ${projects[Number(index) - 1].name}`}
                        </Text>
                    </Touchable>
                  </Link>
                }
              </div>
              <div className="w-1/2">
              {
                  Number(index) < projects.length - 1 && 
                  <Link to={`/projects/${Number(index) + 1}`}>
                      <Touchable className="p-4">
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