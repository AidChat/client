import React from "react";


interface IMenu {
    items: { name: string, id: number }[],
    onClick: (id: number) => void
}


export function Menu(props: IMenu) {
    return (<div className={"customMenu-wrapper "}>
        {props.items.map((item, index) => (<div
            className={"menu-item"}
            onClick={() => {
                props.onClick(item.id);
            }}
            key={index}
        >
            {item.name.toUpperCase()}
        </div>))}
    </div>);
}