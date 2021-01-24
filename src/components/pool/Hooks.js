import React, {useState, useEffect} from 'react';
import StakingRewardsV2 from '../../web3/abi/StakingRewardsV2.json'
import {getContract, useActiveWeb3React} from "../../web3";
import {
    getBotAddress,
    getBotStakingAddress, getDEGOAddress, getDEGOStakingAddress, getDONUTAddress, getDONUTStakingAddress,
    getETHAddress,
    getETHStakingAddress, getMEMOAddress, getMEMOStakingAddress,
    getUSDTAddress, getUSDTStakingAddress
} from "../../web3/address";
import {getLeftTime} from '../../utils/time'
import ERC20 from "../../web3/abi/ERC20.json";
import BigNumber from "bignumber.js";

BigNumber.config({EXPONENTIAL_AT: [-20, 40]})

export const usePoolCard = (token) =>{
    const {account, active, library, chainId} = useActiveWeb3React()
    const [ total, setTotal] = useState()
    const [time, setTime] = useState()
    const [apy, setApy] = useState()
    const [totalRewards, setTotalRewards] = useState()



    useEffect(()=>{
        if(active){
            let contract;
            switch (token) {
                case 'ETH':
                     contract = getContract(library, StakingRewardsV2.abi, getETHStakingAddress(chainId))
                    try{
                        contract.methods.startAt().call().then(res =>{
                            console.log('bot startAt:',res)
                            setTime(res - 14*24*60*60*1000)
                        })
                    }catch (e) {
                        console.log('load startAt error:',e)

                    }
                    break
                case 'USDT':
                     contract = getContract(library, StakingRewardsV2.abi, getUSDTStakingAddress(chainId))
                    break
                case 'DEGO':
                     contract = getContract(library, StakingRewardsV2.abi, getDEGOStakingAddress(chainId))
                    break
                case 'MEME':
                     contract = getContract(library, StakingRewardsV2.abi, getMEMOStakingAddress(chainId))
                    break
                case 'DONUT':
                     contract = getContract(library, StakingRewardsV2.abi, getDONUTStakingAddress(chainId))
                    break
                case 'BOT':
                     contract = getContract(library, StakingRewardsV2.abi, getBotStakingAddress(chainId))
                    break
            }

            try{
                contract.methods.totalSupply().call().then(res =>{
                    console.log(`${token} totalSupply:`,res)
                    if(token === 'MEME'){
                        console.log('mene: token staked',res)
                        setTotal((new BigNumber(res).multipliedBy(10000000000)).toString())
                    }else {
                        setTotal(res)
                    }
                })
            }catch (e) {
                console.log('load totalSupply error:',e)

            }

            try{
                contract.methods.getTotalRewards().call().then(res =>{
                    console.log(`${token} total rewards:`,res)
                    setTotalRewards(res)
                })
            }catch (e) {
                console.log('load totalSupply error:',e)

            }


            try{
                contract.methods.startAt().call().then(res =>{
                    console.log('bot startAt:',res)
                    setTime(res)
                })
            }catch (e) {
                console.log('load startAt error:',e)

            }


            try{
                contract.methods.startAt().call().then(res =>{
                    console.log('bot apy:',res)
                    setApy(res)
                })
            }catch (e) {
                console.log('load apy error:',e)

            }

        }
    },[active, token])



    return {total, time, apy, totalRewards}
}


