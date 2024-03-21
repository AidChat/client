import React, {useContext, useEffect, useState} from "react";
import GroupImage from "./../../../assets/png/defaultgroup.png";
import userImage from "./../../../assets/png/defaultuser.png";
import "./index.css";
import {_props} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import {AuthContext} from "../../../services/context/auth.context";
import {DialogPanel} from "../../Dialog";
import ImageUploader from "react-images-upload";
import Snackbar from "../../Utils/Snackbar";
import {Spinner} from "../../Utils/Spinner/spinner";
import {useWindowSize} from "../../../services/hooks/appHooks";
import {IoIosArrowForward} from "react-icons/io";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../utils/enum";
import {Menu} from "../../Utils/Menu";
import {MdVerified} from "react-icons/md";
import {useResponsizeClass} from "../../../utils/functions";
import {OTPForm} from "../../Auth/Code";

export function UtilityPanel() {
    const {
        _requestId, _setGroupType, _setGroupId, refetch, updateSidePanelState,
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
        if (isSmall) updateSidePanelState(function (previous: { Group: boolean; Util: boolean }) {
            return {
                ...previous, Util: !previous.Util,
            };
        });
    }

    return (<div className={"group-item-container "}>
        {isSmall && (<IoIosArrowForward onClick={() => close()} size="24" color="white"/>)}
        <UserIcon/>
        {requests.length > 0 && (<>
            <div
                className={"font-primary mygroup-label"}
                style={{fontWeight: "bolder", textAlign: "center"}}
            >
                INVITES
            </div>
            {requests.map((_item: any, idx: React.Key | null | undefined) => (<div
                className={"groupIcon-container-wrapper"}
                key={idx}
                onClick={() => {
                    handleGroupId(_item.groupId, _item.id);
                }}
            >
                <GroupIcon
                    url={_item?.group?.GroupDetail?.icon ? _item?.group?.GroupDetail?.icon : undefined}
                />
                <div
                    className={"font-primary truncate "}
                    style={{textAlign: "center"}}
                >
                    {_item?.group?.name}
                </div>
            </div>))}
        </>)}
    </div>);
}

export function GroupIcon({url}: { url?: string }) {
    return (<div className={"item-wrapper"}>
        <img src={url ? url : GroupImage} alt={"profile icon"}/>
    </div>);
}

export function UserIcon() {
    const [user, setUser] = useState<{
        id: string; email: string; name: string; profileImage: string;
    } | null>(null);
    const {_setUserId} = useContext(ShellContext);
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
                    id: string; email: string; name: string; profileImage: string;
                } = result.data;
                setUser(data);
                window.localStorage.setItem("_user", JSON.stringify(data));
                _setUserId(data.id);
            });
    }

    const menuItems: { name: string, id: number }[] = [{name: "Profile", id: 1}, {name: "Logout", id: 2}];

    function handleClick(id: number) {
        switch (id) {
            case 2:
                auth?.removeUserSession();
                break;
            case 1:
                setShowUserForm(true);
                break;
            default:
                break;
        }
    }

    return (<>
        <DialogPanel
            open={showUserForm}
            header={"Profile"}
            BodyEle={<>
                <ProfileForm
                    onUpdate={() => {
                        fetchProfile();
                    }}
                />
            </>}
            onClose={() => {
                setShowUserForm(false);
            }}
            load={false}
        />
        {user ? (<div
            style={{position: "relative", width: "100%", margin: "10px 0", display: 'flex', flexDirection: 'column'}}
            className={!small ? "userIcon" : " h100"}
        >
            <div
                onClick={() => {
                    small && handleClick(1);
                }}
                style={{textAlign: "center", width: "100%"}}
                className={"usernameWrapper"}
            >
                <div
                    style={{textAlign: "center", height: 50, width: 50}}
                    className={"item-wrapper"}

                >
                    <img
                        src={user.profileImage ? user.profileImage : userImage}
                        alt={"profile icon"}
                    />
                </div>
                <div className={"w100"}>
                    <h1 className={"font-primary username"}>
                        {user?.name.toUpperCase()}
                    </h1>
                </div>
            </div>

            <div className={"customInput menu"}>
                <Menu
                    items={menuItems}
                    onClick={(id: number) => {
                        handleClick(id);
                    }}
                />
            </div>
            {small && <div className={'btn btn-primary w100 lgt-btn'} onClick={() => {
                handleClick(2);
            }}>Logout</div>}
        </div>) : (<></>)}
    </>);
}

function ProfileForm({onUpdate}: { onUpdate: () => void }) {
    const [user, setUser] = useState<{
        name: string; email: string; id: number | null; profileImage: string; about: string; mobile?: string,
        verifiedEmail:boolean
    }>({
        name: "", email: "", profileImage: "", id: null, about: '', mobile: undefined,verifiedEmail:false
    });
    const [loading, _loading] = useState<boolean>(false);
    const [message, _message] = useState<string | null>(null);
    const [update, _update] = useState<{ name: boolean; profileImage: boolean }>({
        name: false, profileImage: false,
    });
    useEffect(() => {
        _loading(true);
        _props
            ._user()
            .get()
            .then((result: any) => {
                _loading(false);
                setUser(result.data);
            });
        return () => {
            _loading(false);
        }
    }, []);

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
        let data: { name?: string; profileImage?: string, about?: string, mobile?: string } = {...user};
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

    return (<div className={"profile-Wrapper"}>
        {message && (<Snackbar
            message={message}
            onClose={() => {
                _message(null);
            }}
        />)}
        <div className={"row1 row " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <div className={"dialogCoverImageContainer"}>
                <img
                    className={"profileCoverImage"}
                    src={user.profileImage.split("").length > 0 ? user.profileImage : GroupImage}
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

        <div className={"row row-space " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <label>Name</label>
            <input
                className={'custom-input borderRadius-light'}
                value={user.name}
                onChange={e => {
                    _update({...update, name: true});
                    setUser({...user, name: e.target.value});

                }}
                placeholder={'Your name'}
            />
        </div>
        <div className={"row row-space " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <label className={'dflex'}>Email {user.verifiedEmail ? <MdVerified/>:
            <span className={'font-secondary font-thick pointer'} style={{margin:'0 10px'}}>Verify</span>
            }</label>
            <input className={'custom-input borderRadius-light'} disabled={true} value={user.email}
                   placeholder={'Type you email'}/>
        </div>


        <div className={"row row-space " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <label>Mobile <MdVerified/></label>
            <input
                value={user.mobile}
                disabled={true}
                className={'custom-input borderRadius-light'}
                onChange={(e) => {
                    setUser({...user, mobile: e.target.value})
                }}
                type={'tel'}
            />
        </div>
        <div className={"row row-space " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <label>About me</label>
            <textarea
                className={'custom-input borderRadius-light h100'}
                onChange={(e) => {
                    setUser({...user, about: e.target.value})
                }}
                placeholder={'Write something about yourself.'}
            />
        </div>


        <div className={"row row-space flex flex-center update-btn " + useResponsizeClass(EwindowSizes.S, ['m0'])}>
            <div
                onClick={() => {
                    handleUpdate();
                }}
                className={"btn btn-round-secondary btn-custom-profile"}
            >
                {" "}
                {loading ? <Spinner/> : 'UPDATE'}
            </div>
        </div>
    </div>);
}


