import axios from 'axios'

const config = {
  APIKey: '8728eb7bbb140a0fd88f',
  APISecret: '66abe5c80dbfb51468b970cd3706231ce1144b19b02430c9de99d06489b650d5',
  JWT:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YzY3NjMwOS00NDAzLTQ2ZDQtODRmNi05ODE5MDgzNjgzOWMiLCJlbWFpbCI6ImNud2ViMDNAMTYzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NzI4ZWI3YmJiMTQwYTBmZDg4ZiIsInNjb3BlZEtleVNlY3JldCI6IjY2YWJlNWM4MGRiZmI1MTQ2OGI5NzBjZDM3MDYyMzFjZTExNDRiMTliMDI0MzBjOWRlOTlkMDY0ODliNjUwZDUiLCJpYXQiOjE2MzM3NjgwOTF9.xZSYrxrGYSmKpPu_cdM15ftkc5RJHB-qQ6yPJnbWvO0',
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
