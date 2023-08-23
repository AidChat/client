import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import {Badge} from "./index";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";

export function EarningBadge() {
    let threshold = 1000
    function handleCalculation() : number{
        return threshold - 100
    }
    return (<Badge amount={100} value={100} HeadingEl={getString(enString.myearning)} InfoEl={"Earning as based on your valid submissions"}  /> )
}
