import { ReactNode, useState } from "react";
import { Button, Drawer} from "@mui/material";
import { Text } from "components/Generic/Text";

import Github from "assets/Github";
import LinkedIn from "assets/LinkedIn";
import Email from "assets/Email";
import Icon from "components/Generic/Icon";

/**
 * Shorthand for a tag with styling.
 */
function A({href, children}: {href: string, children?: ReactNode}) {
    return <a className="inline-flex" target="_blank" rel="noreferrer" href={href}>{children}</a>
}

function Title() {
    return <Text type="h1" text="James Gaiser"/>
}

export default function AppHeader() {
    function SmallHeader() {
        const [open, setOpen] = useState(false);
        return (
        <div className="flex sm:hidden flex-col items-center">
            <Title/>
            <Button onClick={()=>{setOpen(true)}}>Click me</Button>
            <Drawer open={open} onClose={()=>{setOpen(false)}}>
                <div className="flex grow flex-col justify-start items-center px-5 Default-Style-Container">
                    <Text type="h2">Fake</Text>
                    <Text>Also fake</Text>
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
        <div className="hidden sm:flex flex-row justify-between items-center">
            <Text type="h2" text="Home"/>
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
