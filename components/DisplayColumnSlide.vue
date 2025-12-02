<template>
  <USlideover v-model="isOpen" side="left">
    <UCard class="flex flex-col h-full font-averta" :ui="{
      body: { base: 'flex-1 overflow-hidden', padding: 'p-4 sm:p-4' },
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      footer: { base: '', padding: 'p-4 sm:p-4' }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ $t('Select display columns') }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpen = false" />
        </div>
      </template>

      <div class="overflow-y-auto space-y-6" style="max-height: calc(100vh - 200px);">
        <draggable v-model="colItems">
          <template v-for="element in colItems.filter(item => item.is_show === true)" :key="element.id">
            <div class="flex items-center justify-between py-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-ellipsis-vertical-20-solid"
                  class="drag-handle text-gray-400 cursor-grab active:cursor-grabbing" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t(element.label) }}</span>
              </div>
              <UToggle v-if="!hardColumns.includes(element.key)" v-model="element.is_show" />
            </div>
          </template>
        </draggable>
        <UDivider class="my-2" />
        <div v-for="element in colItems.filter(item => item.is_show == false)" :key="element.id">
          <div class="flex items-center justify-between py-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t(element.label) }}</span>
            <UToggle v-model="element.is_show" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <UButton icon="i-heroicons-check-circle" color="primary" size="md" :label="$t('Save')"
            @click.prevent="onApplyDisplay" />
          <UButton icon="f7:arrow-2-circlepath" color="gray" size="md" :label="$t('Reset')" @click="onResetDisplay" />
        </div>
      </template>
    </UCard>
  </USlideover>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const colorMode = useColorMode()
import { useDisplayColStore } from '@/stores/column'
import { storeToRefs } from 'pinia'
const columnStore = useDisplayColStore()
const { currentColumn, page, isOpen } = storeToRefs(columnStore)
const { setColumnModal, clearColumn, setColumn } = columnStore

const hardColumns = ['name', 'full_name', 'employee_code', 'code', 'customer_code', 'backlog', 'todo', 'in_progress', 'completed']
// Reactive reference for draggable items (only non-disabled columns)
const colItems = ref([])

// Watch for changes in currentColumn to update colItems
watch(() => currentColumn.value, (newVal) => {
  colItems.value = newVal
  
}, { immediate: true })

// Watch for changes in colItems to update currentColumn order
watch(() => colItems.value, (newOrder) => {
  // Create a map of the new order
  const orderMap = newOrder.reduce((acc, item, index) => {
    acc[item.key] = index
    return acc
  }, {})
  
  // Sort currentColumn based on the new order
  currentColumn.value.sort((a, b) => {
    const aIndex = orderMap[a.key] !== undefined ? orderMap[a.key] : Infinity
    const bIndex = orderMap[b.key] !== undefined ? orderMap[b.key] : Infinity
    return aIndex - bIndex
  })
}, { deep: true })

const onApplyDisplay = () => {
  isOpen.value = false
  setColumn(page.value, currentColumn.value);
};

const onResetDisplay = () => {
  clearColumn(page.value);
  setColumnModal(true, page.value) //This line for reset the currentColumn
  // isOpen.value = false;
}
</script>
