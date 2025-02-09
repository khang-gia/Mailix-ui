<template>
  <BaseModal v-if="searchModal" :modalOpen="searchModal" :closeOnClick="true" :closeOnEsc="true"
    @close-modal="closeModal" :noHeader="true">
    <div>
      <div class="flex border-b-2 border-slate-300 dark:border-slate-700">
        <button class="inset-0 right-auto group p-4" type="button" aria-label="Search">
          <svg class="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500" viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path
              d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
          </svg>
        </button>
        <input v-model="searchInputs" autofocus autocomplete="off" name="searchInput"
          class="w-full border-0 focus:ring-transparent bg-white dark:bg-slate-800 placeholder-slate-400 appearance-none pr-4 pl-0"
          type="text" placeholder="Search..." ref="inputRef" @input="onChange($event)"
          @keydown.up.prevent="highlightPrevious" @keydown.down.prevent="highlightNext"
          @keydown.enter.prevent="selectHighlighted" />
      </div>
      <!-- <div class="p-2">
      </div> -->
      <div class=" h-96 overflow-auto px-2">
        <div v-if="!searchInputs" class="text-xs font-semibold text-slate-400 uppercase p-2">Tìm kiếm gần đây
        </div>
        <div v-else-if="dataStock.length" class="text-xs font-semibold text-slate-400 uppercase p-2">Tìm thấy {{
          dataStock.length }} kết quả</div>
        <ul role="list" class="text-sm divide-y dark:divide-slate-700 divide-slate-300 pb-2">
          <div v-if="loading">
            <USkeleton />
          </div>
          <div v-else-if="!dataStock.length && !loading && searchInputs"
            class="flex flex-col justify-center items-center text-lg font-semibold text-slate-400 uppercase px-2 mb-2">
            <Icon size="28" name="carbon:query"></Icon>
            <span class="m-2">
              Không tìm thấy kết quả cho "{{ searchInputs }}"
            </span>
          </div>
            <li v-for="(stock, index) in parseStockPrice()" :key="stock.id" ref="resultRef"
              class="flex justify-between gap-x-6 p-2 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-100"
              :class="{ 'bg-slate-700': highlightedIndex === index }" @click.stop="showStockInfo(stock)">
              <div class="flex min-w-0 gap-x-4">
                <div class="min-w-0 flex-auto">
                  <div class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">{{ stock.symbol }}</div>
                  <div class="mt-1 truncate text-sm leading-5 text-gray-500 dark:text-white">{{ stock.name_vi }}</div>
                </div>
              </div>
              <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ stock.last_price }}</div>
                <div class="mt-1 text-xs font-semibold" :class="colorClass(stock)">
                  {{ stock.change }} / {{ stock.change_percent }}%</div>
              </div>
            </li>
        </ul>
      </div>
    </div>


  </BaseModal>
</template>

<script setup>
import _ from 'lodash'
import { useStockStore } from '@/stores/stock'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const stockStore = useStockStore()
const modalStore = useModalStore()
const { setSearchStocks } = stockStore
const { setStockInfoModal, setSearchModal } = modalStore
const { searchStocks, stocks } = storeToRefs(stockStore)
const { searchModal } = storeToRefs(modalStore)

const props = defineProps(['modalOpen'])
const emit = defineEmits(['close-modal'])
const closeModal = () => {
  highlightedIndex.value = -1
  resetModal()
  setSearchModal(false)
  emit('close-modal')
}
const resetModal = () => {
  searchInputs.value = ''
  dataStock.value = searchStocks.value
}
const searchInputs = ref('')
const inputRef = ref(null);
const loading = ref(false)
const dataStock = ref([])
const stockPrice = ref([])
const highlightedIndex = ref(-1)
const resultRef = ref(null)
const route = useRoute()

const getStocks = async (params) => {
  loading.value = true;
  if (params && params.length > 0) {
    const { data: stockSearch, error } = await useAPI().get("/stock/stocks/", { search: params });
    if (error.value) {
      throw error.value
    }
    dataStock.value = stockSearch.value.results
  }
  else {
    dataStock.value = searchStocks.value
  }
  loading.value = false
}
const colorClass = (stock) => {
  if (stock.last_price == 0) return `scp-text-color--`
  if (stock.change_percent > 6.7) return `scp-text-color-7`
  if (stock.change_percent < -6.7) return `scp-text-color--7`
  if (stock.change_percent == 0) return `scp-text-color---`

  let pInt = stock.change_percent.toString().split('.')[0]
  return `scp-text-color-${pInt}`
}
const parseStockPrice = () => {
  let res = []
  for (const stock of dataStock.value) {
    if (stocks.value[stock.symbol]) {
      res.push({
        ...stock,
        ...stocks.value[stock.symbol]
      })
    }
    else {
      res.push({
        ...stock,
        last_price: '-',
        change: '-',
        change_percent: 0
      })
    }
  }
  return res
}
const onChange = async (event) => {
  try {
    await getStocks(event.target.value)
  } catch (error) {
    console.error("Error fetching stocks: ", error)
  }
}
const showStockInfo = (info) => {
  closeModal()
  console.log("%^&%^", route.name)
  if (route.name === 'phan-tich-symbol') {
    navigateTo(`/phan-tich/${info.symbol}/`)
    return
  }
  setStockInfoModal(true, info.symbol)
  const index = _.findIndex(searchStocks.value, { symbol: info.symbol })
  if (index > -1) {
    searchStocks.value.splice(index, 1)
  }
  setSearchStocks(info)
}
const highlightPrevious = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
    resultRef.value[highlightedIndex.value].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }
}

const highlightNext = () => {
  if (highlightedIndex.value < dataStock.value.length - 1) {
    highlightedIndex.value++
    resultRef.value[highlightedIndex.value].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < dataStock.value.length) {
    showStockInfo(dataStock.value[highlightedIndex.value])
    highlightedIndex.value = -1
  }
}
watch(() => searchModal.value, (open) => {
  open && nextTick(() => inputRef.value.focus())
})
onMounted(() => {
  getStocks()
})
onUnmounted(() => {
  resetModal()
})
defineExpose({
  resetModal
})
</script>