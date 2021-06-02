import Offering from '../web3/abi/Offering.json'
import Starter from '../web3/abi/Starter.json'
import StarterV2 from '../web3/abi/StarterV2.json'
import StarterV3 from '../web3/abi/StarterV3.json'
import OfferingV2 from '../web3/abi/OfferingV2.json'

export default [
  {
    name: 'MATTER',
    address: '0x4F7d4aCF1A2d92C5b64a7365e3cD2185c91F9e40',
    abi: Offering,
    start_at: '1614432600',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      symbol: 'HT',
      decimal: 18,
    },
    icon: '',
    type: 1, // 非1 则为公有池，为1 则为私有池
    isPrivate: true,
    underlying: {
      address: '0x1C9491865a1DE77C5b6e19d2E6a5F1D7a6F2b25F',
      decimal: 18,
      symbol: 'MATTER',
      name: 'MATTER ',
      total_supply: '100,000,000.00',
      holders: '-',
      transfers: '-',
    },
    amount: '250000',
    pool_info: {
      token_distribution: 'February 27th 2021, 9:30PM SGT',
      min_allocation: '0',
      max_allocation: '6.6 HT',
      min_swap_level: '833 HT',
    },
    website: 'https://antimatter.finance',
    white_paper: '-',
    twitter: 'https://twitter.com/antimatterdefi',
    Telegram_Channel: 'https://t.me/antimatterchat',
    Github: 'https://github.com/antimatter-finance',
    yuque: '-',
    progress: 1,
    status: 3, // 状态
    ratio: '1MATTER=0.003HT', // 比例
    time: '1614435600', // 结算时间点
    purchasedCurrencyOf: 0, // 已购买币种
    totalPurchasedAmount: '833333330000000000000', // 总购买数量
    totalPurchasedUnderlying: '0', // 总购买金额
    totalPurchasedCurrency: '0', // 总购买币种
    is_flash: false,
    link_url: '',
    project_introduction: '',
    duration: '308', // 完成时间
    totalApplicants: '33000', // 申请总人数
    winningRate: '0.68', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'dFuture',
    address: '0xd9019793189E12ac91892b4D4622E3A315a289Fc',
    abi: Starter,
    start_at: '1614690000',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x42712dF5009c20fee340B245b510c0395896cF6e',
      decimal: 18,
      symbol: 'DFT',
      name: 'dFuture',
      total_supply: '400,000,000.00',
      holders: '-',
      transfers: '-',
    },
    amount: '166667',
    pool_info: {
      token_distribution: 'March 2th 2021, 9:00PM SGT',
      min_allocation: '-',
      max_allocation: '',
      min_swap_level: '50000 USDT',
    },
    website: 'https://www.dfuture.com',
    white_paper: '-',
    twitter: 'https://twitter.com/dFuture_finance',
    Telegram_Channel: 'https://t.me/dfutureglobal',
    Github: '-',
    yuque: '-',
    progress: 1038.92,
    status: 3,
    ratio: '1DFT=0.3USDT',
    time: '1614693600',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '50000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://heco.dfuture.com/home',
    project_introduction:
      'dFuture is an experimental derivative trading protocol initiated and incubated by Mix Lab of the Mix group. As a decentralized derivatives exchange, dFuture is based on external quotation, enabling traders to execute long / short trading with leverage safely and efficiently at better price. Compared to the centralized exchanges, traders will also enjoy far better trading depth. Meanwhile LP (liquidity provider) only needs to stake single settlement currency (currently USDT), which can obtain stable, risk-free, high return without any impermanent loss.',
    duration: '26', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$51,940,000', // 参与资金规模
  },
  {
    name: 'FIX',
    address: '0x24DE0C0F84Ca06D9A8225e031D294dfF405bC6aB',
    abi: Offering,
    start_at: '1615377600',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0xDe9495De889996404b14dDBf05f66Db7401F0733',
      decimal: 18,
      symbol: 'FIX',
      name: 'FIX',
      total_supply: '10,000,000.00',
      holders: '-',
      transfers: '-',
    },
    amount: '6000',
    pool_info: {
      token_distribution: 'March 10th 2021, 8:00PM SGT',
      min_allocation: '0',
      max_allocation: '18.54 HT',
      min_swap_level: '3708 HT',
    },
    website: 'https://www.fixed.finance',
    white_paper: '-',
    twitter: 'https://twitter.com/ProtocolFixed',
    Telegram_Channel: 'https://t.me/FixedRateProtocol',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1FIX=0.618HT', // 兑换比例需要确认
    time: '1615384800',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '3708280000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://fixed.finance/home', // 跳转外链接
    project_introduction:
      'Fixed-Rate Protocol (official Site：fixed.finance) is the first and the best stable yield investment protocol on HECO. The all-time monitoring of on-chain data and the intelligent aggregating strategy of savings provide the various investment options for distinctive users along with balancing risks and earnings mechanically. By combining liquidity mining, NFT, and community governance(DAO), FIX Token endowed with intrinsic value which will support Fixed-Rate Protocol to become one of the most stable and the most fruitful application among HECO.',
    duration: '33', // 完成时间
    totalApplicants: '8000', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'FIX',
    address: '0x1bCaC989BA76C293f56b2Ae7490d5375977F6eb4',
    abi: Starter,
    start_at: '1615381200',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0xDe9495De889996404b14dDBf05f66Db7401F0733',
      decimal: 18,
      symbol: 'FIX',
      name: 'FIX',
      total_supply: '10,000,000.00',
      holders: '-',
      transfers: '-',
    },
    amount: '4000',
    pool_info: {
      token_distribution: 'March 10th 2021, 8:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '2472 HT',
    },
    website: 'https://www.fixed.finance',
    white_paper: '-',
    twitter: 'https://twitter.com/ProtocolFixed',
    Telegram_Channel: 'https://t.me/FixedRateProtocol',
    Github: '-',
    yuque: '-',
    progress: 1845.59,
    status: 3,
    ratio: '1FIX=0.618HT',
    time: '1615384800',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '2472000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://fixed.finance/home', // 跳转外链接
    project_introduction:
      'Fixed-Rate Protocol (official Site：fixed.finance) is the first and the best stable yield investment protocol on HECO. The all-time monitoring of on-chain data and the intelligent aggregating strategy of savings provide the various investment options for distinctive users along with balancing risks and earnings mechanically. By combining liquidity mining, NFT, and community governance(DAO), FIX Token endowed with intrinsic value which will support Fixed-Rate Protocol to become one of the most stable and the most fruitful application among HECO.',
    duration: '9', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$76,680,000', // 参与资金规模
  },
  {
    name: 'DORA',
    address: '0x637567F333f3C13Ee8d3814563476F848De86A39',
    abi: Offering,
    start_at: '1616392800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x7Ab088FedAE4FA8ada4Df638c07CEF6C23Aff002',
      decimal: 18,
      symbol: 'DORA',
      name: 'DORA',
      total_supply: '10,000,000.00',
      holders: '-',
      transfers: '-',
    },
    amount: '5000',
    pool_info: {
      token_distribution: 'March 22th 2021, 2:00PM SGT',
      min_allocation: '0',
      max_allocation: '7.14 HT',
      min_swap_level: '3571 HT',
    },
    website: 'https://dorafactory.org',
    white_paper: '-',
    twitter: 'https://twitter.com/DoraFactory',
    Telegram_Channel: 'https://t.me/dorafactory',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1DORA=0.714HT',
    time: '1616587200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '3571428571000000000000',
    totalPurchasedUnderlying: '4999989419600000000000',
    totalPurchasedCurrency: '3571421014000000000000',
    is_flash: false,
    link_url: 'https://dorafactory.org', // 跳转外链接
    project_introduction:
      'Fixed-Rate Protocol (official Site：fixed.finance) is the first and the best stable yield investment protocol on HECO. The all-time monitoring of on-chain data and the intelligent aggregating strategy of savings provide the various investment options for distinctive users along with balancing risks and earnings mechanically. By combining liquidity mining, NFT, and community governance(DAO), FIX Token endowed with intrinsic value which will support Fixed-Rate Protocol to become one of the most stable and the most fruitful application among HECO.',
    duration: '63', // 完成时间
    totalApplicants: '100000', // 申请总人数
    winningRate: '0.9', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'Cook',
    address: '0x746ED583756026c5340Fdc8026D2EA7E44b93De0',
    abi: OfferingV2,
    start_at: '1617199200',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x74189862B069e2Be5f7c8E6ff08eA8E1B1948519', // 地址有问题
      decimal: 18,
      symbol: 'COOK',
      name: 'COOK',
      total_supply: '10,000,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '2000000',
    pool_info: {
      token_distribution: 'March 31th 2021, 10:00PM SGT',
      min_allocation: '0',
      max_allocation: '200 USDT',
      min_swap_level: '60000 USDT',
    },
    website: 'https://www.cook.finance',
    white_paper: '-',
    twitter: 'https://twitter.com/cook_finance',
    Telegram_Channel: 'https://t.me/cook_english',
    Github: 'https://github.com/CookFinance',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1COOK=0.03USDT', // 兑换比例需要确认
    time: '1617208320',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '60000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.cook.finance', // 跳转外链接
    project_introduction:
      'Cook Protocol is a completely decentralized asset management platform in the DeFi space built on top of the Ethereum blockchain.',
    duration: '324', // 完成时间
    totalApplicants: '30000', // 申请总人数
    winningRate: '1.67', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'Cook',
    address: '0xFC5405759Fb8dDB3f90c2d3d238ea50eEbE5618B',
    abi: StarterV2,
    start_at: '1617200400',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x74189862B069e2Be5f7c8E6ff08eA8E1B1948519',
      decimal: 18,
      symbol: 'COOK',
      name: 'COOK',
      total_supply: '10,000,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '1333333.33',
    pool_info: {
      token_distribution: 'March 31th 2021, 10:20PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '40000 USDT',
    },
    website: 'https://www.cook.finance',
    white_paper: '-',
    twitter: 'https://twitter.com/cook_finance',
    Telegram_Channel: 'https://t.me/cook_english',
    Github: 'https://github.com/CookFinance',
    yuque: '-',
    progress: 604.61,
    status: 3,
    ratio: '1COOK=0.03USDT',
    time: '1617208320',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '40000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.cook.finance', // 跳转外链接
    project_introduction:
      'Cook Protocol is a completely decentralized asset management platform in the DeFi space built on top of the Ethereum blockchain.',
    duration: '22', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$21,480,000', // 参与资金规模
  },
  {
    name: 'ChainSwap',
    address: '0x543A2aE552D993342A92e87AeFc966B69534A798', // 超募合约地址
    abi: StarterV3,
    start_at: '1619092800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x3B73c1B2ea59835cbfcADade5462b6aB630D9890',
      decimal: 18,
      symbol: 'TOKEN',
      name: 'TOKEN',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '100000',
    pool_info: {
      token_distribution: 'April 22th 2021, 8:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '30,000 USDT',
    },
    website: 'https://www.chainswap.com',
    white_paper: '-',
    twitter: 'https://twitter.com/chain_swap',
    Telegram_Channel: 'https://t.me/chainswap',
    Github: 'https://github.com/chainswap',
    yuque: '-',
    progress: 3850.51,
    status: 3,
    ratio: '1TOKEN=0.3USDT',
    time: '1619182800',
    timeClose: '1619095500',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.chainswap.com', // 跳转外链接
    project_introduction: 'Chainswap is the hub for all smart chains.',
    duration: '24', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$115,515,300', // 参与资金规模
  },
  {
    name: 'WAR(Influencer)',
    address: '0x2E9d797e1A0342630938aE28B6A32DA7D04B525B',
    abi: OfferingV2,
    start_at: '1619697600',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 地址有问题
      decimal: 18,
      symbol: 'WAR',
      name: 'WAR',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '120000',
    pool_info: {
      token_distribution: 'April 29th 2021, 8:00PM SGT',
      min_allocation: '0',
      max_allocation: '16 HT',
      min_swap_level: '1,600 HT',
    },
    website: 'https://www.westarter.org',
    white_paper: '-',
    twitter: 'https://twitter.com/westarter_org',
    Telegram_Channel: 'https://t.me/westarter_official',
    Github: 'https://github.com/we-starter',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1WAR=0.0133HT',
    time: '1619701200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '1600000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.westarter.org', // 跳转外链接
    project_introduction:
      'WeStarter is a cross-chain token initial swap platform which based on HECO network. Through the fluency of the product and sufficient industry resources, it carries the requirement of funds and resources for a variety of asset types. With the role of gatekeeper, through the decentralized incentive and governance mechanism of tokens, to achieve the goal of selecting high-quality assets.',
    duration: '1350', // 完成时间
    totalApplicants: '10000', // 申请总人数
    winningRate: '5', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'WAR',
    address: '0x77968c29755794ABABbD58661E9Ee55A1c900e1F',
    abi: OfferingV2,
    start_at: '1619697600',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 地址有问题
      decimal: 18,
      symbol: 'WAR',
      name: 'WAR',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '120000',
    pool_info: {
      token_distribution: 'April 29th 2021, 8:00PM SGT',
      min_allocation: '0',
      max_allocation: '5.33 HT',
      min_swap_level: '1,600 HT',
    },
    website: 'https://www.westarter.org',
    white_paper: '-',
    twitter: 'https://twitter.com/westarter_org',
    Telegram_Channel: 'https://t.me/westarter_official',
    Github: 'https://github.com/we-starter',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1WAR=0.0133HT', // 兑换比例需要确认
    time: '1619701200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '1600000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.westarter.org', // 跳转外链接
    project_introduction:
      'WeStarter is a cross-chain token initial swap platform which based on HECO network. Through the fluency of the product and sufficient industry resources, it carries the requirement of funds and resources for a variety of asset types. With the role of gatekeeper, through the decentralized incentive and governance mechanism of tokens, to achieve the goal of selecting high-quality assets.',
    duration: '621', // 完成时间
    totalApplicants: '10000', // 申请总人数
    winningRate: '5', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'WAR',
    address: '0xC36C08879EfbAdDbEbaF8D1EF878E660476E3905',
    abi: StarterV2,
    start_at: '1619698800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 地址有问题
      decimal: 18,
      symbol: 'WAR',
      name: 'WAR',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '120000',
    pool_info: {
      token_distribution: 'April 29th 2021, 8:20PM SGT',
      min_allocation: '',
      max_allocation: '',
      min_swap_level: '1,600 HT',
    },
    website: 'https://www.westarter.org',
    white_paper: '-',
    twitter: 'https://twitter.com/westarter_org',
    Telegram_Channel: 'https://t.me/westarter_official',
    Github: 'https://github.com/we-starter',
    yuque: '-',
    progress: 7771.49,
    status: 3,
    ratio: '1WAR=0.0133HT',
    time: '1619701200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '1600000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.westarter.org', // 跳转外链接
    project_introduction:
      'WeStarter is a cross-chain token initial swap platform which based on HECO network. Through the fluency of the product and sufficient industry resources, it carries the requirement of funds and resources for a variety of asset types. With the role of gatekeeper, through the decentralized incentive and governance mechanism of tokens, to achieve the goal of selecting high-quality assets.',
    duration: '0.1', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$233,144,700', // 参与资金规模
  },
  {
    name: 'BLACK',
    address: '0x60c393C658904B102C12041055fcA36B5C72e038',
    abi: OfferingV2,
    start_at: '1619611200',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0xd714d91A169127e11D8FAb3665d72E8b7ef9Dbe2', // 地址有问题
      decimal: 18,
      symbol: 'BLACK',
      name: 'BLACK',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '600000',
    pool_info: {
      token_distribution: 'April 28th 2021, 8:00PM SGT',
      min_allocation: '0',
      max_allocation: '5.33 HT',
      min_swap_level: '1,600 HT',
    },
    website: 'https://www.blackhole.black',
    white_paper: '-',
    twitter: 'https://twitter.com/BlackHoleBurn',
    Telegram_Channel: 'https://t.me/BlackholeProtocolOfficial',
    Github: 'https://github.com/black-hole-finance',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1BLACK=0.0026HT', // 兑换比例需要确认
    time: '1619701200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '1600000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.blackhole.black', // 跳转外链接
    project_introduction:
      'BlackHole is an approval-free decentralized & cross-chain burning protocol, innovator of perpetual deflationary blockchain ecosystem.',
    duration: '1950', // 完成时间
    totalApplicants: '8000', // 申请总人数
    winningRate: '6.25', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'BLACK',
    address: '0xB616eBb93262B51143962e6826Ec0552915A13c2',
    abi: StarterV2,
    start_at: '1619611200',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: ' 0xd714d91A169127e11D8FAb3665d72E8b7ef9Dbe2', // 地址有问题
      decimal: 18,
      symbol: 'BLACK',
      name: 'BLACK',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '200000',
    pool_info: {
      token_distribution: 'April 28th 2021, 8:00PM SGT',
      min_allocation: '',
      max_allocation: '',
      min_swap_level: '540 HT',
    },
    website: 'https://www.blackhole.black',
    white_paper: '-',
    twitter: 'https://twitter.com/BlackHoleBurn',
    Telegram_Channel: 'https://t.me/BlackholeProtocolOfficial',
    Github: 'https://github.com/black-hole-finance',
    yuque: '-',
    progress: 13082.02,
    status: 3,
    ratio: '1BLACK=0.0027HT',
    time: '1619701200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '540000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.blackhole.black', // 跳转外链接
    project_introduction:
      'BlackHole is an approval-free decentralized & cross-chain burning protocol, innovator of perpetual deflationary blockchain ecosystem.',
    duration: '15', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$130,820,200', // 参与资金规模
  },
  {
    name: 'Lever',
    address: '0xa09dcb3b2066da2f17e2a1657c347a34038b8946',
    abi: StarterV3,
    start_at: '1620054000',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: ' 0xbc194e6f748a222754C3E8b9946922c09E7d4e91', // 地址有问题
      decimal: 18,
      symbol: 'LEV',
      name: 'LEV',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '60000',
    pool_info: {
      token_distribution: 'May 3th 2021, 11:00PM SGT',
      min_allocation: '',
      max_allocation: '',
      min_swap_level: '30,000 USDT',
    },
    website: 'https://www.lever.network/',
    white_paper: '-',
    twitter: 'https://twitter.com/LeverNetwork',
    Telegram_Channel: 'https://t.me/LeverNetwork',
    Github: 'https://github.com/levernetwork',
    yuque: '-',
    progress: 6114.57,
    status: 3,
    ratio: '1LEV=0.5USDT',
    time: '1620486000',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '366874480000000000000000000',
    totalPurchasedCurrency: '183437240275702999999549440',
    is_flash: false,
    link_url: 'https://www.lever.network', // 跳转外链接
    project_introduction:
      'The #1 AMM-Based Decentralized Margin Trading Platform.',
    duration: '39', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$183,437,100', // 参与资金规模
  },
  {
    name: 'YFX.COM',
    address: '0xD795d35875089514818AF643558d6f354C8803A7',
    abi: OfferingV2,
    start_at: '1620295200',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: false,
    underlying: {
      address: '0xF55a93b613D172b86c2Ba3981a849DaE2aeCDE2f', // 地址有问题
      decimal: 18,
      symbol: 'YFX',
      name: 'YFX',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '62500',
    pool_info: {
      token_distribution: 'May 6th 2021, 6:00PM SGT',
      min_allocation: '0',
      max_allocation: '8 HT',
      min_swap_level: '2,000 HT',
    },
    website: 'https://www.yfx.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/YFX_Defi',
    Telegram_Channel: 'https://t.me/YFX_EN',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1YFX=0.032HT',
    defaultRatio: '31250000000000000000',
    time: '1620554400',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '2000000000000000000000',
    totalPurchasedUnderlying: '62498920687500000000000',
    totalPurchasedCurrency: '1999965462000000000000',
    is_flash: false,
    link_url: 'https://www.yfx.com/', // 跳转外链接
    project_introduction: 'Decentralized Futures Trading Platform YFX.COM',
    duration: '84', // 完成时间
    totalApplicants: '8000', // 申请总人数
    winningRate: '5', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'YFX.COM',
    address: '0x4c1A48cB2e3AEEf598f3a461160ec24056e52911',
    abi: StarterV3,
    start_at: '1620296400',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0xF55a93b613D172b86c2Ba3981a849DaE2aeCDE2f', // 地址有问题
      decimal: 18,
      symbol: 'YFX',
      name: 'YFX',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '62500',
    pool_info: {
      token_distribution: 'May 6th 2021, 6:20PM SGT',
      min_allocation: '',
      max_allocation: '-',
      min_swap_level: '2,000 HT',
    },
    website: 'https://www.yfx.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/YFX_Defi',
    Telegram_Channel: 'https://t.me/YFX_EN',
    Github: '-',
    yuque: '-',
    progress: 2764.43,
    status: 3,
    ratio: '1YFX=0.032HT',
    time: '1620554400',
    defaultRatio: '31250000000000000000',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '2000000000000000000000',
    totalPurchasedUnderlying: '172777089000000000000000000',
    totalPurchasedCurrency: '5528866854336999999909888',
    is_flash: false,
    link_url: 'https://www.yfx.com/', // 跳转外链接
    project_introduction: 'Decentralized Futures Trading Platform YFX.COM',
    duration: '15', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$138,221,500', // 参与资金规模
  },
  {
    name: 'O3 Swap',
    address: '0x9210D73229b56786221Ab9e55Bd077BE4910BeA7', // 超募合约地址
    abi: StarterV3,
    start_at: '1620822000', //1620820800
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0xEe9801669C6138E84bD50dEB500827b776777d28',
      decimal: 18,
      symbol: 'O3',
      name: 'O3',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '20000',
    pool_info: {
      token_distribution: 'May 14th 2021, 10:15PM SGT',
      min_allocation: '',
      max_allocation: '-',
      min_swap_level: '20,000 USDT',
    },
    website: 'https://o3swap.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/O3_Labs',
    Telegram_Channel: 'https://t.me/O3LabsOfficial',
    Github: 'https://github.com/O3Labs',
    yuque: '-',
    progress: 6658.68,
    status: 0,
    ratio: '1O3=1USDT',
    time: '1621001700',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '20000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://o3swap.com/', // 跳转外链接
    project_introduction:
      'O3 Swap, a proprietary cross-chain aggregation protocol',
    duration: '31', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$133,173,600', // 参与资金规模
  },
  {
    name: 'O3 Swap',
    address: '0x126a7f7071eD74Dc3495c3EB9b6a472BC446f2D2', // 超募合约地址
    abi: OfferingV2,
    start_at: '1620820800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 1,
    isPrivate: false,
    underlying: {
      address: '0xEe9801669C6138E84bD50dEB500827b776777d28',
      decimal: 18,
      symbol: 'O3',
      name: 'O3',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '30000',
    pool_info: {
      token_distribution: 'May 14th 2021, 10:15PM SGT',
      min_allocation: '0',
      max_allocation: '100 USDT',
      min_swap_level: '30,000 USDT',
    },
    website: 'https://o3swap.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/O3_Labs',
    Telegram_Channel: 'https://t.me/O3LabsOfficial',
    Github: 'https://github.com/O3Labs',
    yuque: '-',
    progress: 1,
    status: 0,
    ratio: '1O3=1USDT',
    time: '1621001700',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://o3swap.com/', // 跳转外链接
    project_introduction:
      'O3 Swap, a proprietary cross-chain aggregation protocol',
    duration: '790', // 完成时间
    totalApplicants: '8000', // 申请总人数
    winningRate: '6.25', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'CORA',
    address: '0xe10d741127da509dD965C31B55b524Aed76E6EDD',
    abi: OfferingV2,
    start_at: '1621083600',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x0962828e4b9af3336e5af5f696bc2f3c2cc6abb4', // 地址有问题
      decimal: 18,
      symbol: 'CORA',
      name: 'CORA',
      total_supply: '10,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '2400', // token 总额
    pool_info: {
      token_distribution: 'May 15th 2021, 9:00PM SGT',
      min_allocation: '0',
      max_allocation: '100 USDT',
      min_swap_level: '30,000 USDT',
    },
    website: 'https://corra.finance/',
    white_paper: '-',
    twitter: 'https://twitter.com/CorraFinance',
    Telegram_Channel: 'https://t.me/corrafinance',
    Github: '',
    yuque: '-',
    progress: 1,
    status: 0,
    ratio: '1CORA=12.5USDT', // 兑换比例需要确认
    time: '1621306800',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://corra.finance/', // 跳转外链接
    project_introduction:
      'Corra.finance is a plug-and-play platform that enables the monetization of digital content using NFT technology.',
    duration: '62', // 完成时间
    totalApplicants: '8000', // 申请总人数
    winningRate: '6.25', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'COW',
    address: '0xC0310106dA3f24676a90EFd289644c2DFb3aad65',
    abi: OfferingV2,
    start_at: '1621940400',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x80861A817106665bcA173DB6AC2ab628a738c737', // 地址有问题
      decimal: 18,
      symbol: 'COW',
      name: 'COW',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '68000', // token 总额
    pool_info: {
      token_distribution: 'May 25th 2021, 7:00PM SGT',
      min_allocation: '0',
      max_allocation: '6 HT',
      min_swap_level: '2,040 HT',
    },
    website: 'https://www.coinwind.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/coinwind_com',
    Telegram_Channel: 'https://t.me/CoinWind',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 0,
    ratio: '1COW=0.03HT',
    time: '1621951200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '2040000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.coinwind.com/', // 跳转外链接
    project_introduction: 'CoinWind——A DeFi smart mining financial platform',
    duration: '37', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'COW(Influencer)',
    address: '0x566D9d153b1eA0e9B16D35cDf04a03E645F321A8',
    abi: OfferingV2,
    start_at: '1621940400',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x80861A817106665bcA173DB6AC2ab628a738c737', // 地址有问题
      decimal: 18,
      symbol: 'COW',
      name: 'COW',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '40000', // token 总额
    pool_info: {
      token_distribution: 'May 25th 2021, 7:00PM SGT',
      min_allocation: '0',
      max_allocation: '12 HT',
      min_swap_level: '1,200 HT',
    },
    website: 'https://www.coinwind.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/coinwind_com',
    Telegram_Channel: 'https://t.me/CoinWind',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 0,
    ratio: '1COW=0.03HT',
    time: '1621951200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '1200000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.coinwind.com/', // 跳转外链接
    project_introduction: 'CoinWind——A DeFi smart mining financial platform',
    duration: '2566', // 完成时间
    totalApplicants: '120', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'COW(Star)',
    address: '0x9224Ddc3FB9993AFAf8914B50843128ffa4C3336',
    abi: OfferingV2,
    start_at: '1621940400',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0x80861A817106665bcA173DB6AC2ab628a738c737', // 地址有问题
      decimal: 18,
      symbol: 'COW',
      name: 'COW',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '32000', // token 总额
    pool_info: {
      token_distribution: 'May 25th 2021, 7:00PM SGT',
      min_allocation: '0',
      max_allocation: '48 HT',
      min_swap_level: '960 HT',
    },
    website: 'https://www.coinwind.com/',
    white_paper: '-',
    twitter: 'https://twitter.com/coinwind_com',
    Telegram_Channel: 'https://t.me/CoinWind',
    Github: '-',
    yuque: '-',
    progress: 1,
    status: 3,
    ratio: '1COW=0.03HT',
    time: '1621951200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '960000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.coinwind.com/', // 跳转外链接
    project_introduction: 'CoinWind——A DeFi smart mining financial platform',
    duration: '5764', // 完成时间
    totalApplicants: '10000', // 申请总人数
    winningRate: '5', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'PAUL',
    address: '0xF32f2F0e71F89B145c3c3408f5beC2714e9291ea',
    abi: OfferingV2,
    start_at: '1622548800',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 1,
    isPrivate: true,
    underlying: {
      address: '0xfc01b8f883a89278235ba674bbe2bb48db96d9cf',
      decimal: 18,
      symbol: 'PAUL',
      name: 'PAUL',
      total_supply: '10,000,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '35000000', // token 总额
    pool_info: {
      token_distribution: 'Jun 1th 2021, 8:00PM SGT',
      min_allocation: '0',
      max_allocation: '200 USDT',
      min_swap_level: '70,000 USDT',
    },
    website: 'https://www.paulprotocol.io',
    white_paper: '-',
    twitter: 'https://twitter.com/PaulProtocolV1',
    Telegram_Channel: 'https://t.me/PaulProtocolV1Community',
    Github: '-',
    yuque: '-',
    progress: 0,
    status: 0,
    ratio: '1PAUL=0.002USDT',
    time: '1622635200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '70000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.paulprotocol.io', // 跳转外链接
    project_introduction:
      'Paul Protocol is a double-mechanism risk resistant oracle with superior performance and timeliness.',
    duration: '', // 完成时间
    totalApplicants: '6500', // 申请总人数
    winningRate: '7.69', // 申请中签率
    committed: '', // 超募比例
    total: '', // 参与资金规模
  },
  {
    name: 'PAUL',
    address: '0x7AC61a6eC0Efd0Acff9A9a5d7510d38CfaF2AfEa',
    abi: StarterV3,
    start_at: '1622548800',
    is_top: true,
    is_coming: false, // is_coming 为 true 则不请求合约
    currency: {
      address: '0xE4E55C9203Ac398A0F0B98BD096B70D9778eCa6A', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'LPT',
    },
    icon: '',
    type: 0,
    isPrivate: true,
    underlying: {
      address: '0xfc01b8f883a89278235ba674bbe2bb48db96d9cf',
      decimal: 18,
      symbol: 'PAUL',
      name: 'PAUL',
      total_supply: '10,000,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '25000000', // token 总额
    pool_info: {
      token_distribution: 'Jun 1th 2021, 8:00PM SGT',
      min_allocation: '',
      max_allocation: '',
      min_swap_level: '8,000 LPT',
    },
    website: 'https://www.paulprotocol.io',
    white_paper: '-',
    twitter: 'https://twitter.com/PaulProtocolV1',
    Telegram_Channel: 'https://t.me/PaulProtocolV1Community',
    Github: '-',
    yuque: '-',
    progress: 0,
    status: 0,
    ratio: '1PAUL=?LPT',
    time: '1622635200',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '50000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.paulprotocol.io', // 跳转外链接
    LPTLink:
      'https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    project_introduction:
      'Paul Protocol is a double-mechanism risk resistant oracle with superior performance and timeliness.',
    duration: '', // 完成时间
    totalApplicants: '', // 申请总人数
    winningRate: '', // 申请中签率
    committed: '', // 超募比例
    total: '$1,759,500', // 参与资金规模
  },
  // 测试合约配置
  // {
  //   name: 'WAR',
  //   address: '0xC0b748Ad9C984060B5b50EE040fd232e0e6F7A7d',
  //   abi: OfferingV2,
  //   start_at: '1620820800',
  //   is_top: true,
  //   is_coming: false, // is_coming 为 true 则不请求合约
  //   currency: {
  //     address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
  //     decimal: 18,
  //     symbol: 'USDT',
  //   },
  //   icon: '',
  //   type: 1,
  //   isPrivate: true,
  //   underlying: {
  //     address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 地址有问题
  //     decimal: 18,
  //     symbol: 'WAR',
  //     name: 'WAR',
  //     total_supply: '100,000,000',
  //     holders: '-',
  //     transfers: '-',
  //   },
  //   amount: '120000',
  //   pool_info: {
  //     token_distribution: 'May 14th 2021, 6:00PM SGT',
  //     min_allocation: '0',
  //     max_allocation: '0.01 USDT',
  //     min_swap_level: '1 USDT',
  //   },
  //   website: 'https://www.westarter.org',
  //   white_paper: '-',
  //   twitter: 'https://twitter.com/westarter_org',
  //   Telegram_Channel: 'https://t.me/westarter_official',
  //   Github: 'https://github.com/we-starter',
  //   yuque: '-',
  //   progress: 0,
  //   status: 0,
  //   ratio: '1WAR=1USDT', // 兑换比例需要确认
  //   time: '1620986400',
  //   purchasedCurrencyOf: 0,
  //   totalPurchasedAmount: '1600000000000000000000',
  //   totalPurchasedUnderlying: '0',
  //   totalPurchasedCurrency: '0',
  //   is_flash: false,
  //   link_url: 'https://www.westarter.org', // 跳转外链接
  //   project_introduction:
  //     'WeStarter is a cross-chain token initial swap platform which based on HECO network. Through the fluency of the product and sufficient industry resources, it carries the requirement of funds and resources for a variety of asset types. With the role of gatekeeper, through the decentralized incentive and governance mechanism of tokens, to achieve the goal of selecting high-quality assets.',
  // duration: '', // 完成时间
  // totalApplicants: '', // 申请总人数
  // winningRate: '', // 申请中签率
  // committed: '', // 超募比例
  // total: '', // 参与资金规模
  // },
  // {
  //   name: 'WAR',
  //   address: '0xAe24b9F01EbBA7b5163D5A5a0d30F4935241E2d8',
  //   abi: StarterV2,
  //   start_at: '1620871200',
  //   is_top: true,
  //   is_coming: false,
  //   currency: {
  //     address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
  //     decimal: 18,
  //     symbol: 'USDT',
  //   },
  //   icon: '',
  //   type: 0,
  //   isPrivate: false,
  //   underlying: {
  //     address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // 地址有问题
  //     decimal: 18,
  //     symbol: 'WAR',
  //     name: 'WAR',
  //     total_supply: '100,000,000',
  //     holders: '-',
  //     transfers: '-',
  //   },
  //   amount: '120000',
  //   pool_info: {
  //     token_distribution: 'May 14th 2021, 6:00PM SGT',
  //     min_allocation: '',
  //     max_allocation: '',
  //     min_swap_level: '1 USDT',
  //   },
  //   website: 'https://www.westarter.org',
  //   white_paper: '-',
  //   twitter: 'https://twitter.com/westarter_org',
  //   Telegram_Channel: 'https://t.me/westarter_official',
  //   Github: 'https://github.com/we-starter',
  //   yuque: '-',
  //   progress: 0,
  //   status: 0,
  //   ratio: '1WAR=1USDT',
  //   time: '1620986400',
  //   purchasedCurrencyOf: 0,
  //   totalPurchasedAmount: '1600000000000000000000',
  //   totalPurchasedUnderlying: '0',
  //   totalPurchasedCurrency: '0',
  //   is_flash: false,
  //   link_url: 'https://www.westarter.org', // 跳转外链接
  //   project_introduction:
  //     'WeStarter is a cross-chain token initial swap platform which based on HECO network. Through the fluency of the product and sufficient industry resources, it carries the requirement of funds and resources for a variety of asset types. With the role of gatekeeper, through the decentralized incentive and governance mechanism of tokens, to achieve the goal of selecting high-quality assets.',
  // duration: '', // 完成时间
  // totalApplicants: '', // 申请总人数
  // winningRate: '', // 申请中签率
  // committed: '', // 超募比例
  // total: '', // 参与资金规模
  // },
]
