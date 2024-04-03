import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";
import Home from "Screens/Home";

import "App.css";

function App() {
  return (
    <div id="page" className="flex flex-col">
      <div id="content" className="flex flex-col flex-grow">
        <AppHeader/>
        <Home/>
      </div>
      <AppFooter/>
    </div>
  )
}

export default App
