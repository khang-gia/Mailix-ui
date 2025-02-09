<template>
    <div>
        <div class="grid md:grid-cols-12 lg:gap-2">        
            <div class="md:col-span-5 space-y-4">
                <BaseCard title="Định giá" body-class="p-4">
                <table class="table table-auto w-full">
                    <thead class="text-sm uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
                        <tr>
                            <th>THÔNG TIN</th>
                            <th>{{ symbol }}</th>
                            <th>NGÀNH</th>
                            <th>VNINDEX</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                        <tr>
                            <td>P/E bình quân 5 năm</td>
                            <td class="text-center">{{ eData?.medianPe }}</td>
                            <td class="text-center">{{ eData?.medianIndustryPe }}</td>
                            <td class="text-center">{{ eData?.medianIndexPe }}</td>
                        </tr>
                        <tr>
                            <td>P/B bình quân 5 năm</td>
                            <td class="text-center">{{ eData?.medianPb }}</td>
                            <td class="text-center">{{ eData?.medianIndustryPb }}</td>
                            <td class="text-center">{{ eData?.medianIndexPb }}</td>
                        </tr>
                        <tr>
                            <td>EPS 4QGN</td>
                            <td class="text-center">{{ $numeralFormat(rData?.earningPerShare).format('0,0') }} đ</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Book Value 4QGN</td>
                            <td class="text-center">{{ $numeralFormat(rData?.bookValuePerShare).format('0,0') }} đ</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <div class="w-full mt-4">
                    <div class="flex space-x-4">
                        <div class="space-y-2">
                            <div class="py-1">Giá thị trường</div>
                            <div class="py-1">Giá hợp lý</div>
                            <div class="py-1">
                                <span v-if="marketRatio<100">Upside</span>
                                <span v-else>Downside</span>
                            </div>
                            <div class="py-1">Vùng cơ hội → rủi ro</div>
                        </div>
                        <div class="flex-1 text-white space-y-2">
                            <div class="bg-green-600 py-1 px-2 rounded-r-lg text-end transition-all ease-in-out duration-300 text-nowrap" :style="{width: `${marketRatio}%`}">{{ $numeralFormat(marketPrice).format('0,0') }} đ</div>
                            <div v-if="intrinsicValue>0" class="bg-blue-800 py-1 px-2 rounded-r-lg text-end transition-all ease-in-out duration-300 text-nowrap" :style="{width: `${intrinsicRatio}%`}">
                                {{ $numeralFormat(intrinsicValue).format('0,0') }} đ
                            </div>
                            <div v-else>Không xác định</div>
                            <div class="py-1 flex w-full" :class="{'justify-end': intrinsicValue>0}">
                                <div v-if="intrinsicValue>0" :style="{width: `${Math.abs(intrinsicRatio - marketRatio)}%`}">
                                    <span v-if="Math.abs(diffSide)<10" class="text-sm">{{ $numeralFormat(diffSide).format('0.[0]') }}%</span>
                                    <div v-else class="transition-all ease-in-out duration-300">
                                        <ScpStockMiniBrief :value="diffSide" :factor="8" :flashing="false"></ScpStockMiniBrief>
                                    </div>
                                </div>
                                <div v-else>Không xác định</div>
                            </div>
                            <div class="py-1">
                                <div v-if="intrinsicValue>0">
                                    <div class="w-full h-2 bg-gradient-to-r from-green-500 to-red-500"></div>
                                    <div class="w-full flex justify-between">
                                        <div class="py-1">{{ $numeralFormat(intrinsicValue*0.75).format('0,0') }} đ</div>
                                        <div class="py-1">{{ $numeralFormat(intrinsicValue*1.25).format('0,0') }} đ</div>
                                    </div>
                                </div>
                                <div v-else>Không xác định</div>
                            </div>
                        </div>
                    </div>            
                </div>
                </BaseCard>
            </div>
        
            <div class="md:col-span-5">
                <ClientOnly>
                    <ChartRadar class="w-full" :data="chartData" :options="chartOptions"></ChartRadar>
                </ClientOnly>
            </div>
            <div class="md:col-span-2 md:space-y-4 grid grid-cols-2 space-x-4 md:grid-cols-1 md:space-x-0">
                <BaseCard width-class="!rounded-lg">
                    <template #title>
                        <div class="text-sm uppercase text-slate-500 dark:text-slate-300 text-center">Lướt sóng (TA)</div>    
                    </template>
                    <div class="text-center py-4 text-2xl font-semibold" :class="getColorClass(ratingData.rs,1.49)">{{ ratingData.rs || 'N/A' }}</div>
                </BaseCard>
                <BaseCard width-class="!rounded-lg">
                    <template #title>
                        <div class="text-sm uppercase text-slate-500 dark:text-slate-300 text-center">Nội tại (FA)</div>    
                    </template>
                    <div class="text-center py-4 text-2xl font-semibold" :class="getColorClass(ratingData.fa_rating,1.49)">{{ ratingData.fa_rating || 'N/A' }}</div>
                </BaseCard>
                <div class="text-sm">
                    <table class="w-full">
                        <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                            <tr>
                                <td>>7</td>
                                <td>Rất tốt</td>
                            </tr>
                            <tr>
                                <td>6-7</td>
                                <td>Tốt</td>
                            </tr>
                            <tr>
                                <td>5-6</td>
                                <td>Trung bình</td>
                            </tr>
                            <tr>
                                <td><5</td>
                                <td>Kém</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="mt-4 text-sm">
            <div class="font-bold">Chú thích:</div>
            <div> - Sức khoẻ DN: Đánh giá nền tảng tài chính của DN.</div>
            <div> - HĐKD: Đánh giá KQKD 5 năm gần nhất của DN.</div>
            <div> - PTKT: Đánh giá xu hướng kỹ thuật của CP.</div>
            
            <div> - Giá hợp lý: Giá trị hợp lý của CP.</div>
            <div> - Giá thị trường: Giá hiện tại.</div>
            <div> - Vùng rủi ro: Vượt giá trị hợp lý</div>
            <div> - Vùng cơ hội: Phù hợp tích luỹ dài hạn.</div>
        </div>
    </div>
    
