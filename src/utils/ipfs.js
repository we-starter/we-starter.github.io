import axios from "axios";


const config = {
  APIKey: '7e261b35bd2e534779bb',
  APISecret: '56f6372eb684cb6b2dcfc884c5a8bd9b26a9253cf6c003e185320d71e54ab5fa',
  JWT: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YzY3NjMwOS00NDAzLTQ2ZDQtODRmNi05ODE5MDgzNjgzOWMiLCJlbWFpbCI6ImNud2ViMDNAMTYzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3ZTI2MWIzNWJkMmU1MzQ3NzliYiIsInNjb3BlZEtleVNlY3JldCI6IjU2ZjYzNzJlYjY4NGNiNmIyZGNmYzg4NGM1YThiZDliMjZhOTI1M2NmNmMwMDNlMTg1MzIwZDcxZTU0YWI1ZmEiLCJpYXQiOjE2MzIyOTgyMDN9.9vd1v1h_0OP7UmuPmTas4FrPFN3QjAZlxCfNHxLdpA8'
}

export const IPFS_ADDRESS = 'https://gateway.pinata.cloud/ipfs/'

export const getIPFSFile = hash => IPFS_ADDRESS + hash

export const getIPFSJson = hash => axios.get(IPFS_ADDRESS + hash)

export const uploadIPFSJson = (data) => {
  return axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
    headers: {
      // "Authorization": config.JWT
      "pinata_api_key": config.APIKey,
      "pinata_secret_api_key": config.APISecret
    }
  }).then(res => res.data)
}

export const uploadIPFSFile = (file) => {
  let formdata = new FormData()
  formdata.append('file', file)
  return axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formdata, {
    headers: {
      // "Authorization": config.JWT
      "pinata_api_key": config.APIKey,
      "pinata_secret_api_key": config.APISecret,
      "Content-Type": "multipart/form-data"
    }
  }).then(res => res.data)
}
