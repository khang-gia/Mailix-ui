<template>
    <BaseModal
        v-if="stockInfoModal"
        :modalOpen="stockInfoModal"
        :close-on-click="false"
        @close-modal="close"
        :title="stockInfo.symbol.toUpperCase()"
        :subTitle="stockInfo.name_vi"
        :includeTabs="true"
        size="2xl">
        <template #tabs>
            <div
                class="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent"
                    role="tablist">
                    <li class="mr-2">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-blue-600 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500':
                                activeTab === 0,
                        }" @click.prevent.stop="onChangeTab(0)">Thông tin</a>
                    </li>
                    <li class="mr-2">
                        <a href="#" class="inline-block px-4 py-2" :class="{
                            'border-b-2 text-blue-600 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500':
                                activeTab === 1,
                        }" @click.prevent.stop="onChangeTab(1)">Định giá</a>
                    </li>
                </ul>
            </div>
        </template>
        <template #label>
            <div class="flex flex-row mb-2">            
                <div class="text-xs font-medium mr-2 px-2 py-0.5 h-6 mt-1 rounded uppercase bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {{ stockInfo.exchange }}
                </div>
                <div v-if="stockInfo.industry" :title="stockInfo.industry" class="text-xs font-medium mr-2 px-2 py-0.5 h-6 rounded mt-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 inline-block max-w-28 sm:max-w-max truncate">
                    {{ stockInfo.industry }}
                </div>            
            </div>
        </template>
        <!-- Modal content -->
        <div v-if="activeTab === 0" class="px-5 pt-4 pb-1">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-9">
                    <div class="mb-2">
                        <ScpStockPrice :stock="stockPriceInfo" class="grow" />
                        <!-- <ScpStockVolMatch :stock="stockPriceInfo" /> -->
                    </div>
                    <div class="h-[390px]">
                        <ChartTradingView v-if="stockInfoModal" :symbol="stockInfoSymbol" />
                        <div v-else class="flex justify-center items-center h-full">
                            Vui lòng đăng nhập để sử dụng chart phân tích kỹ thuật
                        </div>
                    </div>
                </div>
                
                <div class="hidden lg:col-span-3 lg:flex">
                    <!-- <ScpStockVolMatch :stock="stockPriceInfo" /> -->
                     <div class="overflow-auto h-[500px]">
                         <ArticleListSmall v-if="articles" :articles="articles.results" />
                     </div>
                </div>
                <!-- <div class="col-span-3">
                    
                </div>
                <div class="col-span-2">
                    
                </div>
                <div class="col-start-6 col-span-2">
                    <ScpStockValuation :priceInfo="stockInfo" />
                </div> -->
            
            </div>
        </div>
        <div v-else-if="activeTab === 1" class="px-5 pt-4 pb-1 space-y-2">
            <ChartEvaluation :symbol="stockInfoSymbol" />
        </div>
        <!-- Modal footer -->
        <div class="px-5 py-4 border-t-2 border-slate-200 dark:border-slate-700">
            <div class="flex flex-wrap space-x-2">
                <UDropdown :items="whiteListItems" :popper="{ placement: 'bottom-start' }" class="inline-flex justify-center items-center" v-if="status=='authenticated'">
                    <UButton color="primary" variant="link" size="md" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500 transition ease-in-out">
                        <Icon name="heroicons:squares-plus-20-solid" size="20"/>
                        Thêm vào danh mục
                    </UButton>
                </UDropdown>

                <div class="grow"></div>
                <UButton color="gray" type="button" @click="close"> Đóng </UButton>
                <NuxtLink :to="`/phan-tich/${stockInfoSymbol}/`" class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" @click="close" target="_blank">
                    Phân tích
                </NuxtLink>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useStockStore } from '@/stores/stock'
import { useWatchListStore } from '@/stores/watchList'

const watchListStore = useWatchListStore()
const { setWatchList, fetchWatchList } = useWatchListStore()
const { watchList, watchListLoaded } = storeToRefs(watchListStore)


const modalStore = useModalStore()
const { stockInfoModal, stockInfoSymbol } = storeToRefs(modalStore)
const { setStockInfoModal, setStockListModal } = modalStore

