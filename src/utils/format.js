import BigNumber from 'bignumber.js'
import Web3 from 'web3'

BigNumber.config({EXPONENTIAL_AT: [-20, 40]})

export const formatAddress = (address)=>{
    return  address.slice(0, 6) + '...' + address.slice(-3)
}

export const formatAmount = (amount)=>{
    return new BigNumber(new BigNumber(Web3.utils.fromWei(new BigNumber(amount).toString())).toFixed(6)).toNumber()
}

export const weiPlus = (value1,  value2)=>{
    console.log('weiPlus',value1, value2)
    return new BigNumber(new BigNumber(value1? value1: 0).plus(new BigNumber(value2? value2: 0)).toFixed(6)).toNumber().toString()
}


export const weiDiv = (value1, value2) => {
    if(value1 == 0 || value2 == 0){
        return  0
    }
    console.log('weiDiv',value1, value2)
    return new BigNumber(new BigNumber(value1).dividedBy(new BigNumber(value2)).toFixed(6)).multipliedBy(100).toString()
};
