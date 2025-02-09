<template>
    <BaseModal title="Tuỳ chọn hiển thị" :modalOpen="modalOpen" @close-modal="closeModal">
        <div class="p-5">
            <div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="viewOption.dashboardViewAsPage" 
                        name="dashboardPageChk"
                        class="sr-only peer"
                        @change="toggleDashboardView">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </div>
                    <span class="ml-3 text-sm font-medium">Hiển thị bảng điện theo trang</span>
                </label>
            </div>
            <div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="viewOption.showUserStockList" class="sr-only peer"
                        name="userStockListChk"
                        @change="toggleUserStockListView">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </div>
                    <span class="ml-3 text-sm font-medium">Hiển thị danh mục quan tâm</span>
                </label>
            </div>
            <div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="viewOption.pinUserStockList" 
                        class="sr-only peer"
                        name="inUserStockListChk"
                        @change="togglePinUserStockList">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                    </div>
                    <span class="ml-3 text-sm font-medium">Cố định danh mục quan tâm trên bảng điện</span>
                </label>
            </div>
            <ScpColorRange class="my-4"></ScpColorRange>
        </div>
    </BaseModal>
</template>

<script setup>
    import { useViewStore } from '@/stores/view'
    import { storeToRefs } from 'pinia'

    const emit = defineEmits(['close-modal'])
    const props = defineProps(['modalOpen'])

    const viewStore = useViewStore()
    const { setViewAttr } = viewStore
    const { viewOption } = storeToRefs(viewStore)

    const toggleDashboardView = (e) => {
        setViewAttr('dashboardViewAsPage', viewOption.value.dashboardViewAsPage)
    }
    const toggleUserStockListView = (e) => {
        setViewAttr('showUserStockList', viewOption.value.showUserStockList)
    }

    const togglePinUserStockList = (e) => {
        setViewAttr('pinUserStockList', viewOption.value.pinUserStockList)
    }

    const closeModal = () => {
        emit('close-modal')
    }



</script>
