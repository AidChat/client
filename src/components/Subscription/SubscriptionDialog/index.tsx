import {Dialog} from "primereact/dialog";
import {Logo} from "../../Utils/Logo";
import '../index.css'
import {features} from "../../../assets/data";
import {useState} from "react";
import {getString} from "../../../utils/strings";
import {en, enString} from "../../../utils/strings/en";

interface SubscriptionDialogProps {
    show: boolean
    onClose: () => void
}

export function SubscriptionDialog(props: SubscriptionDialogProps) {
    const [show, setShow] = useState(props.show);
    function handleClose() {
        props.onClose();
    }
    return (
        <Dialog
            onHide={() => {
        }} showHeader={false} visible={props.show} maximized={false} >
            <div className={'sub-container font-primary dflex flex-center flex-column'}>
                <div className={'dflex flex-row p8 flex-center'}><Logo/>
                </div>
                <div className={"sub-heading text-large "}>Subscribe</div>
                <h1 className={'m4'}><span className={'font-secondary'}> <span className={'sub-price-text'}>₹100</span><span className={'font-large'}>/week</span></span></h1>
                <div className={'sub-bullets'}>
                    <h4>Can get you access to:</h4>
                    {
                        features.map(item => {
                            return <li>{item}</li>
                        })
                    }
                </div>
                <div className={'btn btn-primary font-secondary font-large m4 btn-custom'}>
                    Start
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