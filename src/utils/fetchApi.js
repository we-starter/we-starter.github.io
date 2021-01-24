var API_BASE = 'https://apiv1.gallery.finance/api/'

export async function fetchApi(url, params){
    var resp = await fetch(API_BASE + url, params)
    if(resp.status != 200){
      throw new Error(resp.statusText)
    }
    return await resp.json()
}
