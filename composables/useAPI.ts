export const useAPI = () => {
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

  function get(url: string, query: any = {}, key?: string) {
    return useFetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'GET',
      query: getQuery(query),
      headers: getHeaders(),
      key: key
    })
  }

  function $get(url: string, query: any = {}, key?: string, baseURL?: string) {
    return $fetch(url, {
      baseURL: baseURL || config.public.apiBaseUrl,
      method: 'GET',
      query: getQuery(query),
      headers: getHeaders(),
      key: key
    })
  }

  function post(url: string, body: any = {}) {
    const headers = getHeaders() as { [key: string]: string }
    if (!(body instanceof FormData)) {
      body = JSON.stringify(body)
    } else {
      delete headers['Content-Type']
    }
    return useFetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body,
      headers: headers,
    })
  }

  function $post(url: string, body: any = {}) {
    const headers = getHeaders() as { [key: string]: string }
    if (!(body instanceof FormData)) {
      body = JSON.stringify(body)
    } else {
      delete headers['Content-Type']
    }
    return $fetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body,
      headers: headers,
    })
  }


  function put(url: string, body: any = {}) {
    return useFetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'PUT',
      body,
      headers: getHeaders(),
    })
  }

  function patch(url: string, body: any = {}) {
    return useFetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'PATCH',
      body,
      headers: getHeaders(),
    })
  }

  function del(url: string, body: any = {}) {
    return useFetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'DELETE',
      body,
      headers: getHeaders(),
    })
  }


  async function getAsync(key: string, url: string, query: any = {}) {
    return await useLazyAsyncData(key, () => $fetch(url, {
      baseURL: config.public.apiBaseUrl,
      method: 'GET',
      query: getQuery(query),
      headers: getHeaders(),
      key: key
    })
    )
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    getAsync,
    $get,
    $post
  }
}