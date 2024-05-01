import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";

import "App.css";
import { GenericComponentProps } from "components/Generic";

/**
 * Wraps screens to give a consistent site appearance.
 * @param props
 * @returns 
 */
function App({children}: GenericComponentProps) {
  return (
    <div id="page" className="flex flex-col">
      <div id="content" className="flex flex-col flex-grow">
        <AppHeader/>
        {children}
      </div>
      <AppFooter/>
    </div>
  )
}

export default App
