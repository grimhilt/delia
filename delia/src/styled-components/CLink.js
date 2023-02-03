import { Link } from "react-router-dom";
import { COLORS } from "../styles/colors";


export function CLink({ children, to }) {
    
    const style = {};
    style['color'] = COLORS.primary;
    
    return (
        <Link style={style} to={to}>{children}</Link>
    );
  }