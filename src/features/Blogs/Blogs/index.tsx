import React, {ReactElement, useState} from "react";
import {IBlogShortContent} from "../../../utils/interface";
import './style.css'
import {formatDateToDDMMYYYY, formatTimeToHHMM} from "../../../utils/functions";
import {EArticleStatus} from "../../../utils/enum";
import {article} from "../../../assets/data";
import {Article} from "../../../utils/enum";
import {BlogEditor} from "../index";

export function BlogList() {
    const [selectedBlog, setSelectedBlogs] = useState<Article | null>(null);

    const items: IBlogShortContent[] = [
        {id: 1, content: article, created_at: new Date(), status: EArticleStatus.published},
        {id: 2, content: article, created_at: new Date(), status: EArticleStatus.draft},
        {id: 3, content: article, created_at: new Date(), status: EArticleStatus.reviewed},
        {id: 4, content: article, created_at: new Date(), status: EArticleStatus.pending},
        {id: 4, content: article, created_at: new Date(), status: EArticleStatus.pending},
        {id: 4, content: article, created_at: new Date(), status: EArticleStatus.pending},
    ];
    return (
        !selectedBlog ?
            (<div className="blog-list">
                {items.map((item: IBlogShortContent, index) => {
                    return <BlogCard key={index} onClick={()=>setSelectedBlogs(item)} article={item}/>
                })}
            </div>)
            : <BlogEditor Article={selectedBlog} back={() => setSelectedBlogs(null)}/>

    )
}


function BlogCard(props: { article: IBlogShortContent,onClick:(item:Article)=>void }) {
    const [state, _] = useState<IBlogShortContent>(props.article);

    function renderStatusString(string: EArticleStatus): ReactElement | undefined {
        switch (string) {
            case EArticleStatus.pending:
                return <div className={"status-string"} style={{color: ""}}>{EArticleStatus.pending}</div>
            case
            EArticleStatus.draft
            :
                return <div className={"status-string"} style={{color: "#9f9f10"}}>{EArticleStatus.draft}</div>
            case
            EArticleStatus.reviewed
            :
                return <div className={"status-string"} style={{color: ""}}>{EArticleStatus.reviewed}</div>
            case
            EArticleStatus.published
            :
                return <div className={"status-string"} style={{color: "#6bad06"}}>{EArticleStatus.published}</div>
            default:
                return <div>Pending</div>
        }

    }

    return <>
        <div className={'blog-card-container'} onClick={()=>props.onClick(props.article)}>
            <div className={'blog-status'}>{renderStatusString(state.status)}</div>
            <div className={'blog-content'}>{state.content}
                <div className={'blur-blog-content'}></div>
            </div>
            <div className={'blog-date'}>Written on {formatDateToDDMMYYYY(state.created_at)}</div>
        </div>
    </>
}