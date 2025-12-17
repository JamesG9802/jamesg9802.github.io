import { Link as NextLink } from "@jamesg9802/next-view-transitions";
import { ComponentProps } from "react";

export type LinkProps = ComponentProps<typeof NextLink>;

/**
 * The application component for links.
 * Currently is a facade over next-view-transitions.
 */
export default function Link(props: LinkProps) {
  return <NextLink {...props} />;
}