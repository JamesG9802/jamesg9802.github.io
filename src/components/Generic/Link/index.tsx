import { Link, LinkProps } from "react-router-dom";
import Touchable from "../Touchable";

export type LinkTextProps = {
    to: string,
    containerClassName?: string,
} & LinkProps;

/**
 * Generic component for text.
 * @param props for Text
 * @returns 
 */
export function LinkText({style, to, className, containerClassName, children, ...props}: LinkTextProps) {
    return (
        <Link to={to} style={style} className={className} {...props}>
                <Touchable className={containerClassName}>
            {children}
            </Touchable>
        </Link>
    );
}