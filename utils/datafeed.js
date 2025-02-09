import { _files } from '#tailwind-config/content'
import _ from 'lodash'
const DEFAULT_CONFIG = {
    "exchange": [{
        "name": "HOSE",
        "value": "HOSE",
        "desc": "HOSE"
    }, {
        "name": "HNX",
        "value": "HNX",
        "desc": "HNX"
    }, {
        "name": "UPCOM",
        "value": "UPCOM",
        "desc": "UPCOM"
    }],
    "symbols_types": [{
        "name": "Chứng khoán",
        "value": "stock"
    }],
    "supported_resolutions": ["5", "15", "30", "60", "1D", "1W", "1M"],
    "intraday_multipliers": ["1"],
    "supports_search": true,
    "supports_group_request": false,
    "supports_marks": true,
    "supports_timescale_marks": false,
    "supports_time": true
}
const dayjs = useDayjs()

const _getSymbolInfo = (data) => {
    return {
        ticker: data.symbol,
        name: data.symbol,
        description: data.name_vi,
        // type: 'stock',
        session: '0900-1130,1300-1500',
        timezone: 'Asia/Ho_Chi_Minh',
        exchange: data.exchange,
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        visible_plots_set: 'ohlc',
        has_no_volume: false,
        // has_weekly_and_monthly: false,
        supported_resolutions: DEFAULT_CONFIG.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
    }
}
const _processHistoryResponse = (response) => {
    if (response.s !== 'ok' && response.s !== 'no_data') {
        throw new Error(response.errmsg);
    }

    const bars = []
    const meta = {
        noData: false,
    }

    if (response.s === 'no_data') {
        meta.noData = true;
        meta.nextTime = response.nextTime;
    } else {
        const volumePresent = response.v !== undefined;
        const ohlPresent = response.o !== undefined;

        for (let i = 0; i < response.t.length; ++i) {
            const barValue = {
                time: response.t[i] * 1000,
                close: parseFloat(response.c[i]),
                open: parseFloat(response.c[i]),
                high: parseFloat(response.c[i]),
                low: parseFloat(response.c[i]),
            };

            if (ohlPresent) {
                barValue.open = parseFloat(response.o[i])
                barValue.high = parseFloat(response.h[i])
                barValue.low = parseFloat(response.l[i])
            }

            if (volumePresent) {
                barValue.volume = parseFloat(response.v[i])
            }

            bars.push(barValue)
        }
    }

    return {
        bars: bars,
        meta: meta,
    }
}

const _parseStockMarks = (data) => {
    const res = []
    var id = 0
    
    _.forEach(data, (val) => {
        res.push({
            id: id,
            time: dayjs(val['date'], 'YYYY-MM-DD').add(7, 'hour').unix(),
            color: {
                background: '#1FA8CF',
                border: '#1FA8CF',
            },
            text: 'Dòng tiền tổ chức',
            label: ' ',
            minSize: 4,
            borderWidth: 0,
            hoveredBorderWidth: 0,
        })
        id++
    })
    return res

}
const _processSearchResponse = (results) => {
    const res = []
    for (const r of results) {
        res.push({
            symbol: r.symbol,
            name: r.symbol,
            ticker: r.symbol,
            description: r.name_vi,
            exchange: r.exchange
        })
    }
    return res
    
}
export default {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => {
            const { status, data } = useAuth()
            if (status.value !== 'authenticated' || data.value.profile.vip_level < 3) {
                DEFAULT_CONFIG.supports_marks = false
                callback(DEFAULT_CONFIG)
                return 
            }
            callback(DEFAULT_CONFIG)
        })
    },
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call: ', userInput);
      
        return useUDF().search(userInput)
            .then((data) => {
                const res = _processSearchResponse(data)
                onResultReadyCallback(res)
            })
            .catch((err) => {
                console.log('[searchSymbols]: Exception ', err)
            })
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
        console.log('[resolveSymbol]: Method call: ', symbolName)
        const SUPPORTED_INDEXES = ['VNINDEX', 'VN30', 'HNXINDEX', 'HNXUPCOMINDEX']
        if (SUPPORTED_INDEXES.indexOf(symbolName)>=0) {
            return onSymbolResolvedCallback(_getSymbolInfo({
                symbol: symbolName,
                name_vi: symbolName,
                exchange: undefined
            }))
        }
        return useAPI().$get(`/stock/stocks/${symbolName}/`)
            .then((data) => {
                return onSymbolResolvedCallback(_getSymbolInfo(data))
            })
            .catch((err) => {
                return onResolveErrorCallback(err)
            })
    },

    

    getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        console.log(`[getBars]: ${symbolInfo.ticker} | ${resolution}`)
        const query = {
            symbol: symbolInfo.name,
            resolution: resolution,
            from: periodParams.from,
            to: periodParams.to,
            countback: periodParams.countBack ? periodParams.countBack: undefined
        }
    
    
        return useUDF().history(query)
            .then((data) => {
                const parsed = _processHistoryResponse(data)
                onHistoryCallback(parsed.bars, parsed.meta)
            })
            .catch(err => {
                onErrorCallback(err)
            })
    },

    getServerTime: (callback) => {
        console.log('[getServerTime]: Method call')
	
        return useUDF().serverTime()
            .then((data) => {
                const time = parseInt(data.t)
                callback(time)
            })
            .catch((err) => {
                console.log('[getServerTime]: Exception ', err)
            })
	},
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        console.log(`[getMarks]: Method call ${symbolInfo.name}`)
        if (resolution === '1D') {
            const query = {
                symbol: symbolInfo.name,
                resolution: resolution,
            }
        
            return useAPI().$get('/stock/stock_marks', query)
                .then((data) => {
                    const parsed = _parseStockMarks(data)
                    onDataCallback(parsed)
                })
        }
    },
    getTimescaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        console.log(`[getTimescaleMarks]: Method call ${symbolInfo.name}`)
    }
    
};