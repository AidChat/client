import React, {useEffect, useState} from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {QuillFormats, QuillModules} from "../../../utils/constants";
import './index.css';
import {getString} from "../../../utils/strings";
import {queryStoreObjects, confirm, storeCurrentContent, useResponsizeClass} from "../../../utils/functions";
import {EwindowSizes, IDBStore} from "../../../utils/enum";
import {IoCloudUploadOutline} from "react-icons/io5";
import {MdOutlineArrowBackIos, MdOutlinePublish} from "react-icons/md";
import Snackbar from "../../../components/Utils/Snackbar";

interface ComponentProps {
    back?: () => void
}

export default function Editor(props: ComponentProps) {
    const [content, setContent] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>('');

    async function checkAndStoreContent() {
        if (content && content.split('').length > 30) {
            let response = await confirm({message: "Are you sure you want to send this article for a review?"});
            if (response) setMessage("Your article is under review now.")
        } else {
            setMessage("Not enough content.");
        }
    }

    useEffect(() => {
        queryStoreObjects(IDBStore.blog).then(function (data: any) {
            let currentContent = data.length && data[data.length - 1].content;
            setContent(currentContent);
        });
        let timeOutVar = window.setInterval(function () {
            if (content && content.split('').length > 30) {
                setSaving(true);
                storeCurrentContent(IDBStore.blog, content).then(function () {
                    window.setTimeout(function () {
                        setSaving(false);
                    }, 10000)
                })
            }
        }, 5000)
        return () => {
            window.clearInterval(timeOutVar)
        }
    }, []);
    return (
        <div className="typeWriter">
            <Snackbar message={message} onClose={() => setMessage('')}/>
            <div className={'header-container' + useResponsizeClass(EwindowSizes.S, [' '])}>

                <div
                    className={'font-secondary font-thick  typeWriter-header ' + useResponsizeClass(EwindowSizes.S, [' w100 flex-start'])}>
                    {!props.back && <MdOutlineArrowBackIos
                        onClick={function () {
                            props.back && props.back();
                        }}
                        size={18} style={{margin: '0 10px', cursor: 'pointer'}}/>
                    }
                    Contribute your expertise
                </div>
                <div className={'dflex justify-between center'}>
                    {saving && <div className={'m4 syncContainer'}>
                        <IoCloudUploadOutline color={'lightgray'}/>
                        <div className={'font-primary'} style={{fontSize: '12px'}}>Sync....</div>
                    </div>
                    }
                    <div className={'btn btn-round-secondary'} onClick={() => checkAndStoreContent()}>
                        <MdOutlinePublish/>
                    </div>
                </div>
            </div>
            <div className={'editor-container'}>
                <ReactQuill theme="snow" className={"editor"}
                            modules={QuillModules} formats={QuillFormats}
                            value={content} onChange={(e: any) => {
                    setContent(e)
                }}/>
            </div>
            <div className={'font-primary note-container' + useResponsizeClass(EwindowSizes.S, [' height10'])}>
                Blogs are inspected by &nbsp; <u>{getString(24)}</u> &nbsp; before getting published any content that
                seems
                inappropriate would be flagged and proper action would be taken.
            </div>
        </div>
    )
}