import App from "App";
import { Text } from "components/Generic/Text";

export default function Contact() {
  return (
    <App current_page="Contact">
      <Text type="title" className="text-center">Contact Me</Text>
      <Text type="h1" className="text-center text-l_primary-100 dark:text-d_primary-100">
        Got any questions? Feel free to get in touch.
      </Text>
    </App>
  );
}