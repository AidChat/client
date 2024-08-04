import React, {ReactElement, useContext, useEffect, useState} from "react";
import "./style.css";
import {
  clearDatabaseByName,
  confirm,
  formatDateToDDMMYYYY,
} from "../../../utils/functions";
import {
  Article,
  EArticleStatus,
  IDBStore,
  reqType,
  service,
  serviceRoute,
} from "../../../utils/enum";
import {BlogEditor} from "../index";
import {MdDelete} from "react-icons/md";
import {AiFillEdit} from "react-icons/ai";
import {ConfirmDialog} from "primereact/confirmdialog";
import {motion} from "framer-motion";
import {IoChevronBack} from "react-icons/io5";
import {AppContext} from "../../../services/context/app.context";
import {_props} from "../../../services/network/network";
import Snackbar from "../../../components/Utils/Snackbar";
import {FaPenFancy} from "react-icons/fa";
import Tooltip from "../../../components/Utils/Tooltip";

export function BlogList() {
  const [selectedBlog, setSelectedBlogs] = useState<Article | null>(null);
  const ac = useContext(AppContext);
  const [items, setItems] = useState<Article[]>([]);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    setMessage("Looking for blogs.....");
    handleFetchArticles();
  }, []);

  function handleFetchArticles() {
    _props
      ._db(service.group)
      .query(serviceRoute.articles, {}, reqType.get, undefined)
      .then(({data}) => {
        setItems(data);
        setMessage("");
      });
  }

  function handleArticleDelete(id: number | undefined) {
    if (!id) {
      clearDatabaseByName(IDBStore.blog).then(function (data: any) {
        setMessage("Article has been moved to trash");
        handleFetchArticles();
      });
    } else {
      _props
        ._db(service.group)
        .query(serviceRoute.article, {}, reqType.delete, id)
        .then(function (data) {
          setMessage(data.message);
          handleFetchArticles();
        });
    }
  }

  return (
    <div className={"h100 "} style={{overflowY: "scroll"}}>
      <Snackbar message={message} onClose={() => setMessage("")} />
      <ConfirmDialog />
      {!selectedBlog && (
        <div className="flex blog-listheader">
          <div className={"font-primary w100 blog-label"}>
            <IoChevronBack
              onClick={() => ac?.toggleBlogComponent()}
              className={"pointer"}
            />{" "}
            &nbsp; Blogs
          </div>
          <div
            className={"btn btn-primary w10 m8 "}
            onClick={function () {
              setSelectedBlogs({
                content: "<p>Write something here.</p>",
                status: EArticleStatus.draft,
                created_at: new Date(),
              });
            }}
          >
            <FaPenFancy style={{margin: "0 10px"}} />
            Write
          </div>
        </div>
      )}
      {!selectedBlog && (
        <div className="blog-list">
          {items.map((item: Article, index: number) => {
            return (
              <BlogCard
                onDelete={id => handleArticleDelete(id)}
                key={index}
                onClick={() => setSelectedBlogs(item)}
                article={item}
              />
            );
          })}
        </div>
      )}
      {selectedBlog && (
        <BlogEditor
          Article={selectedBlog}
          back={() => setSelectedBlogs(null)}
        />
      )}
    </div>
  );
}

/**
 * Not allowed to edit published blogs
 * @param props
 * @constructor
 */

function BlogCard(props: {
  article: Article;
  onClick: (item: Article) => void;
  key: number;
  onDelete: (id: number | undefined) => void;
}) {
  const [state, _] = useState<Article>(props.article);

  function renderStatusString(
    string: EArticleStatus
  ): ReactElement | undefined {
    switch (string) {
      case EArticleStatus.pending:
        return (
          <div className={"status-string"} style={{color: ""}}>
            {EArticleStatus.pending}
          </div>
        );
      case EArticleStatus.draft:
        return (
          <div className={"status-string"} style={{color: "#9f9f10"}}>
            {EArticleStatus.draft}
          </div>
        );
      case EArticleStatus.reviewed:
        return (
          <div className={"status-string"} style={{color: ""}}>
            {EArticleStatus.reviewed}
          </div>
        );
      case EArticleStatus.published:
        return (
          <div className={"status-string"} style={{color: "#6bad06"}}>
            {EArticleStatus.published}
          </div>
        );
      default:
        return <div>Pending</div>;
    }
  }

  return (
    <>
      <motion.div
        initial={{x: -10}}
        animate={{x: 0}}
        className={"blog-card-container"}
      >
        <div className={"blog-status"}>
          <div className={"dflex"}>
            <div>
              {" "}
              {state.status !== EArticleStatus.published && (
                <MdDelete
                  className={"blog-card-icon"}
                  color={"whitesmoke"}
                  size={18}
                  onClick={() => {
                    confirm({
                      message: "Do you wanna delete this blog permanently?",
                      header: "Confirmation",
                    }).then(function () {
                      props.onDelete(state?.id);
                    });
                  }}
                />
              )}
            </div>
            <div>
              {state.status !== EArticleStatus.published && (
                <Tooltip text={"Edit"}>
                  {" "}
                  <AiFillEdit
                    className={"blog-card-icon"}
                    onClick={() => {
                      props.onClick(state);
                    }}
                    color={"whitesmoke"}
                    size={18}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div> {renderStatusString(state.status)}</div>
        </div>
        <div className={"blog-content"}>
          <div dangerouslySetInnerHTML={{__html: state.content}}></div>
          <div className={"blur-blog-content"}></div>
        </div>
        <div className={"blog-date"}>
          Written on {formatDateToDDMMYYYY(state.created_at)}
        </div>
      </motion.div>
    </>
  );
}
