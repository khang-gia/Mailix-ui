import { defineStore } from 'pinia'

export const useStockStore = defineStore('stockStore', () => {
  const stocks = ref({})
  const searchStocks = ref([])
  function setStock(symbol, value) {
    stocks.value[symbol] = value
  }
  function setSearchStocks(value) {
    searchStocks.value.unshift(value)
  }
  return { setStock, stocks, searchStocks, setSearchStocks }
})