<template>
    <div class="p-2">
        <div v-if="!isAuthenticated">
            <FaLoginRequired />
        </div>
        <div v-else-if="userInfo.profile.vip_level<4">
            <FaVipRequired />
        </div>
        <div v-else>
            <div class="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap border-transparent"
                    role="tablist">
                    <li class="mr-2 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-green-600 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500':
                                activeTab === 0,
                        }" @click.prevent.stop="onChangeTab(0)">Định giá</a>
                    </li>
                    <li class="mr-2 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-green-600 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500':
                                activeTab === 1,
                        }" @click.prevent.stop="onChangeTab(1)">Kết quả kinh doanh</a>
                    </li>
                    <li class="mr-2 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-green-600 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500':
                                activeTab === 2,
                        }" @click.prevent.stop="onChangeTab(2)">Cân đối kế toán</a>
                    </li>
                    <li class="mr-2 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-green-600 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500':
                                activeTab === 3,
                        }" @click.prevent.stop="onChangeTab(3)">Lưu chuyển tiền tệ</a>
                    </li>
                    <li class="mr-2 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-green-600 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500':
                                activeTab === 4,
                        }" @click.prevent.stop="onChangeTab(4)">Phân tích kỹ thuật</a>
                    </li>
                </ul>
            </div>
            <div class="content pt-3">
                <FaEvaluation v-if="activeTab===0" :symbol="symbol"/>
                <FaBusinessResult v-if="activeTab===1" :symbol="symbol"/>
                <FaBalanceSheet v-if="activeTab===2" :symbol="symbol"/>
                <FaCashFlow v-if="activeTab===3" :symbol="symbol" />
                <FaTechnicalAnalyze v-if="activeTab===4" :symbol="symbol" />
            </div>
        </div>
    </div>
    
</template>

<script setup>
    definePageMeta({
        title: 'Phân tích'
    })
    const route = useRoute()
    const { status, data: userInfo} = useAuth()

    const symbol = ref(route.params.symbol)

    const activeTab = ref(0)
    const isAuthenticated = computed(() => status.value === 'authenticated')

    const { data:stockInfo } = await useAPI().get(`/stock/stocks/${symbol.value}/`)
    
    useSCP().setTitle(`${stockInfo.value.symbol} - ${stockInfo.value.name_vi}`)
    

    function onChangeTab(active) {
        activeTab.value = active
    }

</script>
<style scoped>
:deep(.ps-9) {
    padding-inline-start: 2.25rem !important;
}
</style>