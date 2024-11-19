import { GenericComponentProps } from "components/Generic"
import "./index.css"
import AppHeader from "components/AppHeader";
import { Text } from "components/Generic/Text";

export type PageTemplateProps = {
    
} & GenericComponentProps;

/**
 * Base for pages to ensure a consistent style
 */
export default function PageTemplate({children}: GenericComponentProps) {
    return (
        <div className="page box-border p-0 m-0 scroll-smooth min-w-fit min-h-screen">
            <AppHeader/>
            <Text text="Header" className="gradient__text" type="title"/>
            <Text text="Header" type="h1"/>
            <Text text="Header" type="h2"/>
            <Text text="Header" type="h3"/>
            <Text text="Header" type="h4"/>
            <Text text="Header" type="h5"/>
            {children}
        </div>
    )
}