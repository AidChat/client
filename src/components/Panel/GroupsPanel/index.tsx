import React, {useContext, useEffect, useState} from 'react';
import groupsImg from './../../../assets/svg/groups.svg';
import GroupImage from './../../../assets/svg/groups.svg';
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import {AuthContext} from "../../../services/context/auth.context";
import {DialogPanel} from "../../Dialog";
import ImageUploader from 'react-images-upload';
import Snackbar from "../../utility/Snackbar";
import {Spinner} from "../../utility/spinner/spinner";

export function ChatGroups() {
    let groups: any[] = [];
    return (
        <div className={'group-item-container '}>
            <UserIcon/>
            {groups.map((_item, idx) =>
                <div className={'groupIcon-container-wrapper'} key={idx}>
                    <GroupIcon/>
                </div>
            )}
        </div>
    )
}

export function GroupIcon() {
    return (
        <div className={'item-wrapper'}>
            <img src={groupsImg} alt={'profile icon'}/>
        </div>
    )
}

export function UserIcon() {
    const [menu, showMenu] = useState<boolean>(false);
    const [user, setUser] = useState<{ id: string, email: string, name: string, profileImage: string } | null>(null);
    const {_setUserId} = useContext(ShellContext);
    const auth = useContext(AuthContext);
    const [showUserForm, setShowUserForm] = useState<boolean>(false);
    useEffect(() => {
        fetchProfile()
    }, []);

    function fetchProfile() {
        _props._user().get().then((result: any) => {
            let data: { id: string, email: string, name: string, profileImage: string } = result.data;
            setUser(data)
            window.localStorage.setItem('_user', JSON.stringify(data));
            _setUserId(data.id);
        })
    }

    const menuItems = [
        {name: 'Logout', id: 1},
        {name: 'Profile', id: 2}
    ]

    function handleClick(id: number) {
        switch (id) {
            case 1 :
                auth?.removeUserSession();
                break
            case 2:
                setShowUserForm(true);
                break
            default:
                break
        }
    }

    return (<>
            <DialogPanel open={showUserForm} header={"Profile"} BodyEle={<><ProfileForm onUpdate={() => {
                fetchProfile()
            }}/></>} onClose={() => {
                setShowUserForm(false)
            }} load={false}/>
            {user ? <div style={{position: 'relative', width: '100%'}} className={'userIcon'}>
                    <div onClick={() => {
                        showMenu(!menu)
                    }} style={{textAlign: 'center', width: '100%'}} className={'usernameWrapper'}>
                        <div style={{textAlign: 'center', height: 50, width: 50}} className={'item-wrapper'}>
                            <img src={user.profileImage ? user.profileImage : groupsImg} alt={'profile icon'}/>

                        </div>
                        <div className={'w100'}><h1 className={'font-primary username'}>{user?.name.toUpperCase()}</h1>
                        </div>
                    </div>

                    <div className={'customInput menu'}>
                        <CustomMenu items={menuItems} onClick={(id: number) => {
                            handleClick(id)
                        }}/>
                    </div>

                </div>
                : <></>
            }
        </>

    )
}

function ProfileForm({onUpdate}: { onUpdate: () => void }) {
    const [user, setUser] = useState<{ name: string, email: string, id: number | null, profileImage: string }>({
        name: '',
        email: '',
        profileImage: '',
        id: null
    });
    const [loading, _loading] = useState<boolean>(false);
    const [message, _message] = useState<string | null>(null)
    const [update, _update] = useState<{ name: boolean, profileImage: boolean }>({name: false, profileImage: false});
    useEffect(() => {
        _loading(true)
        _props._user().get().then((result: any) => {
            _loading(false)
            setUser(result.data);
        })
    }, []);

    function handleImageUpload(e: any) {

        const file = e[0];

        const reader = new FileReader();
        reader.onloadend = function () {
            if (reader && reader.result) {
                if (typeof reader.result === "string") {
                    const base64String = reader.result;
                    setUser({...user, profileImage: base64String});
                    _update({...update, profileImage: true})
                } // Extracting the Base64 data
                // Use base64String as needed (e.g., send it to the server, display it, etc.)
            }
        };

        reader.readAsDataURL(file); // Read the file as Data URL

    }

    function handleUpdate() {
        let data: { name?: string; profileImage?: string } = {...user}; // Create a new object based on `user`

        if (!update.profileImage) {
            delete data.profileImage;
        }
        if (!update.name) {
            delete data.name;
        }
        _loading(true)
        _props._db(service.authentication).query(serviceRoute.user, data, reqType.put)
            .then(result => {
                _loading(false)
                setUser(result.data);
                _message('Profile is updated')
                onUpdate();
            })
            .catch(() => {
                _loading(!loading)
            })
    }

    return (
        <div className={'profile-Wrapper'}>
            {message && <Snackbar message={message} onClose={() => {
                _message(null)
            }}/>}
            <div className={'row1 row'}>
                <div>
                    <div className={'profileImageContainer'}>
                        <img style={{height: '100%', width: '100%', borderRadius: '50%'}}
                             src={user.profileImage.split('').length > 0 ? user.profileImage : GroupImage}
                             alt={'Profile image'}/>
                    </div>

                </div>
                <div>
                    <ImageUploader
                        className={'imageUploader'}
                        withIcon={false}
                        singleImage={true}
                        buttonText='Update'
                        label={''}
                        onChange={(e) => {
                            handleImageUpload(e)
                        }}
                        imgExtension={['.jpeg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                </div>
            </div>
            <div style={{margin: '0 auto'}}>
                <div className={'row row-space'}>
                    <label>Name</label>
                    <input value={user.name} onChange={(e) => {
                        _update({...update, name: true});
                        setUser({...user, name: e.target.value})
                    }}/>
                </div>
                <div className={'row row-space'}>
                    <label>Email</label>
                    {user.email}</div>
            </div>
            <div className={'row row-space flex flex-center update-btn'}>
                {loading ?
                    <Spinner/> :
                    <div onClick={() => {
                        handleUpdate()
                    }} className={'btn btn-round-secondary btn-custom-profile'}> UPDATE
                    </div>
                }
            </div>
        </div>
    )
}


export function CustomMenu({items, onClick}: { items: { name: string, id: number }[], onClick: (S: number) => void }) {

    return (
        <div className={'customMenu-wrapper'}>
            {items.map((item, index) => (
                <div className={'menu-item'} onClick={() => {
                    onClick(item.id)
                }} key={index}>{item.name.toUpperCase()}</div>
            ))}
        </div>
    )
}