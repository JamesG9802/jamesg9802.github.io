/**
 * RightColumnLayout components have the same props as an HTML div element.
 */
export type RightColumnLayoutProps = {
  /**
   * The padding class override.
   */
  paddingClass?: string;
} & React.HTMLProps<HTMLDivElement>;

/**
 * Creates a layout designed for displaying content anchored to the right of a container.
 */
export default function RightColumnLayout({ className, paddingClass, children, ...props }: RightColumnLayoutProps) {
  return (
    <div
      className={`ml-auto max-w-screen-sm xl:max-w-3xl ${className || ""} ${paddingClass || "mr-4 px-4"}`}
      {...props}
    >
      {children}
    </div>
  )
}