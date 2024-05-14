import { useState } from "react";
import { Drawer} from "@mui/material";
import { Text } from "components/Generic/Text";

import Github from "assets/Github";
import LinkedIn from "assets/LinkedIn";
import Icon from "components/Generic/Icon";
import { LinkText } from "components/Generic/Link";
import MenuIcon from "assets/Menu";
import { Link } from "react-router-dom";
import MailObfuscation from "components/Mail";
import { Page } from "App";

type HeaderLinkTextProps = {
    text: string,
    page: Page,
    link: string,
    current_page: Page
}
function HeaderLinkText({text, page, link, current_page}: HeaderLinkTextProps) {
    return (
        <div onClick={()=>{window.scrollTo(0, 0)}}>
            <LinkText containerClassName="p-2" to={link}>
                <Text type="h3" className={page == current_page ? "underline" : "font-semibold"}>
                    {text}
                </Text>
            </LinkText>
        </div>
    );
}

export type AppProps = {
    current_page: Page
};

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
                    <HeaderLinkText text="James Gaiser" page="Home" current_page={current_page} link="/"/>
                    <HeaderLinkText text="About Me" page="About Me" current_page={current_page} link="/aboutme"/>
                    <HeaderLinkText text="Projects" page="Projects" current_page={current_page} link="/projects"/>
                    <HeaderLinkText text="Contact" page="Contact" current_page={current_page} link="/contact"/>
                    <div className="flex flex-row justify-between">
                        <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802"><Icon><Github/></Icon></Link>
                        <Link target="_blank" rel="noreferrer" to="https://www.linkedin.com/in/james-g-01466b286/"><Icon><LinkedIn/></Icon></Link>
                        <MailObfuscation/>
                    </div>
                </div>
            </Drawer>
        </div>);
    }
    function BigHeader() {
        return (
        <div className="hidden min-[800px]:flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-start space-x-2">
                <HeaderLinkText text="James Gaiser" page="Home" current_page={current_page} link="/"/>
                <HeaderLinkText text="About Me" page="About Me" current_page={current_page} link="/aboutme"/>
                <HeaderLinkText text="Projects" page="Projects" current_page={current_page} link="/projects"/>
                <HeaderLinkText text="Contact" page="Contact" current_page={current_page} link="/contact"/>
            </div>
            <div className="flex flex-row items-center space-x-4">
                <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802"><Icon><Github/></Icon></Link>
                <Link target="_blank" rel="noreferrer" to="https://www.linkedin.com/in/james-g-01466b286/"><Icon><LinkedIn/></Icon></Link>
                <MailObfuscation/>
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
