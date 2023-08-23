import React, {useEffect, useState} from "react";

const  height = ()=> window.innerHeight;
const  width =() => window.innerWidth
export function useScreen(): string[] {
    let [size, setSize] = React.useState<string>('');
    window.addEventListener("resize", ()=>{
        if (height() <= 640 && width() <= 360) setSize('sm')
        if (height() <= 1024 && width() <= 768) setSize('md')
        else setSize('xl')
    });
    return [size]
}
