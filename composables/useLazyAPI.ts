export const useLazyAPI = () => {
    const config = useRuntimeConfig()
    const defaultHeaders: { 
      'Content-Type': string, 
      'Authorization'?: string
    } = {
      'Content-Type': 'application/json'
    }

    function getHeaders() {
      const token = useCookie('auth:token')
      const headers = {...defaultHeaders}
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }
      return headers
    }
  
    function getQuery(query: object = {}) {
      return {
        ...query
      }
    }
  
    function get(url: string, query: any = {}) {
      return useFetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'GET',
        query: getQuery(query),
        headers: getHeaders(),
        lazy: true
      })
    }
  
    function post(url: string, body: any = {}) {
      return useFetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body,
        headers: getHeaders(),
        lazy: true
      })
    }
  
    function put(url: string, body: any = {}) {
      return useFetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'PUT',
        body,
        headers: getHeaders(),
        lazy: true
      })
    }
  
    function patch(url: string, body: any = {}) {
      return useFetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'PATCH',
        body,
        headers: getHeaders(),
        lazy: true
      })
    }
  
    function del(url: string, body: any = {}) {
      return useFetch(url, {
        baseURL: config.public.apiBaseUrl,
        method: 'DELETE',
        body,
        headers: getHeaders(),
        lazy: true
      })
    }
  
    return {
      get,
      post,
      put,
      patch,
      del,
    }
  }