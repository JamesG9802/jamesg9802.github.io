import { LinkText } from "components/Generic/Link";

export default function AppHeader(): JSX.Element {
  return (
    <div className="sticky top-0 p-2 border-solid border-0 border-b-2 bg-background/80 border-outline/20">
      <div className="mx-auto max-w-screen-md flex flex-row justify-between">
        <div>
          <LinkText to="/" type="normal" className="font-semibold text-2xl no-underline">
            Home
          </LinkText>
        </div>
        <div className="flex-row justify-between space-x-4">
          <LinkText to="/archives" type="normal" className="text-2xl no-underline">
            Posts
          </LinkText>
          <LinkText to="https://github.com/JamesG9802" type="normal" className="text-2xl no-underline">
            Github
          </LinkText>
        </div>
      </div>
    </div>
  );
}