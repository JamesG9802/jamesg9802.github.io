import { Text } from "components/Generic/Text";
import "./index.css";
import Github from "assets/Github";
import Icon from "components/Generic/Icon";
import LinkedIn from "assets/LinkedIn";
import { Link } from "react-router-dom";
import Touchable from "components/Generic/Touchable";
import MailObfuscation from "components/Mail";

export default function AppFooter() {
    return (<footer id="footer">
        <div className="Body-Container flex flex-col">
            <div className="flex flex-row Body-Container-Child justify-center">
                <div className="flex flex-col items-center">
                <div className="flex flex-row items-center space-x-4">
                    <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802"><Icon><Github/></Icon></Link>
                    <Link target="_blank" rel="noreferrer" to="https://www.linkedin.com/in/james-g-01466b286/"><Icon><LinkedIn/></Icon></Link>
                    <MailObfuscation/>
                </div>
                <Touchable className="px-2 cursor-pointer">
                    <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802/jamesg9802.github.io/issues">
                        <Text className="font-normal">Found an issue? Report it here.</Text>
                    </Link>
                </Touchable>
                </div>
            </div>
            <div className="flex flex-row Body-Container-Child justify-center">
                <Touchable className="px-2 cursor-pointer">
                    <Link target="_blank" rel="noreferrer" to="https://creativecommons.org/licenses/by-sa/4.0/">
                        <Text className="font-normal">{`This portfolio © 2024 is licensed under CC BY-SA 4.0 License `}
                        <img className="inline-flex h-5" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""/>
                        <img className="inline-flex h-5" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""/>
                        <img className="inline-flex h-5" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""/>
                        </Text>
                    </Link>
                </Touchable>
            </div>
        </div>
    </footer>);
}