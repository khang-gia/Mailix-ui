<template>
  <div class="px-2">
    <div>
      <div class="flex justify-between pt-2">
        <div class="flex space-x-1 overflow-x-auto">
          <!--index-->
          <OverlayScrollbarsComponent defer :options="scrollbarOption">
            <div class="flex" style="min-width: 1090px;">
              <ScpIndexCard
                v-for="i in ['VNINDEX','VN30','HNX','UPCOM']"
                :key="i"
                :idx="i"
                :isLast="(i=='UPCOM')">
              </ScpIndexCard>
              <ScpSentimentMini />
            </div>
        </OverlayScrollbarsComponent>
        </div>
        <div class="ml-auto flex" v-if="viewOption.dashboardViewAsPage">
          <BaseFixedPagination :maxPage="maxPage" :currentPage="currentPage" @change="onPageChange"></BaseFixedPagination>
          <hr class="w-px h-8 bg-slate-200 dark:bg-slate-600 block mx-3 mt-1 border-transparent" />
        </div>
        <div class="flex items-center gap-x-5">
          <UDropdown :items="actions" :popper="{ placement: 'bottom-start' }" >
            <UButton
              class="w-10 h-10 p-1.5 shrink-0 rounded"
              size="md"              
              variant="link"
              aria-label="option"
            >
            <!-- <Icon name="ri:more-2-fill" size="24" class="text-primary-500 hover:text-primary-600"/> -->
            <Icon name="heroicons:ellipsis-horizontal-circle" size="24" class="text-slate-500 hover:text-primary-500"/>
            </UButton>
            <template #sort="{ item }">
              <div class="text-left">
                <Icon name="heroicons:arrows-right-left" size="20" class="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2"/>
                <span v-if="!sortable">Sắp xếp</span>
                <span v-else>Hoàn thành sắp xếp</span>
              </div>
            </template>
          </UDropdown>
          <LazyModalDashboardSetting :modalOpen="optionModalOpen" @close-modal="optionModalOpen=false;" />
        </div>
      </div>
    </div>
    <div class="list-container mt-2">
        <ScpMarketPage
            :page="viewOption.dashboardViewAsPage ? currentPage : 0"
            :sortable="sortable"
          />
    </div>
    
  </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { useIndexStore } from '@/stores/market'
import { useStockListStore } from '@/stores/stockList'
import { useViewStore } from '@/stores/view'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue"

definePageMeta({
  title: 'Bảng điện thông minh'
})
const { status } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')
const indexStore = useIndexStore()
const { setIndex, fetchIndex } = indexStore
const stockListStore = useStockListStore()
const { fetchList } = stockListStore
const { maxPage } = storeToRefs(stockListStore)

const viewStore = useViewStore()
const { viewOption, sortable } = storeToRefs(viewStore)

const actions = [
  [{
    label: 'Tùy chỉnh bảng điện',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: (event) => {
      event.stopPropagation()
      // event.preventDefault();
      optionModalOpen.value = true
    }
  }], [{
    label: 'Sắp xếp',
    slot: 'sort',
    disabled: !isAuthenticated.value,
    click: (event) => {
      event.stopPropagation()
      viewStore.toggleSortable()
    }
  }]
]


fetchList({page_size: 100})
fetchIndex()

const currentPage = ref(1)

const onPageChange = (page) => {
  currentPage.value = page
}

const optionModalOpen = ref(false)
const scrollbarOption = {
    scrollbars: { 
        autoHide: 'leave',
        autoHideDelay: 50
    }
}
</script>