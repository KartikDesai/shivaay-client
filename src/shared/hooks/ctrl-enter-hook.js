import {useEffect} from "react";

const useCtrlEnter = (buttonRef) => {
    useEffect(() => {
        const listener = event => {
            if (event.keyCode===13 && event.ctrlKey) {
                if (buttonRef.current && buttonRef.current.props) {
                    buttonRef.current.props.onClick();
                }
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, []);
}
export default useCtrlEnter;

