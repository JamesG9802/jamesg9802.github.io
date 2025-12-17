import * as NextLink from "next/link";
import { ComponentProps } from "react";

export type LinkProps = ComponentProps<typeof NextLink.default>;

/**
 * The application component for links.
 * Currently is a facade over next-view-transitions.
 */
export default function Link(props: LinkProps) {
  return <NextLink.default {...props} />;
}