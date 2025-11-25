<template>
    <ClientOnly>
        <Doughnut :data="chartData" :options="chartOptions" ref="doughnutChart" />
    </ClientOnly>
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const props = defineProps({
    chartData: {
        type: Object,
        default: () => {
            return {}
        }
    },
    chartOptions: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
// const finalChartData = computed(() => {
//     if (props.patterns.length === 0) {
//         return props.chartData
//     } else {
//         const newDatasets = props.chartData.datasets.map((dataset, index) => {
//             const patternConfig = props.patterns[index] || {}
//             const patternType = patternConfig.type || 'diagonal'
//             const patternColor = patternConfig.color || 'rgba(0,0,0,0.1)'
//             return {
//                 ...dataset,
//                 backgroundColor: pattern.generate(patternType, patternColor, dataset.backgroundColor)
//             }
//         })
//         return {
//             ...props.chartData,
//             datasets: newDatasets
//         }
//     }
// })
</script>