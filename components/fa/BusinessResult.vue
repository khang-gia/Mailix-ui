<template>
    <div class="px-2">
        <div class="flex space-x-2 justify-between">
            <div class="flex">
                <div class="pt-2">
                    <label class="relative inline-flex items-center cursor-pointer">     
                        <input type="checkbox" v-model="yearly" 
                            name="dashboardPageChk"
                            class="sr-only peer"
                            @change="togglePeriod">
                        <div
                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                        </div>
                        <span class="ml-3 text-sm font-medium">
                            <span v-if="yearly">Theo Năm</span>
                            <span v-else>Theo Quý</span>
                        </span>
                    </label>
                </div>
                <USelect v-model="unit" :options="unitOptions" option-attribute="name" @change="onUnitChange"  />
            </div>
            <div class="flex">
                <button v-if="userInfo.is_staff || userInfo.is_superuser" class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" @click="updateFinancialConfirm" >
                    Cập nhật BCTC
                </button>
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
    import { useModalStore } from '@/stores/modal'
    import { storeToRefs } from 'pinia'
    const { status, data: userInfo } = useAuth()
    const { $numeralFormat } = useNuxtApp()
    const props = defineProps(['symbol'])
    
    const modalStore = useModalStore()
    const { alertConfirm, alertModal } = storeToRefs(modalStore)
    const { setAlertModal } = modalStore
    const snackbar = useMySnackBar()

    const table = ref(null)
    const yearly = ref(false)
    const financialData = ref([])
    const columns = ref([{
        data: 'name',
        title: 'KẾT QUẢ KINH DOANH',
        render: (name, type, row) => {
            if (row.level == 2) {
                return '&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;' + name;
            }
            return name
        },
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

    
    const togglePeriod = () => {
        // reload data
        getData(props.symbol, yearly.value, yearly.value? 5: 12)
    }

    const getData = async (symbol, yearly, limit) => {
        
        const { data: _financialData } = await useAPI().post(
            `/fa/financial_reports/${symbol}/`, {
                type: 2,
                yearly,
                limit
            })
        resetTableData()
        setTimeout(() => {
            parseData(_financialData.value)
        })
        
    }
    const resetTableData = () => {
        financialData.value = []
        columns.value.splice(1)
    }
    const parseData = (data) => {
        let isFirst = true
        
        for(const d of data) {
            let tmp = {name: d.name}
            if (d.level == 2) tmp.name = '&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;' + d.name
            for (const v of d.values) {
                tmp[`${v.quarter}_${v.year}`] = v.value
                
                if (isFirst) columns.value.push({
                    data: `${v.quarter}_${v.year}`,
                    title: v.period,
                    render: (_v) => {
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
        const dt = table.value.dt
        dt.on('mouseenter', 'td', function () {
            // remove all highlight columns
            let colIdx = dt.cell(this).index().column;
            if (colIdx === 0) return // ignore first column

            dt
                .cells()
                .nodes()
                .each((el) => el.classList.remove('highlight'));
            // highlight current columns
            dt
                .column(colIdx)
                .nodes()
                .each((el) => el.classList.add('highlight'));

            
            if (!yearly.value) {
                // highlight other quarters
                const baseIdx = colIdx % 4
                const numCols = dt.init().columns.length
                for (let i = 1; i<numCols; i++) {
                    if (i%4 == baseIdx) {
                        dt
                            .column(i)
                            .nodes()
                            .each((el) => el.classList.add('highlight'));
                    }
                }

            }
        });            
            
    }
    const onUnitChange = () => {
        // when changing unit, do not need to RE-GET data, just need to redraw table, render function will handle format.
        table.value.dt.rows().invalidate('data').draw();
    }
    const updateFinancialConfirm = () => {
        setAlertModal(true, {
            message: `Cập nhật BCTC mới nhất cho ${props.symbol}?`,
            title: 'Cật nhật BCTC',
            confirmButton: 'Cập nhật',
            denyButton: 'Cancel',
        })
        const unwatch = watch(
            () => alertModal.value,
            (newVal) => {
              if (!newVal) {
                if (alertConfirm.value) {
                  // call api to update in background
                  useAPI().$post(`/fa/financial_reports/${props.symbol}/update/`)
                    .then(() => {
                        snackbar.success('Dữ liệu được cập nhật nền, hãy thử lại trong vài phút tới nhé!','Cập nhật thành công')
                    })
                    .catch(() => {
                        snackbar.error('Đã có lỗi xảy ra, hãy thử lại hoặc liên hệ TITACA nhé!', 'Cập nhật không thành công')
                    })
                }
                unwatch();
              }
            }
          )
    }
   
    onMounted(() => {
        getData(props.symbol, yearly.value, yearly.value? 5: 12)
    })
        

</script>
<style scoped>
:deep(.dtfc-top-blocker) {
    height: 0!important;
}
</style>