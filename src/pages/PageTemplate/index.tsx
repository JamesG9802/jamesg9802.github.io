import { GenericComponentProps } from "components/Generic"
import "./index.css"

/**
 * Base for pages to ensure a consistent style
 */
export default function PageTemplate({className, children}: GenericComponentProps) {
    return (
        <div 
            className={`p-0 mx-0 my-0 
                min-h-screen
                scroll-smooth
                font-sans ${className}`
            }
        >
            {children}
        </div>
    )
}