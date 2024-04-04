import { Text } from "components/Generic/Text";
import "./index.css";

export default function AppFooter() {
    return (<footer id="footer">
        <div className="Body-Container">
            <div className="flex flex-row Body-Container-Child justify-center">
                <div className="flex flex-col items-center">
                    <Text>Developed with React and Vite.</Text>
                    <Text>View source code <a href="https://github.com/JamesG9802/jamesg9802.github.io">here</a>.</Text>
                </div>
            </div>
        </div>
    </footer>);
}