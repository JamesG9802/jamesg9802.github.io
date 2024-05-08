import Email from "assets/Email";
import Icon from "components/Generic/Icon";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MailObfuscation() {
    const me = "jamesg9802";
    const domain = "gmail.com";
    const [is_user, set_is_user] = useState(false);
    return (
        <div 
            onMouseEnter={() => {
                set_is_user(true);
            }}
            onMouseMove={() => {
                set_is_user(true);
            }}
            onMouseLeave={() => {
                set_is_user(false);
            }}
        >
            <Link target="_blank" rel="noreferrer" to={is_user ? `mailto:${me}@${domain}` : `To prevent webscraping attacks, my email is rendered through JavaScript. You can see my email by clicking on the mail icon.`}>
                <Icon>
                    <Email/>
                </Icon>
            </Link>
        </div>
    );
}