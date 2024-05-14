import { Chip, } from "@mui/material";
import App from "App";
import { Text } from "components/Generic/Text";
import Touchable from "components/Generic/Touchable";
import { projects } from "config/data";
import "./index.css";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  return (
    <App current_page="Projects">
      <div className="mt-8 flex flex-col overflow-x-hidden">
        <div className="self-center w-full max-w-4xl">
          <Text type="h0" className="self-start">What I Worked On</Text>
        </div>
        {
          projects.map((project, index) => {
            return (
              <Touchable 
                key={index}
                className="Slide-Left Projects_ListItem flex md:flex-row flex-col py-4 my-2 rounded-lg select-none
                cursor-pointer
                bg-l_primary-100 dark:bg-d_primary-100 text-l_onPrimary-100 dark:text-d_onPrimary-100
                hover:bg-l_primary-100/50 hover:dark:bg-d_primary-100/50" 
                style={{
                  animationDelay: index * 100 + 100 + "ms"
                }}
                onClick={
                  ()=>{
                    navigate(`/projects/${index}`)
                  }
                }>
                <div
                  className="self-center md:w-1/3 md:self-center">
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