export const useStaking = (token) =>{
    const {account, active, library, chainId} = useActiveWeb3React()
    const [ balance, setBalance] = useState()
    const [ stakedAmount, setStakedAmount] = useState()
    const [ rewards, setRewards] = useState()
    const [ stakedTime, setStakedTime] = useState()
    const [ total, setTotal] = useState()

    async function query() {

        let contract;
        let tokenContract;
        switch (token) {
            case 'ETH':
                contract = getContract(library, StakingRewardsV2.abi, getETHStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getETHAddress(chainId))

                break
            case 'USDT':
                contract = getContract(library, StakingRewardsV2.abi, getUSDTStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getUSDTAddress(chainId))
                break
            case 'DEGO':
                contract = getContract(library, StakingRewardsV2.abi, getDEGOStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getDEGOAddress(chainId))
                break
            case 'MEME':
                contract = getContract(library, StakingRewardsV2.abi, getMEMOStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getMEMOAddress(chainId))
                break
            case 'DONUT':
                contract = getContract(library, StakingRewardsV2.abi, getDONUTStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getDONUTAddress(chainId))
                break
            case 'BOT':
                contract = getContract(library, StakingRewardsV2.abi, getBotStakingAddress(chainId))
                tokenContract = getContract(library, ERC20.abi, getBotAddress(chainId))
                break
        }

        try {
            tokenContract.methods.balanceOf(account).call().then(res =>{
                console.log('bot balanceOf:',res)
                if(token === 'MEME'){
                    setBalance(new BigNumber(res).multipliedBy(10000000000).toString())
                }else {
                    setBalance(res)
                }
            })
        }catch (e) {
            console.log('load events error:',e)
        }


        try {
            contract.events.Staked({}, {fromBlock: 0, toBlock: 'latest'}, (error, event)=>{
                if(!error){
                    contract.methods.balanceOf(account).call().then(res =>{
                        console.log('bot balanceOf:',res)
                        if(token === 'MEME'){
                            setStakedAmount(new BigNumber(res).multipliedBy(10000000000).toString())
                        }else {
                            setStakedAmount(res)
                        }
                    })
                }

            })
        }catch (e) {
            console.log('load events error:',e)
        }

        try{
            contract.methods.balanceOf(account).call().then(res =>{
                console.log('bot balanceOf:',res)
                if(token === 'MEME'){
                    setStakedAmount(new BigNumber(res).multipliedBy(10000000000).toString())
                }else {
                    setStakedAmount(res)
                }
            })
        }catch (e) {
            console.log('load totalSupply error:',e)
        }

        try{
            contract.methods.totalSupply().call().then().then(res =>{
                console.log('bot totalSupply:',res)
                setTotal(res)
            })
        }catch (e) {
            console.log('load totalSupply error:',e)

        }

        try{
            contract.methods.lastUpdateAt(account).call().then(res =>{
                console.log('bot lastUpdateAt:',res)
                if(res == 0){
                    setStakedTime(res)
                }else {
                    const time = res * 1000;
                    const now = new Date();
                    const lefttime = now - time;
                    let lefth = Math.floor(lefttime / 1000 / 60 /60);
                    console.log('bot staked time ',time, lefttime, lefth)
                    setStakedTime(lefth)
                }
            })
        }catch (e) {
            console.log('load startAt error:',e)

        }
    }

    async function queryRewards() {
        console.log('queryRewards',token)
        let contract;
        switch (token) {
            case 'ETH':
                contract = getContract(library, StakingRewardsV2.abi, getETHStakingAddress(chainId))
                break
            case 'USDT':
                contract = getContract(library, StakingRewardsV2.abi, getUSDTStakingAddress(chainId))
                break
            case 'DEGO':
                contract = getContract(library, StakingRewardsV2.abi, getDEGOStakingAddress(chainId))
                break
            case 'MEME':
                contract = getContract(library, StakingRewardsV2.abi, getMEMOStakingAddress(chainId))
                break
            case 'DONUT':
                contract = getContract(library, StakingRewardsV2.abi, getDONUTStakingAddress(chainId))
                break
            case 'BOT':
                contract = getContract(library, StakingRewardsV2.abi, getBotStakingAddress(chainId))
                break
        }
            const earned = await contract.methods.earned(account).call()
            const lastRewards = await contract.methods.rewards(account).call()
            console.log('all bot rewards', earned, lastRewards)
            setRewards(new BigNumber(earned).plus(lastRewards).toString())
    }

    useEffect(()=>{
        if(active){
            query()
            queryRewards()
        }
    },[active])

    return {balance, rewards, stakedAmount,stakedTime ,total}

}

export const useLeftTime = () => {
    const initRenderTime = {
        days: 0,
        hours: 0,
        minutes: 0,
    }

    const [time, setTime] = useState();
    const [leftTime, setLeftTime] = useState(initRenderTime);

    const calcuTime = ()=>{
        console.log('calcuTime', time)
        const formatTime = getLeftTime(time)
        if(!formatTime){
            setLeftTime(initRenderTime)
        }else {
            setLeftTime(formatTime)
        }
    }

    useEffect(()=>{
        calcuTime()
    }, [time])

    return {setTime, leftTime}
}
