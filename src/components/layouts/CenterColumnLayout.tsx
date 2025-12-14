/**
 * CenterColumnLayout components have the same props as an HTML div element.
 */
export type CenterColumnLayoutProps = {
  /**
   * The padding class override.
   */
  paddingClass?: string;
} & React.HTMLProps<HTMLDivElement>;

/**
 * Creates a layout designed for displaying content centered in a container.
 */
export default function CenterColumnLayout({ className, paddingClass, children, ...props }: CenterColumnLayoutProps) {
  return (
    <div
      className={`mx-auto max-w-screen-sm xl:max-w-3xl ${className || ""} ${paddingClass || "px-4"}`}
      {...props}
    >
      {children}
    </div>
  )
}