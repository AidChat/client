import {ImPencil2} from "react-icons/im";
import Tooltip from "../../../components/Utils/Tooltip";
import './style.css'
export function BlogIcon() {
    return (
        <>
            <div className={'blog-icon-container'}>
            <Tooltip text={"Blogs"} >
                <ImPencil2 style={{cursor:'pointer'}} color={"#1C1C1C"} size={22}/>
            </Tooltip>
            </div>
        </>
    )
}