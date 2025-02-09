export const useUDF = () => {
    const config = useRuntimeConfig()

    function search(userInput: string) {
        return useAPI().$get(`/stock/stocks/?search=${userInput}`, undefined, undefined, config.public.udfUrl)
    }
    function serverTime() {
        return useAPI().$get(`/stock/udf/time/`, undefined, undefined, config.public.udfUrl)
        
    }
    function history(query: any = {}) {
        return useAPI().$get('/stock/udf/history', query, undefined, config.public.udfUrl)
    }

    return {
        search,
        serverTime,
        history
    }
  }