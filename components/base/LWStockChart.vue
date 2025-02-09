<template>
  <div class="relative w-full h-full">
    <button 
      v-if="allowChangeType"
      class="absolute top-0 left-0 z-10 inline-flex items-center justify-center text-sm font-medium border border-slate-400 dark:border-slate-600 bg-white hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-accent-foreground h-7 px-2 rounded-md mr-2"
      @click.stop="changeChartType"
      >
      <Icon v-if="currentChartType==1" name="teenyicons:area-chart-outline"></Icon>
      <Icon v-if="currentChartType==2" name="teenyicons:candle-chart-outline"></Icon>
      <Icon v-if="currentChartType==3" name="carbon:chart-high-low"></Icon>
      <Icon v-if="currentChartType==4" name="teenyicons:area-chart-solid"></Icon>      
    </button>
    <div class="absolute trade-mark text-blue-500 left-0 ml-10 z-10" v-if="tradeMark">
      <small>
        <a href="https://tradingview.com" target="_blank">Special thanks to TradingView</a>
      </small>
    </div>
    <div class="lw-chart h-full" ref="chartContainer"></div>
    
    <div ref="lwTooltip" class="lw-tooltip absolute hidden p-3 text-left z-50 h-[96px] w-[120px] rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"></div>
  </div>
</template>

