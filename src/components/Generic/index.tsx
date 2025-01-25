import { ReactNode } from "react";

/**
 * Props commonly shared among components.
 */
export type GenericComponentProps = {
    className?: string;
    style?: React.CSSProperties; 
    children?: ReactNode;
}