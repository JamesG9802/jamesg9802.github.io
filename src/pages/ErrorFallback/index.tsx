import AppFooter from "components/AppFooter";
import AppHeader from "components/AppHeader";
import { Text } from "components/Generic/Text";
import PageTemplate from "pages/PageTemplate";

export default function ErrorFallback() {
  return (
    <PageTemplate className="bg-background text-onbackground ">
      <div className="min-h-screen flex flex-col mx-auto max-w-screen-md">
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="p-8 mx-auto w-fit">
            <Text type="title">Page not found.</Text>
          </div>
          <Text>The page you are trying to navigate to either doesn't exist or something has broken. You can send a message to the developer below.</Text>
        </div>
        <AppFooter />
      </div>
    </PageTemplate>
  )
}