const stockStore = useStockStore()
const { stocks } = storeToRefs(stockStore)
const { setStock } = stockStore
const showChart = ref(false)
const { $numeralFormat } = useNuxtApp();
const { status, data: userInfo } = useAuth()
const snackbar = useMySnackBar()

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});
const $emit = defineEmits(["close-modal"])

let stockInfo = ref({
    "id": 1225,
    "symbol": "SSI",
    "name_vi": "Công ty Cổ phần Chứng khoán SSI",
    "name_en": "Sai Gon Securities Incorporation",
    "exchange": "HOSE",
    "industry": "Dịch vụ tài chính",
    "company_type": "CK",
    "no_shareholders": 90824,
    "foreign_percent": 0.429,
    "outstanding_share": 1499.1,
    "issue_share": 1501.1,
    "established_year": 1999,
    "no_employees": 1592,
    "stock_rating": 2.6,
    "delta_in_week": 0.006,
    "delta_in_month": -0.013,
    "delta_in_year": 0.632,
    "short_name": "Chứng khoán SSI",
    "industry_en": "Financial Services",
    "industry_id": "300",
    "industry_id_v2": "8777",
    "website": "https://www.ssi.com.vn"
})

let activeTab = ref(0);
const onChangeTab = (tab) => {
    activeTab.value = tab
}


const whiteListItems = computed(() => {
    
    if (!watchList.value || !watchList.value.length) {
        return [[{
            label: 'Tạo danh mục mới',
            icon: 'i-heroicons-plus-20-solid',
            click: () => {               
                setStockListModal(true)
            }

        }]]
    }
    let _items = []

    for (const l of watchList.value) {
        _items.push([{
            label: l.name,
            click: () => {
                addToWatchList(l, stockInfo.value)
            }
        }])
    }
    
    return _items
})

watch(
    () => stockInfoSymbol.value,
    (n, o) => {
        if (n) {
            showChart.value= false
            getStockInfo(n)
            getStockPrice(n)
            showChart.value= true
            getArticles(n)
        }
    }
)

function getStockInfo(symbol) {
    useAPI().get(`/stock/stocks/${symbol}/`)
    .then(({data}) => {
        if (data) {
            stockInfo.value = data.value
        }
        
    })
    
}

async function getStockPrice(symbol) {
    if (stocks.value[symbol]) return
    const {data: _latestPrice} = await useAPI().get('/stock/latest/', {symbols: symbol})
    
    if (_latestPrice.value) {
        for (const s of Object.keys(_latestPrice.value)) {
            setStock(s, _latestPrice.value[s])
        }
    }
}

const stockPriceInfo = computed(() => {
    if (stocks.value[stockInfoSymbol.value]) return stocks.value[stockInfoSymbol.value]
    return {
        symbol: stockInfoSymbol.value,
        last_price: '-',
        change: '-',
        change_percent: 0
    }
})

const close = () => {
    $emit('close-modal')
    // hide modal

    setStockInfoModal(false)
    // reset to first tab
    onChangeTab(0)
    // emit close event
    showChart.value= false
    articles.value = null
}

function addToWatchList(l, stockInfo) {
    useAPI().post(`/stock/user_stock_lists/${l.id}/add/`, {stocks:[stockInfo.id]})
        .then(()=>{
            snackbar.success(`Đã thêm ${stockInfo.symbol} vào danh sách quan tâm ${l.name}`)
            fetchWatchList({created_by: userInfo.value.id})
        })
        .catch((err) => {
            snackbar.error(`${err.data.detail}`, `Đã có lỗi xảy ra`)
        })
}

onMounted(() => {
    if (status.value == 'authenticated' && !watchListLoaded.value) {
        fetchWatchList({created_by: userInfo.value.id})
    }
})

const articleCount = ref(0)
const hasNext = ref(false)
const hasPrev = ref(false)
const articles = ref(null)

const getArticles = (symbol, query={}) => {
    query.related_symbols = symbol
    useAPI().get('/consult/articles', query)
        .then(({data}) => {
            if (data.value) {
                articles.value = data.value
                articleCount.value = data.value.count
                hasNext.value = data.value.next !== null
                hasPrev.value = data.value.previous !== null
            }
        })
}

// const { data: articleTypes } = useAPI().get('/consult/article_types/')
// const { data: articles } = useAPI().get('/consult/articles/?related_symbols=' + stockInfoSymbol.value)
// getArticles()
</script>