import React, {ReactElement, useEffect, useState} from "react";
import {Validator} from "../../components/Auth";
import {Spinner} from "../../components/Utils/Spinner/spinner";
import {_props} from "../network/network";
import {useNavigate, useParams} from "react-router-dom";
import {UserDetailsForm} from "../../components/Concent";
import {reqType, service, serviceRoute} from "../../utils/enum";

export let AuthContext = React.createContext<
  | {
      isAuthenticated?: boolean;
      removeUserSession: () => void;
      verifyAuthentication: (
        session_id?: string,
        forceReload?: boolean
      ) => void;
      isUserVerified: boolean;
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
  useEffect(() => {
    verifyAuthentication();
  }, []);
  useEffect(() => {
    if (requestCode) {
      setAuth(false);
      _invitation(true);
    }
  }, [requestCode]);

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
            console.log(user);
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        verifyAuthentication,
        removeUserSession,
        isUserVerified,
      }}
    >
      {!loading ? (
        isAuthenticated && !invitation ? (
          showUserForm ? (
            <UserDetailsForm />
          ) : (
            children
          )
        ) : (
          <Validator />
        )
      ) : (
        <Spinner />
      )}
    </AuthContext.Provider>
  );
};
