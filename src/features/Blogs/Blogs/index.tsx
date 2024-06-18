import React, {ReactElement, useState} from "react";
import './style.css'
import {confirm, formatDateToDDMMYYYY} from "../../../utils/functions";
import {EArticleStatus} from "../../../utils/enum";
import {article} from "../../../assets/data";
import {Article} from "../../../utils/enum";
import {BlogEditor} from "../index";
import {MdDelete} from "react-icons/md";
import {AiFillEdit} from "react-icons/ai";
import {ConfirmDialog} from "primereact/confirmdialog";
import { motion } from "framer-motion";

export function BlogList() {
    const [selectedBlog, setSelectedBlogs] = useState<Article | null>(null);

    const items: Article[] = [
        {content: article, created_at: new Date(), status: EArticleStatus.published},
        {content: article, created_at: new Date(), status: EArticleStatus.draft},
        {content: article, created_at: new Date(), status: EArticleStatus.reviewed},
        {content: article, created_at: new Date(), status: EArticleStatus.pending},
        {content: article, created_at: new Date(), status: EArticleStatus.pending},
        {content: article, created_at: new Date(), status: EArticleStatus.pending},
    ];
    return (
        <div className={'h100 blog-component-container'}>
            <ConfirmDialog/>
            {!selectedBlog && <div className={'font-primary w100 blog-label'}> Your Blogs</div>}
            {!selectedBlog && <div className="blog-list">
                {items.map((item: Article, index:number) => {
                    return <BlogCard key={index} onClick={() => setSelectedBlogs(item)} article={item}/>
                })}
            </div>
            }
            {selectedBlog && <BlogEditor Article={selectedBlog} back={() => setSelectedBlogs(null)}/>}
        </div>
    )
}

/**
 * Not allowed to edit published blogs
 * @param props
 * @constructor
 */

function BlogCard(props: { article: Article, onClick: (item: Article) => void,key:number }) {
    const [state, _] = useState<Article>(props.article);

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
        <motion.div initial={{x:-10}}  animate={{x:0}}className={'blog-card-container'}>
            <div className={'blog-status'}>
                <div className={'dflex'}>
                    <div> {state.status !== EArticleStatus.published &&
                        <MdDelete className={'blog-card-icon'} color={'whitesmoke'} size={18}
                                  onClick={() => {
                                      confirm({
                                          message: 'Do you wanna delete this blog permanently?',
                                          header: 'Confirmation'
                                      }).then(function () {

                                      })
                                  }}/>
                    }
                    </div>
                    <div>
                        {state.status !== EArticleStatus.published &&
                            <AiFillEdit className={'blog-card-icon'} onClick={() => {
                                props.onClick(state)
                            }} color={'whitesmoke'} size={18}/>
                        }
                    </div>
                </div>
                <div>   {renderStatusString(state.status)}</div>
            </div>
            <div className={'blog-content'}>{state.content}
                <div className={'blur-blog-content'}></div>
            </div>
            <div className={'blog-date'}>Written on {formatDateToDDMMYYYY(state.created_at)}</div>
        </motion.div>
    </>
}