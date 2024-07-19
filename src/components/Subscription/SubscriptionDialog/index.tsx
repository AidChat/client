import {Dialog} from "primereact/dialog";
import {Logo} from "../../Utils/Logo";
import '../index.css'
import {features} from "../../../assets/data";
import {useEffect, useState} from "react";
import {getString} from "../../../utils/strings";
import {enString} from "../../../utils/strings/en";
import {useResponsizeClass} from "../../../utils/functions";
import {EwindowSizes} from "../../../utils/enum";
import {_props} from "../../../services/network/network";
import {Spinner} from "../../Utils/Spinner/spinner";


interface SubscriptionDialogProps {
    show: boolean
    onClose: () => void
}


export function SubscriptionDialog(props: SubscriptionDialogProps) {
    const [show, setShow] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(process.env.REACT_APP_STRIPE_SECRET || null);
    const [loading,setLoading] = useState(false);
    function handleClose() {
        props.onClose();
    }
    const URL = process.env.REACT_APP_STRIPE_URL;
    function handleRedirect(){
       if (!loading)
        _props._user().get().then((response) => {
            window?.open(URL + '?prefilled_email='+response.email, '_blank')?.focus();
            setLoading(true);
        })
    }

    useEffect(() => {
        window.setTimeout(() => {
            setShow(props.show);
        }, 2000)
        return ()=>{
            setLoading(false);
        }
    }, [props.show]);
    return (
        <Dialog
            onHide={() => {
            }} showHeader={false} visible={show} maximized={false}>
            <div
                className={'sub-container font-primary dflex flex-center flex-column' + useResponsizeClass(EwindowSizes.S, [' sub-container-small'])}>
                <div className={'dflex flex-row p8 flex-center'}><Logo/>
                </div>
                <h2 className={"sub-heading m4"}>Pricing</h2>
                <h1 className={'m4'}><span className={'font-secondary'}> <span
                    className={'sub-price-text'}>{getString(enString.pricing)}</span><span className={'font-large'}>/week</span></span></h1>
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
                        className={`btn btn-primary font-secondary font-large m4 btn-custom`}> {loading ? <Spinner />:'Subscribe'}
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
