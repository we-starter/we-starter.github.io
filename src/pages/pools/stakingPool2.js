import React, {useContext, useState} from 'react'
import {mainContext} from "../../reducer";
import {ReactComponent as HUSD} from '../../assets/logo/HUSD.svg'
import {StakingItem} from "./StakingItem";

export const StakingPool2 = () => {

  const stakingInfos = [
    {id: 0, title: 'WAR-ETH', symbol: 'LP', address: '0x441FB052eb4b78148DA28D5da95C38E49e900afB', stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',logo: <HUSD/>},
    {id: 0, title: 'WAR-DAI', symbol: 'LP', address: '0xe46Eff65f94935501e343B2B56bA59400661eC10', stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',logo: <HUSD/>},
  ]
  // const tokenA =  new Token(3, '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C', 18)
  // const tokenB =  new Token(3, '0xad6d458402f60fd3bd25163575031acdce07538d', 18)
  // const stakingAddress = Pair.getAddress(tokenA, tokenB)
  //
  // console.log('stakingAddress--->', stakingAddress)

  const {dispatch, state} = useContext(mainContext);

  return (
      <article className="center">
        <header className="head-page">
          <h1 className="head-page__title h5">二池</h1>
        </header>

        <div className="statistics">

          <div className="statistics__list">
            {stakingInfos.map(item =>{
              return(
                  <StakingItem double info={item}/>
              )
            })}

          </div>

        </div>

      </article>

  )
}
