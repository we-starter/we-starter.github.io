import React, { useState } from 'react';
import { ReactComponent as HUSD } from '../../assets/logo/HUSD.svg';
import { ReactComponent as ONE } from '../../assets/icon/1X.svg';
import { StakingItem } from './StakingItem';
import {useStakingPoolInfo} from "./Hooks";

export const StakingPool1 = () => {

    const stakingInfos = useStakingPoolInfo()

    return (
        <article className='center'>
            <div className='statistics'>
                <div className='statistics__list'>
                    {stakingInfos.staking1.map((item) => {
                        return <StakingItem info={item} key={item.id} />;
                    })}
                </div>
            </div>
        </article>
    );
};
