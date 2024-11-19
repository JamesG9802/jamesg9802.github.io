import { Link, LinkProps } from "react-router-dom";

/**
 * Generic component for text.
 * @param props for Text
 * @returns 
 */
export function LinkText({style, to, className, children, ...props}: LinkProps) {
    return (
        <Link to={to} rel="norefrrer" style={style} className={`hover:underline ${className}`} {...props}>
            {children}
        </Link>
    );
}