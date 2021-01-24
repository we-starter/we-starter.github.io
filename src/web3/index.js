import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import Web3 from "web3";

export function getContract(library, abi, address) {
    const web3 = new Web3(library.provider);
    return  new web3.eth.Contract(abi, address)
}

export const useActiveWeb3React =() => {
    const context = useWeb3ReactCore()
    const contextNetwork = useWeb3ReactCore()
    return context.active ? context : contextNetwork
}
