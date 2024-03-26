import AppHeader from "components/AppHeader";
import Canvas from "components/Generic/Canvas";
import AppFooter from "components/AppFooter";

import "App.css";

function App() {
  return (
    <div id="content" className="flex flex-col">
      <AppHeader/>
      <div className="flex-grow">
        <Canvas/>
      </div>
      <AppFooter/>
    </div>
  )
}

export default App
