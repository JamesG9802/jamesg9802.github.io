import { mdiEmail, mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import { LinkText } from "components/Generic/Link";
import { Text } from "components/Generic/Text";

export default function AppFooter() {
    return (
        <div className="bg-surfacevariant text-onsurfacevariant flex-grow-0 py-8 px-4 rounded-t-md">
            <div className="flex flex-row justify-between">
                <div className="flex-1">
                    <div className="flex flex-row items-center space-x-2">
                        <Icon path={mdiEmail} size={1} />
                        <Text><LinkText to="mailto:61638683+JamesG9802@users.noreply.github.com">Send me a message</LinkText></Text>
                    </div>
                </div>
                <div className="flex-1 flex-col">
                    <div className="flex flex-row items-center space-x-2">
                        <Icon path={mdiGithub} size={1} />
                        <Text><LinkText to="https://github.com/JamesG9802">Github</LinkText></Text>
                    </div>
                </div>
                <div className="flex-1">
                    <Text>Made with React.</Text>
                </div>
            </div>
        </div>
    )
}