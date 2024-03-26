import { GenericComponentProps } from "components/Generic";

export type TextProps = {
    /**
     * The type of text which affects the styling. Defaults to normal if no type is specified.
     */
    type?: "normal" | "h1" | "h2"
    
    text?: string
} & GenericComponentProps;

/**
 * Generic component for text.
 * @param props for Text
 * @returns 
 */
export function Text({type, style, className, text, children}: TextProps) {
    let class_styling;
    if(type == undefined)
        type = "normal";
    switch(type) {
        case "normal":
            class_styling = "text-base";
            break;
        case "h1":
            class_styling = "font-bold text-3xl";
            break;
        case "h2":
            class_styling = "font-bold text-xl";
            break;
    }
    return (
        <p style={style} className={className != undefined ? class_styling + " " + className : class_styling}>
            {text}{children}
        </p>
    );
}