import { useStockStore } from '@/stores/stock'
import { useAppStore } from '@/stores/app'

export const useSCP = () => {
    const stockStore = useStockStore()
    const { setStock } = stockStore
    const appStore = useAppStore()
    const { setAppTitle } = appStore

    async function getPrices(symbols: Array<string>) {
        if (!symbols.length) return
        const {data: _latestPrices } = await useAPI().get('/stock/latest/', { symbols: symbols.join(',') })
        if (_latestPrices.value) {
            for (const s of Object.keys(_latestPrices.value)) {
                setStock(s, _latestPrices.value[s])
            }
        }
    }

    function setTitle(title: string) {
        setAppTitle(title)
    }
  

    return {
        getPrices,
        setTitle
    }
  }