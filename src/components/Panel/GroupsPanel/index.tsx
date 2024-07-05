import React, {useContext, useEffect, useState} from "react";
import GroupImage from "./../../../assets/png/defaultgroup.png";
import userImage from "./../../../assets/png/defaultuser.png";
import "./index.css";
import {_props} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import {AuthContext} from "../../../services/context/auth.context";
import ImageUploader from "react-images-upload";
import Snackbar from "../../Utils/Snackbar";
import {Spinner} from "../../Utils/Spinner/spinner";
import {useNetworkConnectivity, useWindowSize,} from "../../../services/hooks/appHooks";
import {IoIosArrowForward} from "react-icons/io";
import {EwindowSizes, reqType, service, serviceRoute,} from "../../../utils/enum";
import {Menu} from "../../Utils/Menu";
import {MdVerified} from "react-icons/md";
import {confirm, useResponsizeClass} from "../../../utils/functions";
import {Dialog} from "primereact/dialog";
import {menuItems} from "../../../utils/constants";

export function UtilityPanel() {
    const {
        _requestId,
        _setGroupType,
        _setGroupId,
        refetch,
        updateSidePanelState,
    } = useContext(ShellContext);
    const [requests, _requests] = useState<any>([]);

    useEffect(() => {
        _props
            ._db(service.group)
            .query(serviceRoute.userRequest, {}, reqType.get, undefined)
            .then(result => {
                _requests(result.data);
            });
    }, [refetch]);

    function handleGroupId(id: string, requestID: string) {
        _setGroupId(id);
        _requestId(requestID);
        _setGroupType("INVITE");
    }

    const {size: isSmall} = useWindowSize(EwindowSizes.S);

    function close() {
        if (isSmall)
            updateSidePanelState(function (previous: {
                Group: boolean;
                Util: boolean;
            }) {
                return {
                    ...previous,
                    Util: !previous.Util,
                };
            });
    }

    return (
        <div className={"group-item-container "}>
            {isSmall && (
                <IoIosArrowForward onClick={() => close()} size="24" color="white"/>
            )}
            <UserIcon full={isSmall}/>
            {requests.length > 0 && (
                <>
                    <div
                        className={"font-primary mygroup-label w100"}
                        style={{fontWeight: "bolder", textAlign: "center"}}
                    >
                        INVITES
                    </div>
                    {requests.map((_item: any, idx: React.Key | null | undefined) => (
                        <div
                            className={"groupIcon-container-wrapper"}
                            key={idx}
                            onClick={() => {
                                handleGroupId(_item.groupId, _item.id);
                            }}
                        >
                            <GroupIcon
                                url={
                                    _item?.group?.GroupDetail?.icon
                                        ? _item?.group?.GroupDetail?.icon
                                        : undefined
                                }
                            />
                            <div
                                className={"font-primary truncate"}
                                style={{textAlign: "center"}}
                            >
                                {_item?.group?.name}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export function GroupIcon({url}: { url?: string }) {
    return (
        <div className={"item-wrapper"}>
            <img src={url ? url : GroupImage} alt={"profile icon"}/>
        </div>
    );
}

export function UserIcon(props: { full: boolean }) {
    const [user, setUser] = useState<{
        id: string;
        email: string;
        name: string;
        profileImage: string;
        Username: string
    } | null>(null);
    const [isClient, setClient] = useState<boolean>(false);
    const sc = useContext(ShellContext);
    const auth = useContext(AuthContext);
    const [showUserForm, setShowUserForm] = useState<boolean>(false);
    const {size: small} = useWindowSize(EwindowSizes.S);
    useEffect(() => {
        fetchProfile();
    }, []);

    function fetchProfile() {
        _props
            ._user()
            .get()
            .then((result: any) => {
                let data: {
                    id: string;
                    email: string;
                    name: string;
                    profileImage: string;
                    Username: string
                } = result;
                setUser(data);
                window.localStorage.setItem("_user", JSON.stringify(data));
                sc._setUserId && sc._setUserId(data.id);
                if (result.Type === 'Seeker') {
                    setClient(true);
                }
            });
    }


    function handleClick(id: number) {
        switch (id) {
            case 2:
                auth?.removeUserSession();
                break;
            case 1:
                setShowUserForm(true);
                break;
            case 3:
                auth?.toggleBlogComponent();
                break;
            default:
                break;
        }
    }

    const {isOnline} = useNetworkConnectivity();

    function renderStyle(): {} {
        if (isClient) {
            return {
                position: 'absolute',
                top: 0,
                right: 0,
            }
        } else {
            return {
                position: "relative",
                width: "100%",
                margin: "10px 0",
                display: "flex",
                flexDirection: "column",
            }
        }
    }

    debugger
    return (
        <>
            <Dialog
                breakpoints={{"960px": "75vw", "641px": "100vw"}}
                visible={showUserForm}
                header={"Profile"}
                style={{width: "30vw"}}
                onHide={() => {
                    if (!showUserForm) return;
                    setShowUserForm(false);
                }}
                draggable={false}
                keepInViewport={true}

                maximized={props.full}
                blockScroll={true}
            >
                <>
                    <ProfileForm

                        onUpdate={() => {
                            fetchProfile();
                        }}
                    />
                </>
            </Dialog>
            {user && <>
                <div
                    style={renderStyle()}
                    className={!small ? "userIcon" : " "}
                >
                    <div
                        onClick={() => {
                            small && handleClick(1);
                        }}
                        style={{
                            textAlign: "center",
                            width: "100%",
                            borderColor: isOnline ? "green" : "whitesmoke",
                        }}
                        className={"usernameWrapper"}
                    >
                        <div
                            style={{textAlign: "center", height: 60, width: 60}}
                            className={"item-wrapper"}
                        >
                            <img
                                src={user.profileImage ? user.profileImage : userImage}
                                alt={"profile icon"}
                            />
                        </div>
                        <div className={"w100"}>
                            <h1
                                className={"font-primary username ellipsis"}
                                style={{width: "100%"}}
                            >
                                {!props.full && user?.Username.toUpperCase()}
                            </h1>
                        </div>
                    </div>

                    <div className={"customInput menu"}>
                        <Menu
                            items={menuItems.filter((i) => isClient ? i.name !== 'Blog' : true)}
                            onClick={(id: number) => {
                                handleClick(id);
                            }}
                        />
                    </div>
                </div>
                {small && !isClient && (
                    <div
                        style={{marginBottom: "10px"}}
                        className={"btn btn-primary w100 "}
                        onClick={() => {
                            handleClick(3);
                        }}
                    >
                        Blogs
                    </div>
                )}
                {small && !isClient && (
                    <div
                        className={"btn btn-primary w100"}
                        onClick={() => {
                            handleClick(2);
                        }}
                    >
                        Logout
                    </div>
                )}
            </>
            }
        </>
    );
}

function ProfileForm({onUpdate}: { onUpdate: () => void }) {
    const [user, setUser] = useState<{
        name: string;
        email: string;
        id: number | null;
        profileImage: string;
        about: string;
        mobile?: string;
        verifiedEmail: boolean;
        Username: string;
    }>({
        name: "",
        email: "",
        profileImage: "",
        id: null,
        about: "",
        mobile: undefined,
        verifiedEmail: false,
        Username: "",
    });
    const [loading, _loading] = useState<boolean>(false);
    const [message, _message] = useState<string | null>(null);
    const [update, _update] = useState<{ name: boolean; profileImage: boolean }>({
        name: false,
        profileImage: false,
    });
    const [showOtpContainer, setOtpContainerState] = useState(false);
    const ac = useContext(AuthContext);
    useEffect(() => {
        fetchUser();
    }, []);

    function fetchUser() {
        _loading(true);
        _props
            ._user()
            .get()
            .then((result: any) => {
                _loading(false);
                setUser(result);
                setOtpContainerState(false);
            });
        return () => {
            _loading(false);
        };
    }

    function handleImageUpload(e: any) {
        const file = e[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            if (reader && reader.result) {
                if (typeof reader.result === "string") {
                    const base64String = reader.result;
                    setUser({...user, profileImage: base64String});
                    _update({...update, profileImage: true});
                }
            }
        };
        reader.readAsDataURL(file);
    }

    function handleUpdate() {
        let data: {
            name?: string;
            profileImage?: string;
            about?: string;
            mobile?: string;
        } = {...user};
        if (!update.profileImage) {
            delete data.profileImage;
        }
        if (!update.name) {
            delete data.name;
        }
        _loading(true);
        _props
            ._db(service.authentication)
            .query(serviceRoute.user, data, reqType.put)
            .then(result => {
                _loading(false);
                setUser(result.data);
                _message("Profile is updated");
                onUpdate();
            })
            .catch(() => {
                _loading(!loading);
            });
    }

    async function verifyEmailAddress(value: string) {
        try {
            let response = await _props
                ._db(service.authentication)
                .query(
                    serviceRoute.verifyCode,
                    {email: user.email, code: value},
                    reqType.post,
                    undefined
                );
            fetchUser();
            setOtpContainerState(false);
            _message("Email verified you can not start creating aidgroups.");
        } catch (e) {
            _message("Please try again later");
        }
    }

    async function sendVerificationCode() {
        try {
            let reponse = _props
                ._db(service.authentication)
                .query(
                    serviceRoute.generateCode,
                    {email: user.email},
                    reqType.put,
                    undefined
                );
            setOtpContainerState(true);
            _message("Verification code sent");
        } catch (error) {
            _message("Please try agian after some time.");
        }
    }
    async function handleLogOut(){
         const response = await   confirm({message:"Are you sure you want to logout?"});
         if (response) ac?.removeUserSession()
    }
    return (
        <div className={"profile-Wrapper"}>
            {message && (
                <Snackbar
                    message={message}
                    onClose={() => {
                        _message(null);
                    }}
                />
            )}
            <div className={"row1 row " + useResponsizeClass(EwindowSizes.S, [""])}>
                <div className={"dialogCoverImageContainer"}>
                    <img
                        className={"profileCoverImage"}
                        src={
                            user.profileImage.split("").length > 0
                                ? user.profileImage
                                : GroupImage
                        }
                        alt={"Profile image"}
                    />
                </div>
                <div>
                    <ImageUploader
                        className={"imageUploader"}
                        withIcon={false}
                        singleImage={true}
                        buttonText="Update"
                        label={""}
                        onChange={e => {
                            handleImageUpload(e);
                        }}
                        imgExtension={[".jpeg", ".gif", ".png", ".gif", ".jpg"]}
                        maxFileSize={5242880}
                    />
                </div>
            </div>

            <div
                className={
                    "row row-space " + useResponsizeClass(EwindowSizes.S, [""])
                }
            >
                <label>Username</label>
                <input
                    className={"custom-input borderRadius-light"}
                    value={user.Username}
                />
                <label>Name</label>
                <input
                    className={"custom-input borderRadius-light"}
                    value={user.name}
                    onChange={e => {
                        _update({...update, name: true});
                        setUser({...user, name: e.target.value});
                    }}
                    placeholder={"Your name"}
                />
            </div>
            <div
                className={
                    "row row-space " + useResponsizeClass(EwindowSizes.S, [""])
                }
            >
                <label className={"dflex"} style={{alignItems: "center"}}>
                    Email{" "}
                    {user.verifiedEmail ? (
                        <MdVerified style={{margin: "0 5px"}} color={"lightblue"}/>
                    ) : (
                        <span
                            className={"font-secondary font-thick pointer"}
                            style={{margin: "0 10px"}}
                            onClick={sendVerificationCode}
                        >
              Verify
            </span>
                    )}
                </label>
                <input
                    className={"custom-input borderRadius-light"}
                    disabled={true}
                    value={user.email}
                    placeholder={"Type you email"}
                />
            </div>
            {showOtpContainer && (
                <input
                    type="number"
                    placeholder="Enter your verification code here"
                    onChange={e => {
                        if (e.target.value.split("").length === 4) {
                            verifyEmailAddress(e.target.value);
                        }
                    }}
                />
            )}
            <div
                className={
                    "row row-space " + useResponsizeClass(EwindowSizes.S, [""])
                }
            >
                <label>
                    Mobile <MdVerified style={{margin: "0 5px"}}/>
                </label>
                <input
                    value={user.mobile}
                    disabled={false}
                    className={"custom-input borderRadius-light"}
                    onChange={e => {
                        setUser({...user, mobile: e.target.value});
                    }}
                    type={"tel"}
                />
            </div>
            <div
                className={
                    "row row-space " + useResponsizeClass(EwindowSizes.S, [""])
                }
            >
                <label>About me</label>
                <textarea
                    className={"custom-input borderRadius-light h100"}
                    onChange={e => {
                        setUser({...user, about: e.target.value});
                    }}
                    value={user.about}
                    placeholder={"Write something about yourself."}
                />
            </div>

            <div
                className={
                    "row row-space flex flex-center update-btn  " +
                    useResponsizeClass(EwindowSizes.S, [" dflex row "])
                }
            >
                <div
                    onClick={() => {
                       handleLogOut();
                    }}
                    className={"btn btn-round-secondary"}
                >
                    {" "}
                    {loading ? <Spinner/> : "Logout"}
                </div>
                <div
                    onClick={() => {
                        handleUpdate();
                    }}
                    className={" btn btn-round-primary"}
                >
                    {" "}
                    {loading ? <Spinner/> : "Update"}
                </div>

            </div>
        </div>
    );
}
