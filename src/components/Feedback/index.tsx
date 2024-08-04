import './index.css'
import React, {useState} from "react";
import {Dialog} from "primereact/dialog";
import {CiCircleInfo, CiStar} from "react-icons/ci";
import {FaStar} from 'react-icons/fa6';
import Tooltip from "../Utils/Tooltip";
import Snackbar from "../Utils/Snackbar";
import {Spinner} from "../Utils/Spinner/spinner";
import {_props} from "../../services/network/network";
import {reqType, service, serviceRoute} from "../../utils/enum";

interface IFeedback {
    username: string,
    open: boolean,
    onClose: () => void,
    helperId: string
}

export function Feedback(props: IFeedback) {
    return (
        <Dialog breakpoints={{"960px": "75vw", "641px": "80vw"}}
                visible={props.open}
                header={"User feedback"}
                style={{width: "30vw"}}
                onHide={() => {
                    props.onClose()
                }}
                draggable={false}
                keepInViewport={true}

                maximized={false}
                blockScroll={true}>
            <FeedbackForm username={props.username} helperId={props.helperId} onSubmit={props.onClose}/>
        </Dialog>
    )
}


function FeedbackForm({username, onSubmit, helperId}: { username: string, onSubmit: () => void, helperId: string }) {
    const [ratings, _] = useState([{
        id: 1,
        type: "UPSET",
        selected: true
    },
        {
            id: 2,
            type: "UNHAPPY",
            selected: true
        }, {id: 3, type: 'NEUTRAL', selected: true}, {id: 4, type: 'HAPPY', selected: false}, {
            id: 5, type: 'SATISFIED', selected: false,
        }
    ])
    const [rating, setRating] = useState(3);
    const [feedback, setFeedback] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit() {
        if (feedback.trim() === '') {
            setMessage("Please provide a feedback");
        } else {

            setLoading(true)
            const data = {
                rating,
                text: feedback
            }
            const response = await _props._db(service.group).query(serviceRoute.postfeedback, data, reqType.post, helperId)
            setMessage(response.message);
            setLoading(false);
            window.setTimeout(() => {
                onSubmit();
            }, 3000)
        }
    }

    return (
        <div className={'feedback-container '}>
            <Snackbar message={message} onClose={() => {
                setMessage('')
            }}/>

            <div className={'font-large font-primary dflex flex-center p8'}>
                <CiCircleInfo size={18}/>
                Your feedback is valuable for us.
            </div>
            <div className={'font-medium font-primary'}>
                Please let us know about your experience with {username}
            </div>
            <form className='feedback-form'>
                <div className={'font-primary font-medium'}>
                    <label className={'text-left font-secondary font-large feedback-form-label'}>How was your
                        experience?</label>
                    <textarea onChange={(e) => setFeedback(e.target.value)} value={feedback}
                              className={'feedback-text-area'} placeholder={'Type something here.'}/>
                </div>
                <div>
                    <label className={'text-left font-secondary font-large feedback-form-label'}>Rate your
                        conversation.</label>
                    <div className={'dflex flex-row flex-center p8 feedback-rating-container'}>
                        {ratings.map((item) => {
                            return !(item.id <= rating) ?
                                <Tooltip text={item.type.toLowerCase()}><CiStar size={40} color={'white'}
                                                                                onClick={() => {
                                                                                    setRating(item.id)
                                                                                }}/></Tooltip> :
                                <Tooltip text={item.type.toLowerCase()}> <FaStar size={38} color={'#398378FF'}
                                                                                 onClick={() => {
                                                                                     setRating(item.id)
                                                                                 }}/></Tooltip>
                        })

                        }
                    </div>
                </div>
                <div className={'dflex flex-row feedback-container-submit-btn'}>
                    <div className={'btn btn-primary'} onClick={handleSubmit}>{!loading ? 'Submit' : <Spinner/>}
                    </div>
                </div>
            </form>
        </div>
    )
}