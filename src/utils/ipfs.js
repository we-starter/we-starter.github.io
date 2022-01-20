import axios from 'axios'

const config = {
  APIKey: '875b76d3dbf166531331',
  APISecret: 'eb66538a1ecaf754cdc1b1150c96b6693841640489dc3d9e2060b92ce2484da5',
  JWT: ''
}

export const IPFS_ADDRESS = 'https://gateway.pinata.cloud/ipfs/'

export const getIPFSFile = (hash) => IPFS_ADDRESS + hash

export const getIPFSJson = (hash) => axios.get(IPFS_ADDRESS + hash)

export const uploadIPFSJson = (data) => {
  return axios
    .post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      headers: {
        // "Authorization": config.JWT
        pinata_api_key: config.APIKey,
        pinata_secret_api_key: config.APISecret,
      },
    })
    .then((res) => res.data.IpfsHash)
}

export const uploadIPFSFile = (file) => {
  let formdata = new FormData()
  formdata.append('file', file)
  return axios
    .post('https://api.pinata.cloud/pinning/pinFileToIPFS', formdata, {
      headers: {
        // "Authorization": config.JWT
        pinata_api_key: config.APIKey,
        pinata_secret_api_key: config.APISecret,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data.IpfsHash)
}
