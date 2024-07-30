import {formatDateToDDMMYYYY, formatTimeToHHMM, timeAgo} from "../../utils/functions";
import Markdown from "react-markdown";


interface UserAnalysis {
    at:Date,
    sentiments:string,
    evaluation:string,
    username:string
}

export function UserAnalysis(props: { data:UserAnalysis[] }) {
    
    return (
        <>{props?.data?.length > 0 ?
        <div className={"_scrollable-container"}>
            {props.data.map(function(item){
               return<div className={'font-primary label '}>

                   <div>
                       <div className={'mygroup-label'}> Sentiment analysis: <div
                           className={'font-primary'}> &nbsp; ( {timeAgo(item.at)} ) </div></div>

                       <Markdown>{item.sentiments}</Markdown>
                   </div>
                   <div>
                       <div className={'font-secondary'}>Final Evaluation: </div>
                           <Markdown>{item.evaluation}</Markdown>
                   </div>
               </div>
            })}
        </div>:
                <div className="font-medium font-primary">
 Pending evaluation
                </div>
        }</>
    )
}