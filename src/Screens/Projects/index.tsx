import { Chip, ImageList, ImageListItem, ImageListItemBar, Modal } from "@mui/material";
import App from "App";
import { Text } from "components/Generic/Text";
import Touchable from "components/Generic/Touchable";
import { Project, projects } from "config/data";
import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const [show_modal, set_show_modal] = useState(false);
  const [project, set_project] = useState<Project>();
  return (
    <App current_page="Projects">
      <Modal
        className="flex justify-center items-center Projects_Modal"
        open={show_modal}
        onClose={()=>{set_show_modal(false)}}
      >
        <div className="flex flex-col bg-l_background-100 dark:bg-d_background-100 p-10 max-w-lg">
          <Text type="h1">{project?.name}</Text>
          <Text type="h2">{`${project?.owner} — ${project?.date_range}`}</Text>
          <Text type="normal">{project?.short_description}</Text>
          <div className="flex flex-row flex-wrap space-x-2">
            {
              project?.technologies.map((technology) => {
                return <Chip key={technology}
                  className="!bg-l_primary-100 dark:!bg-d_primary-100 
                  !border-l_primary-100 dark:!border-d_primary-100 
                  mt-1 select-none" 
                  label={<Text className="font-semibold">{technology}</Text>} 
                  variant="outlined"
                />
              })
            }
          </div>
        </div>
      </Modal>
      <div className="mt-8 flex flex-col">
        {
            projects.map((project, index) => {
              return (
                <Touchable 
                  key={index}
                  className="Flip Projects_ListItem flex md:flex-row flex-col pt-4 my-2 rounded-lg select-none 
                  cursor-pointer
                  bg-l_primary-100 dark:bg-d_primary-100 text-l_onPrimary-100 dark:text-d_onPrimary-100
                  hover:bg-l_primary-100/50 hover:dark:bg-d_primary-100/50" 
                  style={{
                    animationDelay: index*100 + 100 + "ms"
                  }}
                  onClick={
                    ()=>{
                      set_show_modal(true);
                      set_project(project);
                      navigate(`/projects/${index}`)
                    }
                  }>
                  <div
                    className="self-center md:w-1/3 md:self-end">
                    <img
                      draggable={false}
                      src={project.image_path}
                      alt={project.name}
                      loading={"lazy"}
                      className="object-cover select-none px-4 w-full h-auto max-h-64 object-top"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <Text type="h1" className="text-wrap">{`${project.name}`}</Text>
                    <Text type="h3" className="text-wrap italic font-normal">{`${project.date_range}`}</Text>
                    <Text type="h3" className="text-wrap font-normal">{`${project.short_description}`}</Text>
                    <div className="flex flex-row flex-wrap pt-4 space-x-2">
                      {
                        project.technologies.map((technology, index) => {
                          return <Chip key={index}
                            label={<Text>{technology}</Text>} 
                            variant="filled"
                          />
                        })
                      }
                    </div>
                  </div>
                </Touchable>
              )
            })
          }
      </div>
    </App>
  );
}