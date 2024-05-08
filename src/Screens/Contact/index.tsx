import { Button, Snackbar, TextField } from "@mui/material";
import App from "App";
import { Text } from "components/Generic/Text";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Email, Message } from "@mui/icons-material";
import { useState } from "react";

//  Time for snackbar to timeout in milliseconds
const snackbar_timeout = 6000;

export default function Contact() {
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [message, set_message] = useState("");

  const [snackbar_open, set_snackbar_open] = useState(false);

  return (
    <App current_page="Contact">
      <div className="mt-8 flex flex-col">
        <div className="self-center w-full max-w-4xl">
          <Text type="h0" className="pb-8">Contact Me</Text>
          <form className="flex flex-col space-y-4 max-w-2xl" onSubmit={(e) => {
            e.preventDefault();
            let name: HTMLInputElement | null = document.querySelector("#contact-name");
            let email: HTMLInputElement | null = document.querySelector("#contact-email");
            let message: HTMLInputElement| null = document.querySelector("#contact-message");
            if(!name || !email || !message ||
              !name.validity || !email.validity || !message.validity
            ) {
              return;
            }
            set_snackbar_open(true);
          }}>
            <TextField
              id="contact-name"
              label="Name"
              placeholder="Jane Doe"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
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
                  <InputAdornment position="start">
                    <Email />
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
                  <InputAdornment position="start" className="flex flex-grow self-stretch !h-8">
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
                className="self-center"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Snackbar
        open={snackbar_open}
        autoHideDuration={snackbar_timeout}
        onClose={() => {
          set_snackbar_open(false);
        }}
        message={<>
          <Text>
            Your message has been sent.
          </Text>
        </>}
      />
    </App>
  );
}