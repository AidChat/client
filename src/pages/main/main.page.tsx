import {Panel} from "../../components/Panel";
import {useWindowSize} from "../../services/hooks/appHooks";
import "./main.page.css";
import {EwindowSizes} from "../../utils/enum";
import {ShellContextProvider} from "../../services/context/shell.context";
import {AuthContextProvider} from "../../services/context/auth.context";

export const Main = () => {
  const {size: isSmall} = useWindowSize(EwindowSizes.S);

  return (
    <div
      className={
        isSmall ? "main-container-wrapper fullCover" : "main-container-wrapper"
      }
    >
      <div id={'block-wrapper'} className={"main-container"}>
        <AuthContextProvider>
          <ShellContextProvider>
            <Panel />
          </ShellContextProvider>
        </AuthContextProvider>
      </div>
    </div>
  );
};
