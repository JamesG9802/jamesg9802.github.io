import { ReactNode, useState } from "react";
import { Drawer} from "@mui/material";
import { Text } from "components/Generic/Text";

import Github from "assets/Github";
import LinkedIn from "assets/LinkedIn";
import Email from "assets/Email";
import Icon from "components/Generic/Icon";
import { LinkText } from "components/Generic/Link";
import MenuIcon from "assets/Menu";

export type AppProps = {
    current_page: "Home" | "About Me" | "Projects" | "Contact"
};

/**
 * Shorthand for a tag with styling.
 */
export function A({href, children}: {href: string, children?: ReactNode}) {
    return <a className="inline-flex" target="_blank" rel="noreferrer" href={href}>{children}</a>
}

export default function AppHeader({current_page}: AppProps) {
    function SmallHeader() {
        const [open, setOpen] = useState(false);
        return (
        <div className="flex min-[800px]:hidden flex-col items-center">
            <div className="flex flex-row items-center">
                <Icon onClickCapture={(_e) =>{ setOpen(true)}}><MenuIcon/></Icon>
            </div>
            <Drawer open={open} onClose={()=>{setOpen(false)}}>
                <div className="flex grow flex-col justify-start items-center px-5 Default-Style-Container">
                    <LinkText containerClassName="p-4" to="/">
                        <Text type="h3" className={current_page == "Home" ? "underline" : ""}>
                            Home
                        </Text>
                    </LinkText>
                    <LinkText containerClassName="p-4" to="/aboutme">
                        <Text type="h3" className={current_page == "About Me" ? "underline" : ""}>
                            About Me
                        </Text>
                    </LinkText>
                    <LinkText containerClassName="p-4" to="/projects">
                        <Text type="h3" className={current_page == "Projects" ? "underline" : ""}>
                            Projects
                        </Text>
                    </LinkText>
                    <LinkText containerClassName="p-4" to="/contact">
                        <Text type="h3" className={current_page == "Projects" ? "underline" : ""}>
                            Contact
                        </Text>
                    </LinkText>
                    <div className="flex flex-row justify-between">
                        <Icon><A href="https://github.com/JamesG9802"><Github/></A></Icon>
                        <Icon><A href="https://www.linkedin.com/in/james-g-01466b286/" ><LinkedIn/></A></Icon>
                        <Icon><A href="mailto:***REMOVED***"><Email/></A></Icon>
                    </div>
                </div>
            </Drawer>
        </div>);
    }
    function BigHeader() {
        return (
        <div className="hidden min-[800px]:flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-start space-x-2">
                <LinkText containerClassName="p-2" to="/">
                    <Text type="h3" className={current_page == "Home" ? "underline" : ""}>
                        James Gaiser
                    </Text>
                </LinkText>
                <LinkText containerClassName="p-2" to="/aboutme">
                    <Text type="h3" className={current_page == "About Me" ? "underline" : ""}>
                        About Me
                    </Text>
                </LinkText>
                <LinkText containerClassName="p-2" to="/projects">
                    <Text type="h3" className={current_page == "Projects" ? "underline" : ""}>
                        Projects
                    </Text>
                </LinkText>
                <LinkText containerClassName="p-2" to="/contact">
                    <Text type="h3" className={current_page == "Contact" ? "underline" : ""}>
                        Contact
                    </Text>
                </LinkText>
            </div>
            <div className="flex flex-row items-center space-x-4">
                <Icon><A href="https://github.com/JamesG9802"><Github/></A></Icon>
                <Icon><A href="https://www.linkedin.com/in/james-g-01466b286/" ><LinkedIn/></A></Icon>
                <Icon><A href="mailto:***REMOVED***"><Email/></A></Icon>
            </div>
        </div>);
    }
    return (
    <header className="flex-grow-0 p-1 sticky top-0 bg-l_background-100 dark:bg-d_background-100 z-50
    shadow-[0px_8px_4px_-8px] shadow-l_onBackground-100/25 dark:shadow-d_onBackground-100/25">
        <SmallHeader/>
        <BigHeader/>
    </header>
    );
}
