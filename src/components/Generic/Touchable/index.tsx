import TouchRipple, { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple';
import "./index.css"
import { useRef } from 'react';
import { GenericComponentProps } from 'components/Generic';

export type TouchableProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * A Touchable container to wrap around other components.
 */
export default function Touchable({style, className, children, onClick, ...props}: TouchableProps) {
    const rippleRef = useRef<TouchRippleActions>(null);
    return (
        <div onClick={onClick}
            {...props}
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