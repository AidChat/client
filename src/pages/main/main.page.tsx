import {Panel} from "../../components/Panel";
import {useWindowSize} from "../../services/hooks/appHooks";
import "./main.page.css";
import {EwindowSizes} from "../../utils/enum";
export const Main = () => {
  const {size: isSmall} = useWindowSize(EwindowSizes.S);
  return (
    <div
      className={
        isSmall ? "main-container-wrapper fullCover" : "main-container-wrapper"
      }
    >
      <div className={"main-container"}>
        <Panel />
      </div>
    </div>
  );
};
