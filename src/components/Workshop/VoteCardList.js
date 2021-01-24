import React, { useState } from "react";

import { VoteCard } from "./";
import {useFigures} from "../../pages/Workshop/Hooks";

export const VoteCardList = ({type}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {figures} = useFigures()


    return (
        <>
            <div className="artwork-list">
                <div className="artwork-list__list">
                    {figures.filter(item => {return type === -1 || type === item.proposalId}).map(item =>{
                        return (
                            <VoteCard figure={item} setIsOpen={setIsOpen} />
                        )
                    })}
                </div>
            </div>

        </>
    );
};
