import { Text } from "components/Generic/Text";
import "./index.css";
import { A } from "components/AppHeader";
import Github from "assets/Github";
import Icon from "components/Generic/Icon";
import LinkedIn from "assets/LinkedIn";
import Email from "assets/Email";
import { Link } from "react-router-dom";
import Touchable from "components/Generic/Touchable";

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
                <Touchable className="px-2 cursor-pointer">
                    <Link to="https://github.com/JamesG9802/jamesg9802.github.io/issues">
                        <Text className="font-normal">Found an issue? Report it here.</Text>
                    </Link>
                </Touchable>
                </div>
            </div>
        </div>
    </footer>);
}