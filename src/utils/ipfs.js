import axios from 'axios'

const config = {
  APIKey: 'f0c20802fa676e56a4b0',
  APISecret: '127bf8077607837dcdfdbfd1552dab4aca299b967fc5ceb837887261b9c07181',
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
