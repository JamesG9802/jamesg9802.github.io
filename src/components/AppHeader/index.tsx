import { LinkText } from "components/Generic/Link";
import { Text, TextProps } from "components/Generic/Text";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';

import "./index.css";
import { Drawer } from "components/Generic/Drawer";

/**
 * Component for the header links.
 * @returns 
 */
function HeaderLink({children} : TextProps) {
    return (
        <Text type="normal" children={children} className="my-0 mx-4 cursor-pointer font-bold  text-nowrap"/>
    )
}

export default function AppHeader() {
    const [open, set_open] = useState<boolean>(false);
    return (
        <div className="top-0 sticky flex justify-between items-center px-8 py-24 bg-success/50">            
            <div className="flex flex-1 justify-start items-center mr-8">
                <Text type="h4" className="cursor-pointer font-bol text-nowrap">
                    <LinkText to="/">James Gaiser</LinkText>
                </Text>
            </div>
            <div className="hidden sm:flex flex-row" >
                <HeaderLink><LinkText to="/projects">Projects</LinkText></HeaderLink>
                <HeaderLink><LinkText to="/contact">Contact</LinkText></HeaderLink>
            </div>
            <div className="flex sm:hidden cursor-pointer" onClick={()=>{set_open(!open);}}>
                {
                    open ? <MenuIcon/> :
                    <MenuIcon/> 
                }
            </div>
            <Drawer open={open} onClose={() => { set_open(false); }}>
                <div className="flex flex-col justify-end items-start text-end 
                    p-8 mt-4 min-w-56 rounded-sm shadow-md cursor-default scale-up-center space-y-2"
                >        
                    <HeaderLink><LinkText to="/projects">Projects</LinkText></HeaderLink>
                    <HeaderLink><LinkText to="/contact">Contact</LinkText></HeaderLink>
                </div>
            </Drawer>
        </div>
    )
}