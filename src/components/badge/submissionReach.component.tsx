import React from 'react';
import {Badge} from "./index";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";

export function SubmissionReachComponent(){

    return(
        <Badge HeadingEl={getString(enString.submissionviewed)} InfoEl={'This value shows reach of your submission to people'} />
    )
}