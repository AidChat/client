import React from "react";

export function Menu({
                               items, onClick,
                           }: {
    items: { name: string; id: number }[]; onClick: (S: number) => void;
}) {
    return (<div className={"customMenu-wrapper "}>
        {items.map((item, index) => (<div
            className={"menu-item"}
            onClick={() => {
                onClick(item.id);
            }}
            key={index}
        >
            {item.name.toUpperCase()}
        </div>))}
    </div>);
}