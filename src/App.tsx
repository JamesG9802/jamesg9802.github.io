import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";

import "App.css";
import { GenericComponentProps } from "components/Generic";

export type Page = "Home" | "About Me" | "Projects" | "Contact";

export type AppProps = {
  current_page: Page
  hide_header?: boolean
  hide_footer?: boolean
} & GenericComponentProps;

/**
 * Wraps screens to give a consistent site appearance.
 * @param props
 * @returns 
 */
function App({current_page, hide_header, hide_footer, children}: AppProps) {
  return (
    <div id="page" className="flex flex-col">
      <div id="content" className="flex flex-col flex-grow">
        {!hide_header && <AppHeader current_page={current_page}/>}
        {children}
      </div>
      {!hide_footer && <AppFooter/>}
    </div>
  )
}

export default App
