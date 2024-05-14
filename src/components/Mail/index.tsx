import Email from "assets/Email";
import Icon from "components/Generic/Icon";
import { useState } from "react";
import { Link } from "react-router-dom";

export function get_email(is_user: boolean) {
    const me = "jamesg9802";
    const domain = "gmail.com";
    return `${me}${is_user && Math.random() < 100 ? `@` : `[replace this with @]`}${domain}`;
}

export default function MailObfuscation() {
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
            <Link target="_blank" rel="noreferrer" to={is_user ? `mailto:${get_email(is_user)}` : `To prevent webscraping attacks, my email is rendered through JavaScript. You can see my email by clicking on the mail icon.`}>
                <Icon>
                    <Email/>
                </Icon>
            </Link>
        </div>
    );
}