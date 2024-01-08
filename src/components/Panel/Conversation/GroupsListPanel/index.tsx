import React, {useContext, useEffect, useState} from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";
import {MdGroupAdd} from "react-icons/md";
import {GroupList, GroupListInterface} from "../GroupList";
import {DialogPanel} from "../../../Dialog";
import {GroupForm} from "../../GroupForm";
import {Logo} from "../../../utility/Logo";
import {Spinner} from "../../../utility/Spinner/spinner";
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {ShellContext} from "../../../../services/context/shell.context";
import {BsChatRightDots, BsFillChatQuoteFill} from "react-icons/bs";

export function Index() {
    const [loading, _loading] = useState<boolean>(false);
    const {refetch} = useContext(ShellContext);
    const [items, setItem] = useState<GroupListInterface[] | []>([])
    const [reqBlock, _blockRequest] = useState<boolean>(false);
    const [search, _search] = useState<string | null>(null);


    useEffect(() => {
        if (search) {
            if (reqBlock) {
                window.setTimeout(() => {
                    if (reqBlock) {
                        _blockRequest(false);
                    }
                }, 500)
            } else {
                fetchSearchResults()
                _blockRequest(true);
            }
        }else{
            _props._db(service.group).query(serviceRoute.group, undefined, reqType.get).then(response => {
                setItem(response.data)
            })
        }
    }, [search]);

    function fetchSearchResults() {
        _loading(true)
        _props._db(service.group).query(serviceRoute.search, {search}, reqType.post, undefined)
            .then(result => {
                _loading(false);
                setItem(result.data);
            })
    }

    useEffect(() => {
        _props._db(service.group).query(serviceRoute.group, undefined, reqType.get).then(response => {
            setItem(response.data)
        })

    }, [refetch]);
    return (<div className={'container'}>
        <div className={'item-container'}>
            <div className={' item searchItem'}>
                <Logo/>
                <SearchContact onChange={(e: string) => {
                    _search(e)
                }}/>
                <CreateGroup/>
            </div>
            {loading ? <Spinner/> : <>
                {!search ? <>
                    <div className={'font-primary mygroup-label '} style={{
                        fontWeight: 'bolder',
                        display: "flex",
                        alignSelf: 'start',
                        padding: '4px 6px',
                        marginTop: '8px'
                    }}>MY GROUPS
                    </div>
                    <div className={'item contactsItem'}><GroupList listType={'CHAT'} items={items}/></div>
                </> : <>
                    <div className={'item contactsItem'}><GroupList listType={'JOIN'} items={items}/></div>
                </>}
            </>
            }
        </div>
    </div>)
}

function SearchContact({onChange}: { onChange: (e: string) => void }) {
    return (<div className={'searchBarContainer shadow-box'}>
        <div><RiSearchLine color={'#398378'} size={20}/></div>
        <div>
            <input className={'inputEle'} onChange={(e) => {
                onChange(e.target.value)
            }} placeholder={'Search for groups'}/>
        </div>
    </div>)
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
            <BsFillChatQuoteFill id="DialogOpenIcon" size={24} onClick={handleDialogOpen}/>
            <DialogPanel
                open={showDialog}
                header="Add Group"
                onClose={handleDialogClose}
                BodyEle={<GroupForm onSubmit={() => {
                    handleDialogClose()
                }}/>}
            />
        </div>
    );
}