<script setup>
  import { createChart } from 'lightweight-charts'
  import _ from 'lodash'
  
  const { $numeralFormat } = useNuxtApp()
  const colorMode = useColorMode()
  const dayjs = useDayjs()
  const props = defineProps({
    type: {
      type: String,
      default: 'line',
    },
    allowChangeType: {
      type: Boolean,
      default: true
    },
    symbol: {
      type: String,
      required: true
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    chartOptions: {
      type: Object,
    },
    timeScaleOptions: {
      type: Object,
    },
    priceScaleOptions: {
      type: Object,
    },
    limit: {
      type: Number,
      default () {
        return 1000
      }
    },
    tradeMark: {
      type: Boolean,
      default: false
    }
  })

  const today = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const { data: stockData } = await useAPI().get(`/stock/stock_prices/?ordering=-date&symbol=${props.symbol}&date_to=${today}&page_size=${props.limit}&page=1`)
  if (stockData.value.results) {
    stockData.value.results = _.sortBy(stockData.value.results, ['date'])
  }
  // Function to get the correct series constructor name for current series type.
  function getChartSeriesConstructorName(type) {
    return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
  }

  // Lightweight Chart instances are stored as normal JS variables
  // If you need to use a ref then it is recommended that you use `shallowRef` instead
  let series
  let volumeSeries
  let chart

  const chartContainer = ref()
  const lwTooltip = ref(null)

  // Auto resizes the chart when the browser window is resized.
  const resizeHandler = () => {
    if (!chart || !chartContainer.value) return;
    const dimensions = chartContainer.value.getBoundingClientRect()
    chart.resize(dimensions.width, dimensions.height)
  }

  const addPriceSeries = (chartType = props.type) => {
    const seriesConstructor = getChartSeriesConstructorName(chartType)
    if (series) {
      chart.removeSeries(series)
    }
    let seriesOptions = {color: '#2898f1'}
    if (chartType == 'area') {
      seriesOptions = { lineColor: '#2898f1', topColor: 'rgba(40, 152, 241, .4)', bottomColor: 'rgba(40, 152, 241, 0)' }
    }
    seriesOptions.title = props.symbol
    series = chart[seriesConstructor](seriesOptions)
    
    series.setData(chartData.value)
    series.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1, // highest point of the series will be 10% away from the top
        bottom: 0.4, // lowest point will be 40% away from the bottom
      }
    })
  }

  const addVolumeSeries = () => {
    volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      color: '#26a69a'
    })
    volumeSeries.setData(chartVolume.value)
    volumeSeries.priceScale().applyOptions({
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      }
    })
  }

  const darkTheme = {
    chart: {
      layout: {
        background: {
          type: 'solid',
          color: 'rgba(0, 0, 0, 0)',
        },
        lineColor: '#2B2B43',
        textColor: '#D9D9D9',
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(5, 150, 105, .4)',
        text: 'sieucophieu.vn',
      },
      crosshair: {
        color: '#758696',
      },
      grid: {
        vertLines: {
          color: '#2B2B43',
        },
        horzLines: {
          color: '#363C4E',
        },
      },
    }
  }

  const lightTheme = {
    chart: {
      layout: {
        background: {
          type: 'solid',
          color: '#FFFFFF',
        },
        lineColor: '#2B2B43',
        textColor: '#191919',
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(5, 150, 105, .4)',
        text: 'sieucophieu.vn',
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: '#f0f3fa',
        },
      },
    }
  }
  var themesData = {
    dark: darkTheme,
    light: lightTheme,
  }

  function syncToTheme() {
    chart.applyOptions(themesData[colorMode.value].chart);
    // areaSeries.applyOptions(themesData[colorMode.preference].series);
  }

  const chartData = computed(() => {
    return stockData.value.results.map(item => {
      return {
        time: item.date,
        open: item.r,
        high: item.high_price,
        low: item.low_price,
        close: item.last_price,
        value: item.last_price
      }
    })
  })
  const chartVolume = computed(() => {
    return stockData.value.results.map(item => {
      return {
        time: item.date,
        value: item.vol * 10,
        color: item.change < 0 ? 'red' : 'green'
      }
    })
  })

  const currentChartType = ref(1)

  const changeChartType = () => {
    if (currentChartType.value >= 4) {
      currentChartType.value = 1
    } else {
      currentChartType.value += 1
    }
    const maps = ['', 'line', 'candlestick', 'bar', 'area']
    addPriceSeries(maps[currentChartType.value])
  }


  onMounted(() => {
    // Create the Lightweight Charts Instance using the container ref.
    chart = createChart(chartContainer.value, {
      ...props.chartOptions,
      handleScroll: {
        mouseWheel: false,
      },
      handleScale: {
        mouseWheel: false
      }
    })
    addVolumeSeries()
    addPriceSeries()


    if (props.priceScaleOptions) {
      chart.priceScale().applyOptions(props.priceScaleOptions);
    }

    if (props.timeScaleOptions) {
      chart.timeScale().applyOptions(props.timeScaleOptions);
    }

    chart.subscribeCrosshairMove(param => {
      const toolTipMargin = 15
      const toolTipWidth = 130
      const toolTipHeight = 90
      const toolTip = lwTooltip.value
      
      if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > chartContainer.value.clientWidth || param.point.y < 0 || param.point.y > chartContainer.value.clientHeight) {
        toolTip.style.display = 'none';
        return
      } 
      
      toolTip.style.display = 'block'
      const data = param.seriesData.get(series)
      const dataVolume = param.seriesData.get(volumeSeries)
      const price = data.value !== undefined ? data.value : data.close
      let priceChange = ''
      if (data.close && data.close != data.open) {
        priceChange = (data.close-data.open)/data.open
        priceChange = `(${$numeralFormat(priceChange).format('0.[00]%')})`
      }
      const volume = dataVolume.value !== undefined ? dataVolume.value : 0
      let tooltipEl = `
        <div>${props.symbol}</div>
        <div style="color: ${dataVolume.color}">
        ${price}<small>${priceChange}</small>
        </div>
        <div>Vol: ${$numeralFormat(volume).format('0.[0]a')}</div>`
      toolTip.innerHTML = tooltipEl
      const y = param.point.y;
      let left = param.point.x + toolTipMargin;
      if (left > chartContainer.value.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth;
      }

      let top = y + toolTipMargin;
      if (top > chartContainer.value.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin;
      }
      toolTip.style.left = left + 'px';
      toolTip.style.top = top + 'px';
      
    
    })

    chart.timeScale().fitContent();

    if (props.autosize) {
      window.addEventListener('resize', resizeHandler);
    }
    syncToTheme()
  })

  onUnmounted(() => {
    if (chart) {
      chart.remove();
      chart = null;
    }
    if (series) {
      series = null;
    }
    if (volumeSeries) {
      volumeSeries = null
    }
  })

/*
 * Watch for changes to any of the component properties.

 * If an options property is changed then we will apply those options
 * on top of any existing options previously set (since we are using the
 * `applyOptions` method).
 * 
 * If there is a change to the chart type, then the existing series is removed
 * and the new series is created, and assigned the data.
 * 
 */
watch(
  () => props.autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener('resize', resizeHandler);
      return;
    }
    window.addEventListener('resize', resizeHandler);
  }
)


// watch(
//   () => props.chartOptions,
//   (newOptions) => {
//     if (!chart) return;
//     if (colorMode.preference == 'dark') {
//       return chart.applyOptions({ ...newOptions, ...darkTheme.chart })
//     }
//     return chart.applyOptions({ ...newOptions, ...lightTheme.chart })
//   }
// )

// watch(
//   () => props.priceScaleOptions,
//   (newOptions) => {
//     if (!chart) return;
//     chart.priceScale().applyOptions(newOptions);
//   }
// )

// watch(
//   () => props.timeScaleOptions,
//   (newOptions) => {
//     if (!chart) return;
//     chart.timeScale().applyOptions(newOptions);
//   }
// )

watch(
  () => colorMode.value,
  (n) => {
    syncToTheme()
  }
)

</script>

