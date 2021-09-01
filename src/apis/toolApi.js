import axios from 'axios'
import apiConfig from './api.config'
let axioss = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})
let toolApi = {
  getTotalNumAddresses(data) {
    return axioss.get('/v1/project/stat?project_id=' + data)
  },
  getWarTokenPrice(data) {
    return axioss.get(
      '/v1/project/token?address=' +
        '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
    )
  }
}

export default toolApi
