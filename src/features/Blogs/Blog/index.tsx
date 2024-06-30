import {useEffect, useState} from "react";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../utils/enum";
import {_props} from "../../../services/network/network";
import './index.css'
import {getDeviceID, useResponsizeClass} from "../../../utils/functions";
import {useQuery} from "../../../services/hooks/appHooks";
import {GiLifeSupport} from "react-icons/gi";
import LogoCanvas from "../../../components/Utils/Logo/logo-canvas";
import {getString} from "../../../utils/strings";
import {enString} from "../../../utils/strings/en";
import {MdRemoveRedEye} from "react-icons/md";

interface Blog {
    blog_id: number;
}

export function Blog(props: Blog) {
    const [state, setState] = useState<{ main: any, trending: any[] }>({
        main: {},
        trending: []
    })
    const query = useQuery();
    function getBlogs(id: number | string) {
        getDeviceID().then(async function (info) {
            let {data} = await _props._db(service.group).query(serviceRoute.blogArticles, {deviceID: info.identifier}, reqType.post, id)
            setState(data);
        })
    }

    useEffect(() => {
        let blog_id = query.get('blog');
        if (blog_id) {
            getBlogs(blog_id);
        }
    }, []);

    function handlerRedirection() {
        let env = process.env.NODE_ENV;
        if (env === 'development') {
            window.location.replace(window.location.protocol + '//localhost:' + window.location.port);
        }
        if (env === 'production') {
            const baseURL = process.env.REACT_APP_baseurl;
            window.location.replace(window.location.protocol + baseURL + window.location.port);

        }

    }

    function handleRedirectToNextBlog(id: number | string) {
        window.location.replace(window.location.protocol + '//' + window.location.host + '?blog=' + id)
    }


    return (
        <div className={'dflex h100 flex-column blog-wrapper'}>
            <div className={'font-primary   logo-container'}>
                <LogoCanvas/>
            </div>
            <div
                className={" font-primary blog-editor-container  " + useResponsizeClass(EwindowSizes.S, [' dblock flex-column '])}>

                <div
                    className={'main-blog-container' + useResponsizeClass(EwindowSizes.S, [' w100']) + useResponsizeClass(EwindowSizes.Xl, [' large-padding'])}>
                    {state?.main?.content &&
                        <div dangerouslySetInnerHTML={{__html: state.main.content || ''}}/>}
                </div>
                <div className={'trending-blog-container' + useResponsizeClass(EwindowSizes.S, [' w100 '])}>
                    <div className={'aidchat-ad'}>
                        <h3>
                            {getString(enString['advText'])}
                        </h3>
                        <div className={'btn btn-primary font-secondary'} onClick={handlerRedirection}><GiLifeSupport
                            size={20}/> &nbsp;
                            Get Help.
                        </div>
                        {state.main.viewers && <div className={'font-primary dflex p8 '}>
                            <MdRemoveRedEye size={22}/> &nbsp;
                            {state?.main?.viewers?.length * 1890} reads so far
                        </div>
                        }
                        {
                            state.main.User && <>
                                <div className={'author-card-wrapper'}>
                                    <div className={'font-primary'}>Author</div>
                                    <div className={'author-container'}>
                                        <div className={'author-image-container'}><img src={state.main.User.profileImage}/>
                                        </div>
                                        <div className={'author-details'}>
                                            <div>{state.main.User.name} aka <span
                                                className={'font-secondary'}>{state.main.User.Username}</span></div>
                                            <div className={'author-description'}>{state.main.User.about}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <h2 className={'font-secondary'}>Trending articles</h2>

                    <div>
                        {state.trending?.map((blog: { content: string, id: string | number }, index: number) => {
                            return (
                                <div key={index}>
                                    <div className={'article-content-container'}>
                                        <div dangerouslySetInnerHTML={{__html: blog.content || ''}}/>
                                    </div>
                                    <div className={'font-secondary w25 pointer m4 '} onClick={() => {
                                        handleRedirectToNextBlog(blog.id)
                                    }} style={{borderBottom: '1px solid gray'}}>Read more
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}