import React, {useState, useEffect} from 'react';
import {getContract, useActiveWeb3React} from '../../web3';
import {WETH_ADDRESS} from '../../web3/address';
import StakingReward from '../../web3/abi/StakingReward.json';
import Web3 from 'web3';
import {ReactComponent as HUSD} from '../../assets/logo/HUSD.svg';
import {ReactComponent as HT} from '../../assets/logo/HT.svg';
import {ReactComponent as MDX} from '../../assets/logo/MDX.svg';
import {ReactComponent as WAR} from '../../assets/logo/war.svg';
import {ReactComponent as HBTC} from '../../assets/logo/HBTC.svg';
import {ReactComponent as HUSD_HT} from '../../assets/logo/HUSD-HT.svg';
import {ReactComponent as HUSD_WAR} from '../../assets/logo/HUSD-WAR.svg';
import {ReactComponent as HUSD_MDX} from '../../assets/logo/HUSD-MDX.svg';


import {ReactComponent as X1} from '../../assets/logo/1x.svg';
import {ReactComponent as X2_5} from '../../assets/logo/2.5X.svg';
import {ReactComponent as X2} from '../../assets/logo/2X.svg';
import {ReactComponent as X4} from '../../assets/logo/4X.svg';
import {ReactComponent as X5} from '../../assets/logo/5x.svg';
import {ReactComponent as X10} from '../../assets/logo/10X.svg';


export const useStakingInfo = (stakingInfo) => {
    const {account, library, chainId} = useActiveWeb3React();
    const [earned, setEarned] = useState();
    const [reward, setReward] = useState();
    const [staked, setStaked] = useState();
    const [earnedTotal, setEarnedTotal] = useState();
    const [balance, setBalance] = useState();

    console.log('address', stakingInfo);

    function queryStakingInfo() {
        const contract = getContract(
            library,
            StakingReward,
            stakingInfo.stakingAddress
        );

        try {
            contract.methods
                .earned(account)
                .call()
                .then((res) => {
                    console.log('earned', res);
                    setEarned(res);
                });
        } catch (e) {
            console.log('earned error', e);
        }

        try {
            contract.methods
                .rewards(account)
                .call()
                .then((res) => {
                    console.log('getReward', res);
                    setReward(res);
                });
        } catch (e) {
            console.log('getReward error', e);
        }

        try {
            contract.methods
                .balanceOf(account)
                .call()
                .then((res) => {
                    console.log('staked', res);
                    setStaked(res);
                });
        } catch (e) {
            console.log('staked error', e);
        }

        try {
            if (stakingInfo.address) {
                const tokenContract = getContract(
                    library,
                    StakingReward,
                    stakingInfo.address
                );
                tokenContract.methods
                    .balanceOf(account)
                    .call()
                    .then((res) => {
                        console.log('balanceOf', res, stakingInfo.address);
                        setBalance(res);
                    });
            } else {
                const web3 = new Web3(library.provider);
                web3.eth.getBalance(account).then((res) => {
                    console.log('eth balance', res);
                    setBalance(res);
                });
            }
        } catch (e) {
            console.log('balanceOf error', e);
        }

        try {
            if (stakingInfo.address) {
                const tokenContract = getContract(
                    library,
                    StakingReward,
                    stakingInfo.address
                );
                tokenContract.methods
                    .balanceOf(stakingInfo.stakingAddress)
                    .call()
                    .then((res) => {
                        console.log('earned total', res);
                        setEarnedTotal(res);
                    });
            } else {
                const tokenContract = getContract(
                    library,
                    StakingReward,
                    WETH_ADDRESS(chainId)
                );
                tokenContract.methods
                    .balanceOf(stakingInfo.stakingAddress)
                    .call()
                    .then((res) => {
                        console.log('earned total', res);
                        setEarnedTotal(res);
                    });
            }
        } catch (e) {
            console.log('balanceOf error', e);
        }
    }

    useEffect(() => {
        if (account) {
            queryStakingInfo();
        }
    }, [account]);

    return earned && reward && earnedTotal && balance && staked
        ? {earned, reward, earnedTotal, balance, staked}
        : null;
};

