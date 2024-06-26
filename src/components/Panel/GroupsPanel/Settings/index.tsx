import React, {useContext, useEffect, useState} from "react";
import {Spinner} from "../../../Utils/Spinner/spinner";
import "./index.css";
import {_props,} from "../../../../services/network/network";
import Snackbar from "../../../Utils/Snackbar";
import ImageUploader from "react-images-upload";
import groupIcon from "./../../../../assets/png/defaultgroup.png";
import {CiCircleRemove} from "react-icons/ci";
import {groupTokensArray} from "../../../../assets/data";
import {ShellContext} from "../../../../services/context/shell.context";
import {Role} from "../../../../utils/interface";
import {reqType, service, serviceRoute} from "../../../../utils/enum";
import {AnimatePresence, motion} from "framer-motion";
import {confirm} from "../../../../utils/functions";

export function Settings(props: { groupId: number }) {
    const [data, setData] = useState<GroupDetailsInt | null>(null);
    const {refetch, groupId} = useContext(ShellContext);

    useEffect(() => {
        getGroup();
    }, [refetch, groupId]);

    function getGroup() {
        _props
            ._db(service.group)
            .query(serviceRoute.groupById, null, reqType.get, props.groupId)
            .then(result => {
                setData(result.data);
            });
    }

    return (<motion.div initial={{x: 10}} animate={{x: 0}} className={"members-container"}>
        {data ? (<div className={"font-primary"}>
            <GroupSettingContainer
                groupDetails={data}
                refresh={() => {
                    getGroup();
                }}
            />
        </div>) : (<Spinner/>)}
    </motion.div>);
}

