import { defineStore } from 'pinia'

export const useWatchListStore = defineStore('watchListStore', () => {
  const watchList = ref([])
  const watchListLoaded = ref(false)

  function setWatchList(value) {
    watchList.value = value
    watchListLoaded.value = true
  }


  function fetchWatchList(params) {
    if (!params || !params.created_by) return
    useAPI().get('/stock/user_stock_lists/', params)
      .then(({data}) => {
        if (data.value) {
          setWatchList(data.value.results)
        }
      })
  }

  return { setWatchList, fetchWatchList, watchList, watchListLoaded }
})