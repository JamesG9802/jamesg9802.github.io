import { Navbar } from "components/Navbar";

/**
 * PageLayout components have the same props as an HTML div element.
 */
export type PageLayoutProps = React.HTMLProps<HTMLDivElement>;

/**
 * Creates a layout designed for pages.
 */
export default function PageLayout({ className, children, ...props }: PageLayoutProps) {
  return (
    <main
      className={`min-h-screen bg-base-200 scroll-smooth ${className || ""}`}
      {...props}
    >
      <Navbar />
      {children}
    </main>
  )
}