function GroupSettingContainer(props: {
    groupDetails: GroupDetailsInt; refresh: () => void;
}) {
    const [role, _updateOwnership] = useState<string>("");
    const [state, setState] = useState<{
        name: string; description: string; id: number; icon?: string; tags: string[];
    }>({
        name: props.groupDetails.name,
        description: props.groupDetails.GroupDetail.description,
        id: props.groupDetails.id,
        icon: props.groupDetails.GroupDetail.icon,
        tags: props.groupDetails.GroupDetail.tags,
    });
    const [tags, _tags] = useState<{ name: string }[]>(groupTokensArray);
    const [update, _update] = useState<{ icon: boolean }>({icon: false});
    const [message, _message] = useState<string | null>(null);
    const [loading, _loading] = useState<boolean>(false);
    const [searchTerm, updateSearch] = useState<string>("");
    const {refetch, _setGroupId, _setRefetch, _setGroupType} = useContext(ShellContext);
    useEffect(() => {
        _props
            ._db(service.group)
            .query(serviceRoute.groupRole, {}, reqType.get, props.groupDetails.id)
            .then((result: { data: Role }) => {
                _updateOwnership(result.data.type);
            });
    }, [props]);

    function handleUpdate(e: any) {
        setState({...state, [e.target.name]: e.target.value});
    }

    function handleGroupUpdate() {
        _loading(true);
        const data = {...state};
        if (!update.icon) {
            delete data.icon;
        }
        _props
            ._db(service.group)
            .query(serviceRoute.groupById, data, reqType.put, props.groupDetails.id)
            .then(result => {
                _loading(false);
                _message("Group updated successfully");
                _setRefetch(!refetch);
            })
            .catch(error => {
                _message("Failed to update group");
            });
    }

    function handleImageUpload(e: any) {
        const file = e[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            if (reader && reader.result) {
                if (typeof reader.result === "string") {
                    const base64String = reader.result;
                    setState({...state, icon: base64String});
                    _update({icon: true});
                }
            }
        };
        reader.readAsDataURL(file);
    }

    function renderTags() {
        let tagsGroups = [...groupTokensArray];
        let data = {...state};
        data.tags.forEach(t => {
            tagsGroups.map(item => {
                if (item.name === t) {
                    tagsGroups = tagsGroups.filter(item => item.name != t);
                }
            });
        });
        _tags(tagsGroups);
    }

    function handleGroupTagsRemove(s: string) {
        if (state.tags.length === 1) {
            _message("At-least one tag per group is mandatory");
            return;
        }
        let data = {...state};
        data.tags = state.tags.filter(item => item !== s);
        setState({...state, tags: data.tags});
        renderTags();
    }

    function handleTokenAdd(s: string) {
        let data = {...state};
        data.tags.push(s);
        setState({...state, tags: data.tags});
        renderTags();
        updateSearch('');
    }

    function filterTags(e: any) {
        updateSearch(e.target.value);
        let data = [...groupTokensArray];
        let filteredData = data.filter(item => item.name.toUpperCase().includes(searchTerm.toUpperCase()));
        _tags(filteredData);

    }

    function handleGroupDeleteRequest() {
        if (props.groupDetails.Request.length > 0) {
            _props
                ._db(service.group)
                .query(serviceRoute.groupInvite, {}, reqType.delete, props.groupDetails.Request[0].id)
                .then(response => {
                    _message(response.message);
                    props.refresh();
                });
        } else {
            _props
                ._db(service.group)
                .query(serviceRoute.groupById, {}, reqType.post, props.groupDetails.id)
                .then(response => {
                    _message(response.message);
                    props.refresh();
                });
        }
    }

    function handleGroupLeave() {
        _loading(true);
        _props
            ._db(service.group)
            .query(serviceRoute.removeUserFromGroup, {}, reqType.put, props.groupDetails.id)
            .then(() => {
                _message("You have successfully left the group!");
                _loading(false);
                _setRefetch(!refetch);
                _setGroupType(null);
                _setGroupId(null);
            });
    }

    return (<>
        {message && (<Snackbar
            message={message}
            onClose={() => {
                _message(null);
            }}
        />)}
        {loading && <Spinner/>}
        <div className={"groupContainer"}>
            <div className={"settings-item-container profileContainer"}>
                <div className={"groupIconWrapper"}>
                    <img
                        style={{height: "100%", width: "100%"}}
                        src={state.icon ? state.icon : groupIcon}
                        alt={"group icon"}
                    />
                </div>
                {role === "OWNER" && (<ImageUploader
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
                />)}
            </div>
            <div className={"settings-item-container nameContainer"}>
                <div className={"center w25"}>Name</div>
                <input
                    className={`settingInput w50 borderNone `}
                    onChange={handleUpdate}
                    name={"name"}
                    value={state.name}
                    disabled={role !== "OWNER"}
                />
            </div>
            <div className={"settings-item-container descContainer"}>
                <div className={"center w25"}>Description</div>
                <textarea
                    className={`settingInput w100 ${role !== "OWNER" && "borderNone"} `}
                    onChange={handleUpdate}
                    name={"description"}
                    disabled={role !== "OWNER"}
                    value={state.description}
                />
            </div>
            <div className={"settings-item-container tagContainer"}>
                <div className={"center w25"}>Group Tags</div>
                <div className={"tagWrapper"}>
                    {state.tags.map((tag: string) => {
                        return (<AnimatePresence>
                            <motion.div initial={{x: '-10px'}} animate={{x: '0px'}} exit={{x: '-10px'}}
                                        className={"tag"}>
                                {tag}
                                {role === "OWNER" && (<CiCircleRemove
                                    onClick={() => {
                                        handleGroupTagsRemove(tag);
                                    }}
                                    style={{marginLeft: "4px", cursor: "pointer"}}
                                />)}
                            </motion.div>
                        </AnimatePresence>);
                    })}
                    {role === "OWNER" && (<div>
                        <div style={{position: "relative"}}>
                            <input
                                className={"tag-input"}
                                value={searchTerm}
                                onChange={e => {
                                    filterTags(e);
                                }}
                                placeholder={"Add more tags"}
                                type={"text"}
                            />
                            <div className={"tag-items"}>
                                {tags.map((token, index) => {
                                    return (<div
                                        className={"token"}
                                        onClick={() => {
                                            handleTokenAdd(token.name);
                                        }}
                                    >
                                        {token.name}
                                    </div>);
                                })}
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
            {role === "OWNER" && (<>
                <div className={"settings-item-container dangerContainer"}>
                    <div>
                        <div
                            className={"btn btn-primary btn-update m4"}
                            onClick={handleGroupUpdate}
                        >
                            {" "}
                            Update
                        </div>
                    </div>
                    <div>
                        <div
                            className={"btn btn-primary btn-custom m4"}
                            onClick={() => {
                                confirm({message:'Do you want to continue?'}).then(function(response) {
                                    handleGroupDeleteRequest();
                                })
                            }}
                        >
                            {props.groupDetails.Request.length > 0 ? "Undo" : "Delete"}
                        </div>
                    </div>
                </div>
            </>)}
            {(role === "MEMBER" || role === "ADMIN") && (<>
                <div className={"settings-item-container dangerContainer"}>
                    <div>
                        <div
                            className={"btn btn-primary btn-update"}
                            onClick={()=>{
                            confirm({message:"Do you want to continue?",header:'Confirmation'}).then(function(response){
                                if(response)   handleGroupLeave()
                            })
                             }}
                        >
                            {" "}
                            Leave Group
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    </>);
}

interface GroupDetailsInt {
    id: number;
    name: string;
    socketId: number;
    updated_at: Date;
    userId: string[];
    GroupDetail: {
        id: number; description: string; tags: string[]; icon: string;
    };
    Role: {
        id: number; type: "MEMBER" | "OWNER" | "ADMIN";
    }[];
    Request: {
        id: string;
    }[];
}
