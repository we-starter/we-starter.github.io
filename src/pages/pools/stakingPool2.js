import React  from 'react';
import { StakingItem } from './StakingItem';
import { useStakingPoolInfo } from './Hooks';
import { NoConnect } from '../../components/noConnet';

export const StakingPool2 = () => {
    const stakingInfos = useStakingPoolInfo();

    // const tokenA =  new Token(3, '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C', 18)
    // const tokenB =  new Token(3, '0xad6d458402f60fd3bd25163575031acdce07538d', 18)
    // const stakingAddress = Pair.getAddress(tokenA, tokenB)
    //
    // console.log('stakingAddress--->', stakingAddress)

    return (
        <article className='center'>
            <div className='statistics'>
                <div className='statistics__list'>
                    {stakingInfos.staking2.length ? (
                        stakingInfos.staking2.map((item) => {
                            return <StakingItem double info={item} />;
                        })
                    ) : (
                        <NoConnect />
                    )}
                </div>
            </div>
        </article>
    );
};
