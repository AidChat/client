import React, {useContext, useEffect, useState} from "react";
import "./index.css";
import {RiSearchLine} from "react-icons/ri";
import {GroupList, GroupListInterface} from "../GroupList";
import {DialogPanel} from "../../../Dialog";
import {GroupForm} from "../../GroupForm";
import {Logo} from "../../../utility/Logo";
import {Spinner} from "../../../utility/Spinner/spinner";
import {
  _props,
  reqType,
  service,
  serviceRoute,
} from "../../../../services/network/network";
import {ShellContext} from "../../../../services/context/shell.context";
import {FaHandHoldingHeart} from "react-icons/fa6";
import Tooltip from "../../../utility/Tooltip";
import {IoIosArrowBack} from "react-icons/io";
import {EwindowSizes, useWindowSize} from "../../../../services/hooks/appHooks";
export function GroupListPanel() {
  const [loading, _loading] = useState<boolean>(false);
  const {refetch} = useContext(ShellContext);
  const [items, setItem] = useState<GroupListInterface[] | []>([]);
  const [reqBlock, _blockRequest] = useState<boolean>(false);
  const [search, _search] = useState<string | null>(null);
  const {updateSidePanelState} = useContext(ShellContext);
  const {size: isSmall} = useWindowSize(EwindowSizes.S);
  useEffect(() => {
    if (search) {
      if (reqBlock) {
        window.setTimeout(() => {
          if (reqBlock) {
            _blockRequest(false);
          }
        }, 500);
      } else {
        fetchSearchResults();
        _blockRequest(true);
      }
    } else {
      _props
        ._db(service.group)
        .query(serviceRoute.group, undefined, reqType.get)
        .then(response => {
          setItem(response.data);
        });
    }
  }, [search]);

  function close() {
    updateSidePanelState(function (previous: {Group: boolean; Util: boolean}) {
      return {
        ...previous,
        Group: !previous.Group,
      };
    });
  }

  function fetchSearchResults() {
    _loading(true);
    _props
      ._db(service.group)
      .query(serviceRoute.search, {search}, reqType.post, undefined)
      .then(result => {
        _loading(false);
        setItem(result.data);
      });
  }

  useEffect(() => {
    _props
      ._db(service.group)
      .query(serviceRoute.group, undefined, reqType.get)
      .then(response => {
        setItem(response.data);
      });
  }, [refetch]);
  return (
    <div style={{width: "100%"}}>
      <div className={"item-container"}>
        <div className={" item searchItem"}>
          <Logo />
          <SearchContact
            onChange={(e: string) => {
              _search(e);
            }}
          />
          <CreateGroup />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {isSmall && (
              <div className={"backBtnGroupList"}>
                <IoIosArrowBack
                  size="22"
                  color="whitesmoke"
                  onClick={() => close()}
                  className="div_animateLR"
                />
              </div>
            )}
            {!search ? (
              <>
                <div
                  className={"font-primary mygroup-label "}
                  style={{
                    fontWeight: "bolder",
                    display: "flex",
                    alignSelf: "start",
                    padding: "4px 6px",
                    marginTop: "8px",
                  }}
                >
                  MY GROUPS
                </div>
                <div className={"item contactsItem"}>
                  <GroupList listType={"CHAT"} items={items} />
                </div>
              </>
            ) : (
              <>
                <div className={"item contactsItem"}>
                  <GroupList listType={"JOIN"} items={items} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchContact({onChange}: {onChange: (e: string) => void}) {
  return (
    <div className={"searchBarContainer shadow-box"}>
      <div>
        <RiSearchLine color={"#398378"} size={20} />
      </div>
      <div>
        <input
          className={"inputEle"}
          onChange={e => {
            onChange(e.target.value);
          }}
          placeholder={"Search for groups"}
        />
      </div>
    </div>
  );
}

function CreateGroup() {
  const [showDialog, setDialogVisibility] = useState(false);

  const handleDialogOpen = () => {
    setDialogVisibility(true);
  };

  const handleDialogClose = () => {
    setDialogVisibility(false);
  };

  return (
    <div className="addGroupBtn">
      <Tooltip text={"Wanna help?"}>
        <FaHandHoldingHeart
          id="DialogOpenIcon"
          size={24}
          onClick={handleDialogOpen}
        />
      </Tooltip>
      <DialogPanel
        open={showDialog}
        header="Create your own Aidgroup"
        onClose={handleDialogClose}
        BodyEle={
          <GroupForm
            onSubmit={() => {
              handleDialogClose();
            }}
          />
        }
      />
    </div>
  );
}
