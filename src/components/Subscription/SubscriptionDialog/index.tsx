import {Dialog} from "primereact/dialog";
import {Logo} from "../../Utils/Logo";
import '../index.css'
import {features} from "../../../assets/data";
import {useContext, useEffect, useState} from "react";
import {getString} from "../../../utils/strings";
import {enString} from "../../../utils/strings/en";
import {getDeviceInfoUsingCapacitor, notify, useResponsizeClass} from "../../../utils/functions";
import {EwindowSizes} from "../../../utils/enum";
import {_props} from "../../../services/network/network";
import {Spinner} from "../../Utils/Spinner/spinner";
import {AuthContext} from "../../../services/context/auth.context";
import {SocketListeners} from "../../../utils/interface";
import Snackbar from "../../Utils/Snackbar";
import {Browser} from "@capacitor/browser";


interface SubscriptionDialogProps {
    show: boolean
    onClose: () => void
}


export function SubscriptionDialog(props: SubscriptionDialogProps) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    function handleClose() {
        props.onClose();
    }

    const ac = useContext(AuthContext);
    const URL = process.env.REACT_APP_STRIPE_URL;

    function handleRedirect() {
        if (!loading)
            _props._user().get().then((response) => {
                getDeviceInfoUsingCapacitor().then(function (info) {
                    const url = URL + '?prefilled_email=' + response.email
                    setLoading(true);
                    if (info.platform === 'web') {
                        Browser.open({url}).then(r => {
                            Browser.addListener('browserFinished', function () {
                                setMessage('Please waite while we confirm the payment.');
                            })
                            setLoading(true);
                        })
                    }

                })
            })
    }

    useEffect(() => {
        window.setTimeout(() => {
            setShow(props.show);
        }, 2000)
        return () => {
            setLoading(false);
        }
    }, [props.show]);

    useEffect(() => {
        if (!ac?.globalSocket?.connected) {
            ac?.connectToGlobalSocket();
        } else {
            ac?.globalSocket?.on(SocketListeners.PAYMENTDONE, function (data: any) {
                notify("Payment successful!");
                setMessage("Payment successful");
                setLoading(false);
                handleClose();
            })
        }
    }, [ac?.globalSocket?.connected]);

    return (
        <Dialog
            onHide={() => {
            }} showHeader={false} visible={show} maximized={false}>
            <Snackbar message={message} onClose={() => setMessage}/>
            <div
                className={'sub-container font-primary dflex flex-center flex-column' + useResponsizeClass(EwindowSizes.S, [' sub-container-small'])}>
                <div className={'dflex flex-row p8 flex-center'}><Logo/>
                </div>
                <h2 className={"sub-heading m4"}>Pricing</h2>
                <h1 className={'m4'}><span className={'font-secondary'}> <span
                    className={'sub-price-text'}>{getString(enString.pricing)}</span><span
                    className={'font-large'}>/week</span></span></h1>
                <div className={'sub-bullets'}>
                    <h4 className={'font-large '}>Can get you access to:</h4>
                    {
                        features.map(item => {
                            return <li>{item} <span className={'font-secondary font-small sub-lm'}>[Learn more]</span>
                            </li>
                        })
                    }
                </div>

                <div className={''}>

                    <button onClick={handleRedirect}
                            className={`btn btn-primary font-secondary font-large m4 btn-custom`}> {loading ?
                        <Spinner/> : 'Subscribe'}
                    </button>

                </div>

                <div className={'font-small'}>
                    Didn't like it? Cancel anytime.
                </div>
                <div className={'btn btn-secondary font-medium pointer'} onClick={() => {
                    handleClose()
                }}>
                    Continue with {getString(enString['botname'])}
                </div>

            </div>
        </Dialog>
    )
}
