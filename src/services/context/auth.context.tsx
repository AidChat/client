import React, {ReactElement, useEffect, useState} from "react";
import {AuthenticationContainer} from "../../components/Auth";
import {Spinner} from "../../components/Utils/Spinner/spinner";
import {_props} from "../network/network";
import {useNavigate, useParams} from "react-router-dom";
import {UserDetailsForm} from "../../components/Concent";
import {reqType, service, serviceRoute} from "../../utils/enum";
import {ClientChatWindow} from "../../components/Moksha";
import {io, Socket} from "socket.io-client";
import {SocketEmitters, SocketListeners} from "../../utils/interface";
import {BlogList} from "../../features/Blogs/Blogs";
import {Blog} from "../../features/Blogs/Blog";

export let AuthContext = React.createContext<{
        isAuthenticated?: boolean;
        removeUserSession: () => void;
        verifyAuthentication: (
            session_id?: string,
            forceReload?: boolean
        ) => void;
        isUserVerified: boolean;
        eventSocket: Socket | null,
        setConfession: (V: boolean) => void,
        mokshaSocket: Socket | null,
        isMokshaAvailable: boolean,
        toggleBlogComponent: () => void
    }
    | undefined
>(undefined);
export const AuthContextProvider = ({
                                        children,
                                    }: {
    children: ReactElement[] | ReactElement;
}) => {
    const navigate = useNavigate();
    const [isAuthenticated, setAuth] = useState(false);
    const [invitation, _invitation] = useState<boolean>(false);
    const [loading, setLoad] = useState(true);
    const {requestCode} = useParams();
    const [showUserForm, setFormVisibility] = useState<boolean>(true);
    const [isUserVerified, setVerifyState] = useState<boolean>(false);
    const [isClient, setConfession] = useState<boolean>(true);
    const [eventSocket, setEventSocket] = useState<Socket | null>(null);
    const [mokshaSocket, setMokshaSocket] = useState<Socket | null>(null);
    const [isMokshaAvailable, setIsMokshaAvailable] = useState<boolean>(false);
    const [showBlogComponent, setShowBlogComponent] = useState<boolean>(false);
    const [showBlogs, setShowBlogs] = useState(false);
    useEffect(() => {
        let hostname = window.location.hostname;
        const link = hostname.split('.')[0];
        if (link === 'aider') {
            setConfession(false);
        }
        if (link === 'blog') {
            setShowBlogs(true);
        }
        verifyAuthentication();
        let newSocket = io(service.bot, {
            autoConnect: true,
            reconnectionAttempts: 10,
        });
        newSocket.emit(SocketEmitters._PING);
        newSocket.on(SocketListeners.PONG, () => {
            setIsMokshaAvailable(true)
        })
        setMokshaSocket(newSocket);
    }, []);
    useEffect(() => {
        if (requestCode) {
            setAuth(false);
            _invitation(true);
            setConfession(false);
        }
    }, [requestCode]);

    function changeConfession() {
        setConfession(!isClient);
    }

    function stopload() {
        setLoad(false);
    }

    function verifyAuthentication(
        sessionId?: string,
        forceReload?: boolean
    ): void {
        if (sessionId) window.localStorage.setItem("session", sessionId);
        _props
            ._user()
            .validateSession()
            .then(() => {
                _props
                    ._user()
                    .get()
                    .then((user: any) => {
                        if (user) {
                            setVerifyState(user.verifiedEmail);
                            if (user.Type === "Pending") {
                                setFormVisibility(true);
                            } else {
                                setFormVisibility(false);
                            }
                            setAuth(true);
                            if (!requestCode) {
                                navigate("/");
                            }
                            if (forceReload) {
                                navigate("/");
                                window.location.reload();
                            }
                            if (!forceReload) {
                                stopload();
                            }
                        }
                    });
            })
            .catch(() => {
                setAuth(false);
                if (!sessionId) {
                    stopload();
                }
            });
    }


    function removeUserSession() {
        setLoad(true);
        _props
            ._db(service.authentication)
            .query(serviceRoute.session, {}, reqType.delete)
            .then(() => {
                localStorage.removeItem("session");
                localStorage.removeItem("_user");
                verifyAuthentication(undefined, true);
            });
    }

    function toggleBlogComponent() {
        setShowBlogComponent(!showBlogComponent);
    }


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                verifyAuthentication,
                removeUserSession,
                isUserVerified,
                eventSocket,
                setConfession,
                mokshaSocket,
                isMokshaAvailable,
                toggleBlogComponent
            }}
        >
            {!loading ? (
                isAuthenticated && !invitation ? (
                    showUserForm ? (
                        <UserDetailsForm/>
                    ) : (
                        showBlogComponent ? <BlogList/> : children
                    )
                ) : (
                    isClient ?
                        !showBlogs ? <ClientChatWindow click={() => changeConfession()}/> : <Blog blog_id={1}/> :
                        <AuthenticationContainer/>
                )
            ) : (
                <Spinner/>
            )}
        </AuthContext.Provider>
    );
};
