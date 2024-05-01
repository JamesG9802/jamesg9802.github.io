import { ReactNode, useState } from "react";
import { Button, Drawer} from "@mui/material";
import { Text, TextProps } from "components/Generic/Text";

import Github from "assets/Github";
import LinkedIn from "assets/LinkedIn";
import Email from "assets/Email";
import Icon from "components/Generic/Icon";
import { Link } from "react-router-dom";
import Touchable from "components/Generic/Touchable";
import { LinkText } from "components/Generic/Link";
import MenuIcon from "assets/Menu";

/**
 * Shorthand for a tag with styling.
 */
function A({href, children}: {href: string, children?: ReactNode}) {
    return <a className="inline-flex" target="_blank" rel="noreferrer" href={href}>{children}</a>
}

function Title({className}: TextProps) {
    return <Text className={className} type="h1" text="James Gaiser"/>
}

export default function AppHeader() {
    function SmallHeader() {
        const [open, setOpen] = useState(false);
        return (
        <div className="flex md:hidden flex-col items-center">
            <div className="flex flex-row items-center">
                <Title className="p-4"/>
                <Icon onClickCapture={(_e) =>{ setOpen(true)}}><MenuIcon/></Icon>
            </div>
            <Drawer open={open} onClose={()=>{setOpen(false)}}>
                <div className="flex grow flex-col justify-start items-center px-5 Default-Style-Container">
                    <LinkText containerClassName="p-4" to="/"><Text type="h2">Home</Text></LinkText>
                    <LinkText containerClassName="p-4" to="/aboutme"><Text type="h2">About Me</Text></LinkText>
                    <LinkText containerClassName="p-4" to="/projects"><Text type="h2">Projects</Text></LinkText>
                    <div className="flex flex-row justify-between">
                        <Icon><A href="https://github.com/JamesG9802"><Github/></A></Icon>
                        <Icon><A href="https://www.linkedin.com/in/james-g-01466b286/" ><LinkedIn/></A></Icon>
                        <Icon><A href="mailto:jamesg9802@gmail.com"><Email/></A></Icon>
                    </div>
                </div>
            </Drawer>
        </div>);
    }
    function BigHeader() {
        return (
        <div className="hidden md:flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-start space-x-2">
            <LinkText containerClassName="p-2" to="/"><Text type="h3">Home</Text></LinkText>
            <LinkText containerClassName="p-2" to="/aboutme"><Text type="h3">About Me</Text></LinkText>
            <LinkText containerClassName="p-2" to="/projects"><Text type="h3">Projects</Text></LinkText>
            </div>
            <Title/>
            <div className="flex flex-row items-center space-x-4">
                <Icon><A href="https://github.com/JamesG9802"><Github/></A></Icon>
                <Icon><A href="https://www.linkedin.com/in/james-g-01466b286/" ><LinkedIn/></A></Icon>
                <Icon><A href="mailto:jamesg9802@gmail.com"><Email/></A></Icon>
            </div>
        </div>);
    }
    return (
    <header className="flex-grow-0 px-5 py-5 shadow-[0px_8px_4px_-8px] shadow-l_onBackground-100/25 dark:shadow-d_onBackground-100/25">
        <SmallHeader/>
        <BigHeader/>
    </header>
    );
}
