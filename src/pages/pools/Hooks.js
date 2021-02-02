import React, {useState, useEffect} from 'react';
import {getContract, useActiveWeb3React} from "../../web3";
import {
    WETH_ADDRESS
} from "../../web3/address";
import StakingReward from "../../web3/abi/StakingReward.json";
import Web3 from "web3";
import {ReactComponent as HUSD} from "../../assets/logo/HUSD.svg";
import {ReactComponent as ONE} from "../../assets/icon/1X.svg";
import {ReactComponent as HT} from "../../assets/logo/HT.svg";
import {ReactComponent as MDX} from "../../assets/logo/MDX.svg";
import {ReactComponent as WAR} from "../../assets/logo/war.svg";
import {ReactComponent as HBTC} from "../../assets/logo/HBTC.svg";



export const useStakingInfo = (stakingInfo) => {
    const {account, active, library, chainId} = useActiveWeb3React()
    const [earned, setEarned] = useState()
    const [reward, setReward] = useState()
    const [earnedTotal, setEarnedTotal] = useState()
    const [balance, setBalance] = useState()


    console.log('address', stakingInfo)

    function queryStakingInfo() {
        const contract = getContract(library, StakingReward, stakingInfo.stakingAddress)

        try {
            contract.methods.earned(account).call().then(res => {
                console.log('earned', res)
                setEarned(res)
            })
        } catch (e) {
            console.log('earned error', e)
        }

        try {
            contract.methods.rewards(account).call().then(res => {
                console.log('getReward', res)
                setReward(res)
            })
        } catch (e) {
            console.log('getReward error', e)
        }

        try {
            if (stakingInfo.address) {
                const tokenContract = getContract(library, StakingReward, stakingInfo.address)
                tokenContract.methods.balanceOf(account).call().then(res => {
                    console.log('balanceOf', res, stakingInfo.address)
                    setBalance(res)
                })
            } else {
                const web3 = new Web3(library.provider);
                web3.eth.getBalance(account).then(res => {
                    console.log('eth balance', res)
                    setBalance(res)
                })
            }

        } catch (e) {
            console.log('balanceOf error', e)
        }

        try {
            if(stakingInfo.address){
                const tokenContract = getContract(library, StakingReward, stakingInfo.address)
                tokenContract.methods.balanceOf(stakingInfo.stakingAddress).call().then(res => {
                    console.log('earned total', res)
                    setEarnedTotal(res)
                })
            }else {
                const tokenContract = getContract(library, StakingReward, WETH_ADDRESS(chainId))
                tokenContract.methods.balanceOf(stakingInfo.stakingAddress).call().then(res => {
                    console.log('earned total', res)
                    setEarnedTotal(res)
                })
            }

        } catch (e) {
            console.log('balanceOf error', e)
        }
    }

    useEffect(() => {
        if (account) {
            queryStakingInfo()
        }
    }, [account])

    return earned && reward && earnedTotal && balance ? {earned, reward, earnedTotal, balance} : null
}

export const useStakingPoolInfo = () => {
    const [stakingInfos, setStakingInfos] = useState({
        staking1: [],
        staking2: [],
        staking3: []
    })

    const {chainId} = useActiveWeb3React()

    useEffect(()=>{
        switch (chainId) {
            case 3:
                setStakingInfos({
                    staking1: [
                        {
                            id: 0,
                            title: 'EHT POOL',
                            symbol: 'EHT',
                            address: null,
                            stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
                            logo: <HUSD />,
                            multiple: <ONE />,
                        },
                        {
                            id: 1,
                            title: 'DAI POOL',
                            symbol: 'DAI',
                            address: '0xad6d458402f60fd3bd25163575031acdce07538d',
                            stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
                            logo: <HUSD />,
                            multiple: <ONE />,
                        },
                        // {
                        //     id: 0,
                        //     title: 'WAR POOL',
                        //     symbol: 'WAR',
                        //     address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
                        //     stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
                        //     logo: <HUSD />,
                        //     multiple: <ONE />,
                        // },
                    ],
                    staking2: [
                        {
                            id: 0,
                            title: 'WAR-ETH',
                            symbol: 'LP',
                            address: '0x441FB052eb4b78148DA28D5da95C38E49e900afB',
                            stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
                            logo: <HUSD />,
                        },
                        {
                            id: 0,
                            title: 'WAR-DAI',
                            symbol: 'LP',
                            address: '0xe46Eff65f94935501e343B2B56bA59400661eC10',
                            stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
                            logo: <HUSD />,
                        },
                    ],
                    staking3: [
                        {
                            id: 0,
                            title: 'WAR-ETH',
                            symbol: 'LP',
                            address: '0x441FB052eb4b78148DA28D5da95C38E49e900afB',
                            stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
                            logo: <HUSD />,
                        },
                        {
                            id: 0,
                            title: 'WAR-DAI',
                            symbol: 'LP',
                            address: '0xe46Eff65f94935501e343B2B56bA59400661eC10',
                            stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
                            logo: <HUSD />,
                        },
                    ]
                })
                break
            case 128:
                setStakingInfos({
                    staking1: [
                        {
                            id: 0,
                            title: 'HT POOL',
                            symbol: 'HT',
                            address: null,
                            stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
                            logo: <HT />,
                            multiple: <ONE />,
                        },
                        {
                            id: 1,
                            title: 'HUSD POOL',
                            symbol: 'DAI',
                            address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
                            stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
                            logo: <HUSD />,
                            multiple: <ONE />,
                        },
                        {
                            id: 0,
                            title: 'HBTC POOL',
                            symbol: 'HBTC',
                            address: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
                            stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
                            logo: <HBTC />,
                            multiple: <ONE />,
                        },
                        {
                            id: 0,
                            title: 'MDX POOL',
                            symbol: 'MDX',
                            address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
                            stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
                            logo: <MDX />,
                            multiple: <ONE />,
                        },
                        {
                            id: 0,
                            title: 'WAR POOL',
                            symbol: 'WAR',
                            address: '0xf45e4cc4DC165F9D30750F9F9c7f710288FD37b2',
                            stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
                            logo: <WAR />,
                            multiple: <ONE />,
                        },
                    ],
                    staking2: [

                    ],
                    staking3: [

                    ]
                })
                break
            default :
                setStakingInfos({staking1: [], staking2: [], staking3: []})
        }

    },[chainId])

    return  stakingInfos
}




