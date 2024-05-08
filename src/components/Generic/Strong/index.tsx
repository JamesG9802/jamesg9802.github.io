import { GenericComponentProps } from "components/Generic";

export type StrongProps = {
    text?: string
} & GenericComponentProps;

/**
 * Generic component for text.
 * @param props for Text
 * @returns 
 */
export function Strong({style, className, text, children}: StrongProps) {
    return (
        <strong style={style} className={"text-base font-bold " + className}>
            {text}{children}
        </strong>
    );
}