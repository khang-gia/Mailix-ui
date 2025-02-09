<template>
    <div class="px-2">
        <div class="flex space-x-2">
            <div class="pt-2">
                <label class="relative inline-flex items-center cursor-pointer">     
                    <input type="checkbox" v-model="yearly" 
                        name="dashboardPageChk"
                        class="sr-only peer"
                        @change="toggleYearly"
                    >
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </div>
                    <span class="ml-3 text-sm font-medium">
                        <span v-if="yearly">Theo Năm</span>
                        <span v-else>Theo Quý</span>
                    </span>
                </label>
            </div>
            <USelect v-model="unit" :options="unitOptions" option-attribute="name" @change="onUnitChange" />
            <div class="pt-2">
                <label class="relative inline-flex items-center cursor-pointer">     
                    <input type="checkbox" v-model="directCashflow" 
                        name="dashboardPageChk"
                        class="sr-only peer"
                        @change="toggleDirectCashflow"
                    >
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </div>
                    <span class="ml-3 text-sm font-medium">
                        <span v-if="directCashflow">LCTT trực tiếp</span>
                        <span v-else>LCTT gián tiếp</span>
                    </span>
                </label>
            </div>
        </div>
        <div>
            <DataTable
                :data="financialData"
                :columns="columns"
                :options="dtOptions"
                :key="columns.length"
                class="display nowrap row-highlight"
                ref="table"
                >
            </DataTable>
            <small>Nguồn <a class="text-blue-500" href="https://fireant.vn/" target="_blank">FireAnt</a></small>
        </div>
    </div>
</template>

<script setup>
    const { $numeralFormat } = useNuxtApp()
    const props = defineProps(['symbol'])
    const table = ref(null)
    const yearly = ref(false)
    const directCashflow = ref(false)
    const financialData = ref([])
    const columns = ref([{
        data: 'name',
        title: 'LƯU CHUYỂN TIỀN TỆ',
    }])
    const dtOptions = ref({
        paging: false,
        info: false,
        ordering: false,
        fixedColumns: {
            start: 1
        },
        scrollCollapse: true,
        scrollX: true,
        scrollY: 'calc(100vh - 320px)',
        drawCallback: () => {
            setTimeout(() => {
                addTableEvents()
            }, 200)            
        },
        "oLanguage": {
            "sSearch": "Lọc theo hạng mục"
        }
    })

    const unitOptions = [{
        name: 'Triệu đồng',
        value: 1000000
    }, {
        name: 'Nghìn đồng',
        value: 1000
    }, {
        name: 'Đồng',
        value: 1
    }]
    const unit = ref(1000000)

    
    const cashlowType = computed(() => {
        return directCashflow.value ? 3 : 4
    })

    const getData = async (symbol, yearly, limit, type=4, isAuto=true) => {
        
        const { data: _financialData } = await useAPI().post(
            `/fa/financial_reports/${symbol}/`, {
                type,
                yearly,
                limit
            })
        if (type == 4 && isAuto) {
            if (!_financialData.value || (!_financialData.value.length)) {
                directCashflow.value = false
                getData(symbol, yearly, limit, 3)
            }
        }
        resetTableData()
        setTimeout(()=>{
            parseData(_financialData.value)
        })
        
    }
    const resetTableData = () => {
        financialData.value = []
        columns.value.splice(1)
        table.value.dt.rows().invalidate('data').draw();
    }
    const parseData = (data) => {
        let isFirst = true       
        
        for(const d of data) {
            let tmp = {name: d.name}
            tmp.name = '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(d.level) + d.name
            tmp.name = `<span title="${d.name}">${tmp.name}</span>`
            for (const v of d.values) {
                tmp[`${v.quarter}_${v.year}`] = v.value
                
                if (isFirst) columns.value.push({
                    data: `${v.quarter}_${v.year}`,
                    title: v.period,
                    render: (_v) => {
                        if (!_v) return ""
                        _v = _v / unit.value
                        return $numeralFormat(_v).format('0,0')
                    }
                })
            }
        
            financialData.value.push(tmp)
            isFirst = false          
        }      
        
    }
    
    const addTableEvents = () => {
        table.value.dt.on('mouseenter', 'td', function () {
            // remove all highlight columns
            let colIdx = table.value.dt.cell(this).index().column;
            if (colIdx === 0) return // ignore first column

            table.value.dt
                .cells()
                .nodes()
                .each((el) => el.classList.remove('highlight'));
            // highlight current columns
            table.value.dt
                .column(colIdx)
                .nodes()
                .each((el) => el.classList.add('highlight'));

            const baseIdx = colIdx % 4
            if (!yearly.value) {
                // highlight other quarters
                
                const numCols = table.value.dt.init().columns.length
                for (let i = 1; i<numCols; i++) {
                    if (i%4 == baseIdx) {
                        table.value.dt
                            .column(i)
                            .nodes()
                            .each((el) => el.classList.add('highlight'));
                    }
                }

            }
        });
            
            
    }
    const toggleYearly = () => {
        getData(props.symbol, yearly.value, yearly.value? 5: 12, cashlowType.value, false)
    }
    const onUnitChange = () => {
        // when changing unit, do not need to RE-GET data, just need to redraw table, render function will handle format.
        table.value.dt.rows().invalidate('data').draw();
    }
    const toggleDirectCashflow = () => {
        getData(props.symbol, yearly.value, yearly.value? 5: 12, cashlowType.value, false)
    }
   
    onMounted(() => {
        getData(props.symbol, yearly.value, yearly.value? 5: 12, cashlowType.value, true)
    })
        

</script>
<style scoped>
:deep(.dtfc-top-blocker) {
    height: 0!important;
}

</style>