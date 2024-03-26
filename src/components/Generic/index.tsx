import { CSSProperties, ReactNode } from "react";

/**
 * Props commonly shared among components.
 */
export type GenericComponentProps = {
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}