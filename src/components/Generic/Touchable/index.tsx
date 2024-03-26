import TouchRipple, { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple';
import "./index.css"
import { useRef } from 'react';
import { GenericComponentProps } from 'components/Generic';

/**
 * A Touchable container to wrap around other components.
 */
export default function Touchable({style, className, children}: GenericComponentProps) {
    const rippleRef = useRef<TouchRippleActions>(null);
    return (
        <div 
            style={style} 
            className={className != undefined ? "Touchable-Container " + className : "Touchable-Container"}
            onMouseDown={(event) => {
                if(rippleRef.current != null)
                    rippleRef.current.start(event);
            }}
            onMouseUp={(event) => {
                if(rippleRef.current != null)
                    rippleRef.current.stop(event);
            }}
            onMouseLeave={(event) => {
                if(rippleRef.current != null)
                    rippleRef.current.stop(event);
            }}
        >
            {children}
            <TouchRipple ref={rippleRef} center={false} />
        </div>
    )

}