</template>

<script setup>
    import _ from 'lodash'
    import { storeToRefs } from 'pinia'
    import { useStockStore } from '@/stores/stock'
    const stockStore = useStockStore()
    const { stocks } = storeToRefs(stockStore)
    const colorMode = useColorMode()
    const props = defineProps(['symbol'])
    const { $numeralFormat } = useNuxtApp()
    const {data: eData} = await useAPI().get(`/stock/evaluation/${props.symbol}/`)
    
    const {data: rData} = await useAPI().get(`/stock/financial_ratios/latest/?ticker=${props.symbol}`)
    
    const {data: ratingData} = await useAPI().get(`/stock/rating/${props.symbol}/`)

    const intrinsicValue = ref()
    
    const intrinsicRatio = ref(0)
    const marketRatio = ref(0)

    useSCP().getPrices([props.symbol])

    function calculate () {
        const meanPE = (0.4 * eData.value.medianPe) + (0.3 * eData.value.medianIndustryPe) + (0.3 * eData.value.medianIndexPe)
        const meanPB = (0.4 * eData.value.medianPb) + (0.3 * eData.value.medianIndustryPb) + (0.3 * eData.value.medianIndexPb)
        const evalPE = meanPE * rData.value.earningPerShare
        const evalPB = meanPB * rData.value.bookValuePerShare
        const val = _.mean([evalPE, evalPB])
        return val
    }
    intrinsicValue.value = calculate()
    
    const marketPrice = computed(() => {        
        if (!stocks.value[props.symbol]) return ''        
        const res = 1000*parseFloat(stocks.value[props.symbol].last_price)
        if (res<intrinsicValue.value) {
            marketRatio.value = 100*res/intrinsicValue.value
            intrinsicRatio.value = 100
        } else {
            marketRatio.value = 100
            intrinsicRatio.value = parseInt(100*intrinsicValue.value / res)
        }
        if (intrinsicValue.value<0) {
            intrinsicRatio.value = 0
            marketRatio.value = 100
        }
        return res
    })

    const diffSide = computed(() => {
        return 100*(intrinsicRatio.value/marketRatio.value-1)
    })
 
    const chartData = computed(() => {
        return {
            labels: [`Sức khỏe DN ${ratingData.value.financial_health||''}`, `PTKT ${ratingData.value.rs||''}`, `HĐKD ${ratingData.value.business_operation||''}`],
            datasets: [{
                // backgroundColor: 'rgba(179,181,198,0.2)',
                // borderColor: 'rgba(179,181,198, 1)',
                // pointBackgroundColor: 'rgba(179,181,198,1)',
                // pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgb(67,56,202)',
                data: [ratingData.value.financial_health, ratingData.value.rs, ratingData.value.business_operation]
            }]
        }
    })

    const isDark = computed(() => {
        return colorMode.value == 'dark'
    })

    const chartOptions = computed(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    max: 10,
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        backdropColor: 'transparent',
                        color: isDark.value ? '#fff' : 'rgb(71,85,105)'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, .5)'
                    },
                    pointLabels: {
                        color: isDark.value ? '#fff' : 'rgb(71,85,105)',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    })

    function getColorClass(value, factor = 1) {
        const val = value / factor
        if (val == 0) return `scp-text-color--`
        if (val > 6.7) return `scp-text-color-7`
        if (val < -6.7) return `scp-text-color--7`
        if (val == 0) return `scp-text-color---`

        let pInt = val.toString().split('.')[0]
        return `scp-text-color-${pInt}`
    }
</script>
