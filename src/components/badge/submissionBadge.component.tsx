import React from 'react';
import {Badge} from "./index";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";

export function SubmissionBadgeComponent(){
    return (
        <Badge HeadingEl={getString(enString.mysubmission)} InfoEl={'Total submissions done this month'} />
    )
}