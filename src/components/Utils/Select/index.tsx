import React, {useEffect, useState} from 'react';
import './index.css'

interface SearchInterface {
    onSelect: (s: string) => void
    dataList: any[],
    classes?:string
}

export function Search(props: SearchInterface) {
    const [item, setItem] = useState<any>([]);
    const [input,_input] = useState('')
    function handleFilter(s: string) {
        _input(s);
        if (!s.split('').length) {
            setItem([]);
        } else {
            setItem(props.dataList.filter(item => item.name.includes(s.trim().toUpperCase())).map(item => item.name));
        }
    }

    useEffect(() => {
        return () => {
            setItem([]);
        }
    }, []);

    return (
        <div className={'searchComponent'}>
            <div className={'input-wrapper'}>
                <input value={input} type={'name'} className={props.classes ? props.classes:''} onChange={e => handleFilter(e.target.value)} placeholder={'Add keywords'}/>
            </div>
            <div className={'result-list'}>
                {item.map((item: string) => {
                    return <div className={'list-item'} onClick={()=>{
                        props.onSelect(item);
                        setItem([]);
                        _input('')
                    }} >{item}</div>
                })}
            </div>
        </div>
    )
}