export const useStakingPoolInfo = () => {
    const [stakingInfos, setStakingInfos] = useState({
        staking1: [],
        staking2: [],
        staking3: [],
    });

    const {chainId} = useActiveWeb3React();

    useEffect(() => {
        console.log('chain id ---->',chainId)
        switch (chainId) {
            case 3:
                setStakingInfos({
                    staking1: [
                        {
                            id: 0,
                            title: 'HUSD POOL',
                            symbol: 'HUSD',
                            address:
                                '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
                            stakingAddress:
                                '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
                            logo: <HUSD/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 1,
                            title: 'HBTC POOL',
                            symbol: 'HBTC',
                            address:
                                '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
                            stakingAddress:
                                '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
                            logo: <HUSD/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 3,
                            title: 'MDX POOL',
                            symbol: 'MDX',
                            address:
                                '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
                            stakingAddress:
                                '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
                            logo: <MDX/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 4,
                            title: 'HT POOL',
                            symbol: 'HT',
                            address: null,
                            stakingAddress:
                                '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
                            logo: <HUSD/>,
                            multiple: <X2_5/>,
                        },
                    ],
                    staking2: [
                        {
                            id: 0,
                            title: 'WAR-HT POOL',
                            symbol: 'WAR-HT',
                            address:
                                '0x7Aa096b705FA16B595F307Ad647912077521d571',
                            stakingAddress:
                                '0x0509ff1628c90890e52874b3b8b8eeaa5a2af101',
                            logo: <HT/>,
                            multiple: <X10/>,
                        },
                        {
                            id: 1,
                            title: 'WAR-HUSD POOL',
                            symbol: 'WAR-HUSD',
                            address:
                                '0x1E214fd9348F6A35541C64CA668f25b0Cd59B2A6',
                            stakingAddress:
                                '0x8b8389d355eb7b2c6c86e1bb6614c0a4cb28743a',
                            logo: <HUSD/>,
                            multiple: <X4/>,
                        },
                        {
                            id: 2,
                            title: 'WAR-MDX POOL',
                            symbol: 'WAR-MDX',
                            address:
                                '0x9cd0C27f743a18Ce38acf28F051Baf09C94423Ff',
                            stakingAddress:
                                '0x608b1d5314b6bba219ccc73caa8831f240f1dfa2',
                            logo: <HUSD/>,
                            multiple: <X2/>,
                        },
                    ],
                    staking3: [
                        {
                            id: 0,
                            title: 'WAR POOL',
                            symbol: 'WAR',
                            address:
                                '0xf45e4cc4DC165F9D30750F9F9c7f710288FD37b2',
                            stakingAddress:
                                '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
                            logo: <WAR/>,
                            multiple: <X5/>,
                        },
                    ],
                });
                break
            case 128:
                setStakingInfos({
                    staking1: [
                        {
                            id: 0,
                            title: 'HUSD POOL',
                            symbol: 'HUSD',
                            decimals: 8,
                            address:
                                '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
                            stakingAddress:
                                '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
                            logo: <HUSD/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 1,
                            title: 'HBTC POOL',
                            symbol: 'HBTC',
                            address:
                                '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
                            stakingAddress:
                                '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
                            logo: <HUSD/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 3,
                            title: 'MDX POOL',
                            symbol: 'MDX',
                            address:
                                '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
                            stakingAddress:
                                '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
                            logo: <MDX/>,
                            multiple: <X1/>,
                        },
                        {
                            id: 4,
                            title: 'HT POOL',
                            symbol: 'HT',
                            address: null,
                            stakingAddress:
                                '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
                            logo: <HUSD/>,
                            multiple: <X2_5/>,
                        },
                    ],
                    staking2: [
                        {
                            id: 0,
                            title: 'WAR-HT POOL',
                            symbol: 'WAR-HT',
                            address:
                                '0x0509ff1628c90890e52874b3b8b8eeaa5a2af101',
                            stakingAddress:
                                '0x7Aa096b705FA16B595F307Ad647912077521d571',
                            logo: <HUSD_HT/>,
                            multiple: <X10/>,
                        },
                        {
                            id: 1,
                            title: 'WAR-HUSD POOL',
                            symbol: 'WAR-HUSD',
                            address:
                                '0x8b8389d355eb7b2c6c86e1bb6614c0a4cb28743a',
                            stakingAddress:
                                '0x1E214fd9348F6A35541C64CA668f25b0Cd59B2A6',
                            logo: <HUSD_WAR/>,
                            multiple: <X4/>,
                        },
                        {
                            id: 2,
                            title: 'WAR-MDX POOL',
                            symbol: 'WAR-MDX ',
                            address:
                                '0x608b1d5314b6bba219ccc73caa8831f240f1dfa2',
                            stakingAddress:
                                '0x9cd0C27f743a18Ce38acf28F051Baf09C94423Ff',
                            logo: <HUSD_MDX/>,
                            multiple: <X2/>,
                        },
                    ],
                    staking3: [
                        {
                            id: 0,
                            title: 'WAR POOL',
                            symbol: 'WAR',
                            address:
                                '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
                            stakingAddress:
                                '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
                            logo: <WAR/>,
                            multiple: <X5/>,
                        },
                    ],
                });
                break;
            default:
                setStakingInfos({staking1: [], staking2: [], staking3: []});
        }
    }, [chainId]);

    return stakingInfos;
};
