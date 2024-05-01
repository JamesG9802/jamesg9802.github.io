import { Text } from "components/Generic/Text";
import "./index.css";
import { A } from "components/AppHeader";
import Github from "assets/Github";
import Icon from "components/Generic/Icon";
import LinkedIn from "assets/LinkedIn";
import Email from "assets/Email";

export default function AppFooter() {
    return (<footer id="footer">
        <div className="Body-Container">
            <div className="flex flex-row Body-Container-Child justify-center">
                <div className="flex flex-col items-center">
                <div className="flex flex-row items-center space-x-4">
                    <Icon><A href="https://github.com/JamesG9802"><Github/></A></Icon>
                    <Icon><A href="https://www.linkedin.com/in/james-g-01466b286/" ><LinkedIn/></A></Icon>
                    <Icon><A href="mailto:***REMOVED***"><Email/></A></Icon>
                </div>
                    <Text>Found an issue? Report it <a href="https://github.com/JamesG9802/jamesg9802.github.io/issues">here</a>.</Text>
                </div>
            </div>
        </div>
    </footer>);
}