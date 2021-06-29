import { useState, useEffect } from 'react'
import StakingRewardsV2 from '../web3/abi/StakingRewardsV2.json'
import ERC20 from '../web3/abi/ERC20.json'
import { useBlockHeight, useFarmInfo } from './pools/Hooks'
import { getContract, getWeb3, useActiveWeb3React } from '../web3'
import { getGLFStakingAddress } from '../web3/address'

export const useBalance = (address) => {
  const { account, active, library } = useActiveWeb3React()
  const [balance, setBalance] = useState(0)
  const blockHeight = useBlockHeight()
  // const pools = useFarmInfo()

  useEffect(() => {
    console.log(active)
    if (library && active) {
      try {
        if (address === '0x0') {
          // 0x0是HT
          const web3 = getWeb3(library)
          web3.eth.getBalance(account).then((balance) => {
            console.log(account, balance, 'balance')
            setBalance(balance)
          })
        } else {
          const contract = getContract(library, ERC20.abi, address)

          console.log('token address:', address)
          contract.methods
            .balanceOf(account)
            .call()
            .then((res) => {
              console.log('token totalSupply:', res)
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

export const useAllowance = (contract_address, address, owner_address) => {
  const { account, active, library } = useActiveWeb3React()
  const [allowance, setAllowance] = useState(0)
  const blockHeight = useBlockHeight()
  useEffect(() => {
    if (active) {
      try {
        const contract = getContract(library, ERC20.abi, contract_address)
        contract.methods
          .allowance(owner_address, address)
          .call()
          .then((res) => {
            console.log('token allowance:', res)
            setAllowance(res)
          })
      } catch (e) {
        console.log('load token allowance error:', e)
      }
    }
    return () => {}
  }, [account, library, active, blockHeight])
  return allowance
}
