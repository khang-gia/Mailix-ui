<template>
  <nav
    class="px-2 relative w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E2E]">
    <ul v-if="viewMode === 'list'" class="flex items-center min-w-0">
      <li class="min-w-0" v-for="(link, index) in links" :key="index">
        <UButton color="" variant="ghost"
          class="transition-all  outline-none group relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm
             focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2
              focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75 before:absolute
               before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 text-gray-500 dark:text-gray-400"
          :class="listTab === index ? 'active' : 'inactive'" @click="listTab = index">
          <UIcon v-if="link.icon" :name="link.icon" class="icon" :class="listTab === index ? 'active' : 'inactive'" />
          <span class="text-sm font-averta">{{ link.label }}</span>
          <!-- <UBadge color="gray" variant="solid" size="xs" class="px-1 py-0" :ui="{ rounded: 'rounded' }">{{ useUserStore() }}</UBadge> -->
        </UButton>
      </li>
    </ul>
    <div v-else class="flex items-center gap-2 py-2">
      <UButton color="gray" variant="soft" size="sm" icon="i-heroicons-adjustments-vertical"
        @click="setColumnModal(true, 'work_kanban')">
        {{ $t('Display') }}
      </UButton>

      <!-- Filters Dropdown -->
      <WorkKanbanFilters />
    </div>

    <!-- View Switcher Tabs -->
    <div class="">
      <UTabs v-model="viewModeIndex" :items="viewTabs" :ui="{
        wrapper: '',
        list: {
          tab: {
            icon: ''
          }
        }
      }" />
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useDisplayColStore } from '@/stores/column'

const columnStore = useDisplayColStore()
const { setColumnModal } = columnStore

const { t } = useI18n();

const listTab = defineModel({ default: 0 })
const viewMode = defineModel('viewMode', { default: 'list' })

const viewTabs = [
  {
    icon: 'i-heroicons-list-bullet',
    value: 'list'
  },
  {
    icon: 'hugeicons:kanban',
    value: 'kanban'
  }
]

const viewModeIndex = computed({
  get: () => viewMode.value === 'list' ? 0 : 1,
  set: (index) => {
    if (viewMode.value === 'kanban') {
      listTab.value = 0
    }
    viewMode.value = viewTabs[index].value
  }
})

const links = [{
  label: t('All')
}, {
  label: t('In progress'),
}, {
  label: t('Assigned work'),
}, {
  label: t('Unassigned work')
},
{
  label: t('Assigned by me')
}]

</script>

<style scoped>
.active {
  @apply text-gray-900 dark:text-white after:bg-[#147FE0] dark:after:bg-[#147FE0] after:rounded-full
}

.active.icon {
  @apply text-gray-700 dark:text-gray-200
}

.inactive {
  @apply text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
}

.inactive.icon {
  @apply text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200
}

.icon {
  @apply flex-shrink-0 w-4 h-4 relative
}
</style>