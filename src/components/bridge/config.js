import {ChainId, WAR_ADDRESS} from "../../web3/address";
import ChainSwapAbi from "../../web3/abi/ChainSwap.json";
import BurnSwapAbi from "../../web3/abi/BurnSwap.json";
import {BRIDGE_TYPE_BURN, BRIDGE_TYPE_NORMAL} from "./bridgeCard";

export const bridgeCardConfig = (fromChainId, toChainId, from_asset_address) => {
    const config = [
        {
            fromChainId: ChainId.BSC,
            toChainId: ChainId.HECO,
            toChainName: "Heco",
            toFullName: '',
            type: BRIDGE_TYPE_NORMAL,
            isNeedApprove: false,
            stackContract: {
                address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 燃烧合约地址
                abi: ChainSwapAbi,
                method: "send"
            },
            chainswapContract: {
                address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
                abi: ChainSwapAbi,
            },
            fromAsset: {
                address: WAR_ADDRESS[ChainId.BSC] // WAR Token合约地址
            },
            addAsset: { // 钱包添加Token配置
                name: "WAR",
                address: WAR_ADDRESS[ChainId.HECO],
                assetsText: 'WAR(Heco)'
            }
        },
        {
            fromChainId: ChainId.HECO,
            toChainId: ChainId.BSC,
            toChainName: "BSC",
            toFullName: 'Binance Smart Chain',
            isNeedApprove: false,
            type: BRIDGE_TYPE_NORMAL,
            stackContract: {
                address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 燃烧合约地址
                abi: ChainSwapAbi,
                method: "send"
            },
            chainswapContract: {
                address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
                abi: ChainSwapAbi,
            },
            fromAsset: {
                address: WAR_ADDRESS[ChainId.HECO] // WAR Token合约地址
            },
            addAsset: { // 钱包添加Token配置
                name: "WAR",
                address: WAR_ADDRESS[ChainId.BSC],
                assetsText: 'WAR(BSC)'
            }
        },
        {
            fromChainId: ChainId.HECO,
            toChainId: ChainId.MATIC,
            toChainName: "MATIC",
            toFullName: '',
            type: BRIDGE_TYPE_BURN,
            isNeedApprove: true,
            stackContract: {
                address: '0x6Bab2711Ca22fE7395811022F92bB037cd4af7bc', // 燃烧合约地址
                abi: BurnSwapAbi,
                method: "swapAndSend"
            },
            chainswapContract: {
                address: '0x81d82a35253B982E755c4D7d6AADB6463305B188',
                abi: ChainSwapAbi,
            },
            fromAsset: {
                address: WAR_ADDRESS[ChainId.HECO] // WAR Token合约地址
            },
            addAsset: { // 钱包添加Token配置
                name: "RAW",
                address: WAR_ADDRESS[ChainId.MATIC], // RAW地址
                assetsText: 'RAW(Matic)'
            }
        },
        {
            fromChainId: ChainId.BSC,
            toChainId: ChainId.MATIC,
            toChainName: "MATIC",
            toFullName: '',
            type: BRIDGE_TYPE_BURN,
            isNeedApprove: true,
            stackContract: {
                address: '0x6Bab2711Ca22fE7395811022F92bB037cd4af7bc', // 燃烧合约地址
                abi: BurnSwapAbi,
                method: "swapAndSend"
            },
            chainswapContract: {
                address: '0x81d82a35253B982E755c4D7d6AADB6463305B188',
                abi: ChainSwapAbi,
            },
            fromAsset: {
                address: WAR_ADDRESS[ChainId.HECO] // WAR Token合约地址
            },
            addAsset: { // 钱包添加Token配置
                name: "RAW",
                address: WAR_ADDRESS[ChainId.MATIC], // RAW地址
                assetsText: 'RAW(Matic)'
            }
        }
    ]

    return config.find(o => o.fromChainId == fromChainId && o.toChainId == toChainId)
}