import "./index.css";
import Touchable, { TouchableProps } from "components/Generic/Touchable";

export default function Icon({style, className, onClickCapture, children}: TouchableProps) {
    return (
        <Touchable onClickCapture={onClickCapture}>
            <div style={style} className={className != undefined ? "Icon " + className : "Icon"}>
                {children}
            </div>
        </Touchable>
    );
}