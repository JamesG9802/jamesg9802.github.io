import { Backdrop, Button, CircularProgress, ImageList, ImageListItem, ImageListItemBar, Snackbar, TextField } from "@mui/material";
import App from "App";
import { Text } from "components/Generic/Text";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Email, Message } from "@mui/icons-material";
import { useState } from "react";
import { get_email } from "components/Mail";
import { projects } from "config/data";
import Touchable from "components/Generic/Touchable";
import { useNavigate } from "react-router-dom";

function send_email(name: string, email: string, message: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let service = "service";
  let template = "template";
  let user_1 = "Yt6LvxyGF";
  const raw = JSON.stringify({
    //  Make sure it is not optimized into an easy to search string. 
    "service_id": Math.random() < 100 ? service + "_" + "8toef0e" : "Mary's an animal,",
    "template_id": Math.random() < 100 ? template + "_" + "jsqoime" : "as sick as they come",
    "user_id": Math.random() < 100 ? user_1 + "XFb3TfZX" : "Taste of a cannibal,",
    "template_params": {
      "from_name": name,
      "from_email": email,
      "message": message
    }
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  return fetch("https://api.emailjs.com/api/v1.0/email/send", requestOptions);
}

//  Time for snackbar to timeout in milliseconds
const snackbar_timeout = 6000;

export default function Contact() {
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [message, set_message] = useState("");

  const [snackbar_open, set_snackbar_open] = useState(false);
  const [snackbar_message, set_snackbar_message] = useState("");
  const [show_progress, set_show_progress] = useState(false);
  
  const [message_success, set_message_success] = useState(false);

  const navigate = useNavigate();

  return (
    <App current_page="Contact">
      <div className="mt-8 flex flex-col flex-grow">
        <div className="self-center w-full max-w-4xl flex flex-col flex-grow justify-between">
          {
            !message_success ?
            <div>
              <Text type="h0">Contact Me</Text>
              <form className="flex flex-col space-y-4 max-w-2xl" onSubmit={(e) => {
                e.preventDefault();
                let name_html: HTMLInputElement | null = document.querySelector("#contact-name");
                let email_html: HTMLInputElement | null = document.querySelector("#contact-email");
                let message_html: HTMLInputElement| null = document.querySelector("#contact-message");
                if(!name_html || !email_html || !message_html ||
                  !name_html.validity || !email_html.validity || !message_html.validity
                ) {
                  return;
                }
                set_show_progress(true);
                send_email(name, email, message)
                .then((response) => {
                  if(response.status != 200) {
                    console.error(response);
                    throw Error("Response failed.");
                  }
                  set_show_progress(false);
                  set_snackbar_message("Your message has been sent.");
                  set_snackbar_open(true);
                  set_message_success(true);
                })
                .catch((failure) => { 
                  console.error(failure);

                  set_show_progress(false);
                  set_snackbar_message("Something went wrong. A new tab will open with to your mail client.")
                  set_snackbar_open(true);
                  set_message_success(false);

                  const subject = `Portfolio Contact: ${name}` ;
                  window.open(`mailto:${get_email(true)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, "_blank", "noreferrer");
                })

              }}>
                <TextField
                  id="contact-name"
                  label="Name"
                  placeholder="Jane Doe"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className="pointer-events-none">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  required
                  value={name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    set_name(event.currentTarget.value);
                  }}
                  
                  variant="outlined"
                />
                <TextField
                  id="contact-email"
                  label="Email"
                  placeholder="your@email.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className="pointer-events-none">
                        <Email/>
                      </InputAdornment>
                    ),
                  }}
                  required
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    set_email(event.currentTarget.value);
                  }}
                  type="email"
                  variant="outlined"
                />
                <TextField
                  id="contact-message"
                  label="Message"
                  placeholder="Type your message here."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className="flex flex-grow self-stretch !h-8 pointer-events-none">
                          <Message/>
                      </InputAdornment>
                    ),
                  }}
                  className="!resize"
                  multiline
                  minRows={6}
                  required
                  value={message}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    set_message(event.currentTarget.value);
                  }}
                  variant="outlined"
                />
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    className="self-center !bg-l_primary-100 dark:!bg-d_primary-100 !text-l_onPrimary-100 dark:!text-d_onPrimary-100"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
            :
            <>
              <div>
                <Text type="h0">Message successfully sent.</Text>
                <Text>Thank you for your interest; I'll reply as soon as possible.</Text>
              </div>
              <div>
                <Text type="h3" className="text-center">In the meantime, check out my other projects:</Text>
                <ImageList className="self-end grid-cols-1 sm:grid-cols-2" cols={0}>
                {  
                  projects.map((project, index) => {
                    if(index > 1) return;
                    return (
                      <ImageListItem key={index}>
                        <Touchable 
                          className="Flip Projects_ListItem py-4 my-2 rounded-lg select-none cursor-pointer" 
                          style={{
                            animationDelay: index*100 + 100 + "ms"
                          }}
                          onClick={
                            ()=>{
                              navigate(`/projects/${index}`)
                            }
                          }>
                          <img
                            draggable={false}
                            src={project.image_path}
                            alt={project.name}
                            loading={"lazy"}
                            className="object-cover select-none px-4 w-full h-72 object-top"
                          />
                          <ImageListItemBar
                            title={<Text type="h1" className="text-wrap h-24 md:h-16">{`${project.name}`}</Text>}
                          />
                        </Touchable>
                      </ImageListItem>
                    )
                  })
                }
                </ImageList>
              </div>
            </>
          }
        </div>
      </div>
      <Backdrop
        open={show_progress}
        className="z-50"
      >
        <CircularProgress/>
      </Backdrop>
      <Snackbar
        open={snackbar_open}
        autoHideDuration={snackbar_timeout}
        onClose={() => {
          set_snackbar_open(false);
        }}
        message={<>
          <Text>
            {snackbar_message}
          </Text>
        </>}
      />
    </App>
  );
}