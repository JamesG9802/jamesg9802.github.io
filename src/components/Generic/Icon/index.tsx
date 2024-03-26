import { GenericComponentProps } from "components/Generic";
import "./index.css";
import Touchable from "components/Generic/Touchable";

export default function Icon({style, className, children}: GenericComponentProps) {
    return (
        <Touchable>
            <div style={style} className={className != undefined ? "Icon " + className : "Icon"}>
                {children}
            </div>
        </Touchable>
    );
}