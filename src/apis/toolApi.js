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
    return axioss.get('dash/?project_id' + data)
  },
}

export default toolApi
