import { useState, useEffect } from 'react'
import StakingRewardsV2 from '../web3/abi/StakingRewardsV2.json'
import ERC20 from '../web3/abi/ERC20.json'
import { useBlockHeight, useFarmInfo } from './pools/Hooks'
import { getContract, getWeb3, useActiveWeb3React } from '../web3'
import {ChainId, getGLFStakingAddress, RPC_URLS, WAR_ADDRESS} from '../web3/address'
import Web3 from "web3";


const createContractERC20 = (chainId, address) => {

  var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(chainId)))
  return  new web3.eth.Contract(ERC20.abi, address)//WAR_ADDRESS(chainId)

}

export const useBalance = (address, networkId=ChainId.HECO) => {
  const { account, active, library } = useActiveWeb3React()
  const [balance, setBalance] = useState(0)
  const blockHeight = useBlockHeight()
  // const pools = useFarmInfo()

  useEffect(() => {
    if (library && active) {
      try {
        // console.log('request___6')
        if (address === '0x0') {
          // 0x0是HT
          const web3 = getWeb3(library)

          web3.eth.getBalance(account).then((balance) => {
            setBalance(balance)
          })
        } else {
          const contract = createContractERC20(networkId, address)
          // const contract = getContract(library, ERC20.abi, address)
          contract.methods
              .balanceOf(account)
              .call()
              .then((res) => {
                setBalance(res)
              })
          contract.methods
            .balanceOf(account)
            .call()
            .then((res) => {
              setBalance(res)
            })
        }
      } catch (e) {
        console.log('load token balance error:', e)
      }
    }
  }, [active, blockHeight])

  return { balance }
}

export const useHTBalance = () => {
  const { account, active, library } = useActiveWeb3React()
  // const [blockNumber, setBlockNumber] = useState(0)
  const blockHeight = useBlockHeight()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // const updateBlockNumber = (blockNumber) => {
    //   console.log('block update')
    //   setBlockNumber(blockNumber)
    // }

    // if (library) {
    //   library.once('block', updateBlockNumber)

    //   const web3 = getWeb3(library)
    //   web3.eth.getBalance(account).then((balance) => {
    //     setBalance(balance)
    //   })
    // }

    if (library && active) {

      // console.log('request___7')
      const web3 = getWeb3(library)
      web3.eth.getBalance(account).then((balance) => {
        setBalance(balance)
      })
    }
    return () => {
      // library && library.off('block', updateBlockNumber)
    }
  }, [active, blockHeight])

  return { balance }
}

export const useAllowance = (contract_address, address, owner_address, _chainId) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const [allowance, setAllowance] = useState(0)
  const blockHeight = useBlockHeight()
  useEffect(() => {
    if (!_chainId && !chainId){
      return () => {}
    }
    const contract = createContractERC20(_chainId || chainId, contract_address)
    try {
      // const contract = getContract(library, ERC20.abi, contract_address)

      // console.log('request___8')
      contract.methods
        .allowance(owner_address, address)
        .call()
        .then((res) => {
          setAllowance(res)
        })
    } catch (e) {
      console.log('load token allowance error:', e)
    }
    return () => {}
  }, [account, library, active, blockHeight])
  return allowance
}
