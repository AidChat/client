import React, {useEffect, useState} from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {QuillFormats, QuillModules} from "../../../utils/constants";
import './index.css';
import {getString} from "../../../utils/strings";
import {confirm, queryStoreObjects, storeCurrentContent, useResponsizeClass} from "../../../utils/functions";
import {Article, EwindowSizes, IDBStore, reqType, service, serviceRoute} from "../../../utils/enum";
import {IoCloudUploadOutline} from "react-icons/io5";
import {MdOutlineArrowBackIos, MdOutlinePublish} from "react-icons/md";
import Snackbar from "../../../components/Utils/Snackbar";
import {_props} from "../../../services/network/network";

interface ComponentProps {
    back?: () => void
    Article: Article
}

export default function BlogEditor(props: ComponentProps) {
    const [article, setArticle] = useState<Article>(props.Article);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>('');

    async function checkAndStoreContent() {
        if (article && article.content.split('').length > 30) {
            let response = await confirm({message: "Are you sure you want to send this article for a review?"});
            if (response) storeArticle();
        } else {
            setMessage("Not enough content.");
        }
    }


    async function storeArticle() {
        let response = await _props._db(service.group).query(serviceRoute.article, {article}, article.id ? reqType.put : reqType.post, 1)
        if (response) setMessage(response.message);
    }

    async function getArticleById(id: number) {
        const article = await _props._db(service.group).query(serviceRoute.article, {}, reqType.get, id)
        setArticle(article.data);
    }

    useEffect(() => {
        if (article.id) {
            getArticleById(article.id)
        } else {
            queryStoreObjects(IDBStore.blog).then(function (data: any) {
                let currentContent = data.length && data[data.length - 1].content;
                setArticle({...article, content: currentContent});
            });
            var timeOutVar = window.setInterval(function () {
                if (article && article.content.split('').length > 30) {
                    setSaving(true);
                    storeCurrentContent(IDBStore.blog, article.content).then(function () {
                        setSaving(false);
                    })
                }
            }, 5000)
        }
        return () => {
            window.clearInterval(timeOutVar)
        }
    }, []);
    console.log(props.Article);
    return (
        <div className="typeWriter">
            <Snackbar message={message} onClose={() => setMessage('')}/>
            <div className={'header-container' + useResponsizeClass(EwindowSizes.S, [' '])}>

                <div
                    className={'font-secondary font-thick  typeWriter-header ' + useResponsizeClass(EwindowSizes.S, [' w100 flex-start'])}>
                    {props.back && <MdOutlineArrowBackIos
                        onClick={function () {
                            props.back && props.back();
                        }}
                        size={18} style={{margin: '0 10px', cursor: 'pointer'}}/>
                    }
                    Share your thoughts
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
                            value={article.content} onChange={(e: any) => {
                    setArticle({...article, content: e});
                }}/>
            </div>
            <div className={'font-primary note-container  ' + useResponsizeClass(EwindowSizes.S, [' height10'])}>
                Blogs are inspected by &nbsp; <><>{getString(24)}</>
            </>
                &nbsp; before getting published any content that
                seems
                inappropriate would be flagged and proper action would be taken.
            </div>
        </div>
    )
}