import React, {useContext, useEffect, useState} from "react";
import "./index.css";
import {groupTokensArray} from "../../../../assets/data";
import {Search} from "../../../Utils/Select";
import {AiOutlineCloseCircle} from "react-icons/ai";
import {_props} from "../../../../services/network/network";
import {ShellContext} from "../../../../services/context/shell.context";
import Snackbar from "../../../Utils/Snackbar";
import {Spinner} from "../../../Utils/Spinner/spinner";
import ImageUploader from "react-images-upload";
import group from "../../../../assets/svg/groups.svg";
import {reqType, service, serviceRoute} from "../../../../utils/enum";
import {AnimatePresence, motion} from "framer-motion";
import {AppContext} from "../../../../services/context/app.context";
import {useCheckUserVerification} from "../../../../services/hooks";

interface _gfIterface {
  onSubmit?: () => void;
  onError?: () => void;
}

interface GroupFormStateInterface {
  name: string;
  description: string;
  keywords: string[];
  requestee: string;
  icon?: string;
}

export function GroupForm({onSubmit, onError}: _gfIterface) {
  const [state, _state] = useState<GroupFormStateInterface>({
    name: "",
    description: "",
    keywords: ["CHANGE", "COMMUNITY", "HOPE"],
    requestee: "",
    icon: undefined,
  });
  const {ping} = useContext(ShellContext);
  const [message, _message] = useState<string | null>(null);
  const [loading, _loading] = useState<boolean>(false);
  const isVerified = useCheckUserVerification();
  function resetState() {
    _state({name: "", description: "", keywords: [], requestee: ""});
    _loading(false);
  }

  function handleKeywords(s: string) {
    _state({...state, keywords: [...state.keywords, s]});
  }

  function removeKeyword(s: string) {
    let keywords = state.keywords.filter(item => item !== s);
    _state({...state, keywords: keywords});
  }

  function handleSubmit(e?: {preventDefault: () => void}) {
    e?.preventDefault();
    if (!isVerified) {
      _message(
        "You haven't verified you email address yet. Please verify it first and try again."
      );
      return;
    }
    if (!state.name || !state.description || !state.keywords.length) {
      _message(
        "Please be more descriptive. This would really have a great impact."
      );
      window.setTimeout(() => {
        _message(null);
      }, 10000);
    } else {
      _loading(true);
      _props
        ._db(service.group)
        .query(serviceRoute.group, state, reqType.post, undefined)
        .then(result => {
          if (onSubmit) {
            _message("Group added");
            resetState();
            ping();
            onSubmit();
          }
          _loading(false);
        })
        .catch(error => {
          _loading(false);
          console.error(error);
        });
    }
  }

  function handleChange(e: {target: {name: any; value: any}}) {
    _state({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  function handleImageUpload(e: any) {
    const file = e[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      if (reader && reader.result) {
        if (typeof reader.result === "string") {
          const base64String = reader.result;
          _state({...state, icon: base64String});
        }
      }
    };
    reader.readAsDataURL(file);
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={"formEleWrapper iconSection"}>
          <div className={"dialogCoverImageContainer"}>
            <img
              src={state.icon ? state.icon : group}
              alt={"group icon"}
              className={"profileCoverImage"}
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
        <div className={"formEleWrapper"}>
          <label>Group Name</label>
          <input
            name={"name"}
            onChange={handleChange}
            required={true}
            value={state.name}
            className={"borderRadius-light custom-input"}
            type={"text"}
            placeholder={"Choose a name that explains the purpose"}
          />
        </div>
        <div className={"formEleWrapper column token-section  borderRadius-light"}>

          <div className={"  group-token-container"}>
            <Search
              onSelect={(s: string) => {
                handleKeywords(s);
              }}
              classes={'custom-input'}
              dataList={groupTokensArray}
            />

            {state.keywords.map(item => {
              return (
                <AnimatePresence>
                  <motion.div
                    initial={{x: "-10px"}}
                    animate={{x: 0}}
                    exit={{x: "-10px"}}
                    className={"tokens"}
                  >
                    {item}{" "}
                    <span className={"close"}>
                      <AiOutlineCloseCircle
                        onClick={() => removeKeyword(item)}
                      />
                    </span>
                  </motion.div>
                </AnimatePresence>
              );
            })}
          </div>
        </div>

        <div className={"formEleWrapper"}>
          <label>Group description</label>
          <textarea
            required={true}
            name={"description"}
            onChange={handleChange}
            value={state.description}
            className={
              "borderRadius-light custom-input-people custom-input borderRadius-heavy"
            }
            placeholder={"Write some description about your group"}
          />
        </div>
        <div className={"flex sendBtnWrapper"}>
          <div
            className={"btn btn-round-secondary"}
            onClick={e => handleSubmit()}
          >
            {loading ? <Spinner /> : "Create"}
          </div>
        </div>
      </form>
      {message && (
        <Snackbar
          message={message}
          onClose={() => {
            _message(null);
          }}
        />
      )}
    </>
  );
}
