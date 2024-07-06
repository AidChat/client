import React, {useContext, useEffect, useRef, useState} from "react";
import "./index.css";
import {RiSearchLine} from "react-icons/ri";
import {GroupList, GroupListInterface} from "../GroupList";
import {GroupForm} from "../../GroupsPanel/GroupForm";
import {Logo} from "../../../Utils/Logo";
import {Spinner} from "../../../Utils/Spinner/spinner";
import {_props} from "../../../../services/network/network";
import {ShellContext} from "../../../../services/context/shell.context";
import {FaHandHoldingHeart} from "react-icons/fa6";
import Tooltip from "../../../Utils/Tooltip";
import {IoIosArrowBack} from "react-icons/io";
import {useWindowSize} from "../../../../services/hooks/appHooks";
import {EwindowSizes, reqType, service, serviceRoute,} from "../../../../utils/enum";
import {Dialog} from "primereact/dialog";

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
        if (isSmall)
            updateSidePanelState(function (previous: {
                Group: boolean;
                Util: boolean;
            }) {
                return {
                    ...previous,
                    Group: !previous.Group,
                    Util: false,
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
                setItem(result?.data);
            });
    }

    useEffect(() => {
        _props
            ._db(service.group)
            .query(serviceRoute.group, undefined, reqType.get)
            .then(response => {
                setItem(response?.data);
            });
    }, [refetch]);

    return (
        <div className={"w100 h100"}>
            <div className={"item-container"}>
                <div className={" item searchItem"}>
                    <Logo/>
                    {/*<LogoCanvas />*/}
                    <SearchContact
                        onChange={(e: string) => {
                            _search(e);
                        }}
                    />
                    <CreateGroup/>
                </div>
                {loading ? (
                    <Spinner/>
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
                                <GroupList listType={!search ? "CHAT" : "JOIN"} items={items}/>
                            </div>
                        </>
                    </>
                )}
            </div>
        </div>
    );
}

function SearchContact({onChange}: { onChange: (e: string) => void }) {
    let inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        };
    }, []);

    return (
        <div className={"searchBarContainer shadow-box"}>
            <div>
                <RiSearchLine color={"#398378"} size={20}/>
            </div>
            <div>
                <input
                    ref={inputRef}
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
            <Dialog
                breakpoints={{'960px': '75vw', '641px': '100vw'}}
                visible={showDialog}
                header={"Profile"}
                style={{width: '30vw'}} onHide={() => {
                handleDialogClose();
            }}>
                <>
                    <GroupForm
                        onSubmit={() => {
                            handleDialogClose();
                        }}
                    />
                </>
                </Dialog>
        </div>
);
}
