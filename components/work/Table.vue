<template>
    <div class="bg-white dark:bg-[#1E1E2E] rounded-md">
        <UTable v-model="_selected" v-model:sort="sort" sort-mode="manual" @update:sort="page = 1" :columns="_workColumn" :rows="works" 
        :sortButton="{icon:'none',type:'string', color: 'none', variant: 'ghost', size: '2xs', square: true } "
        :ui="{
            base: 'w-max',
            th: {
                base: 'text-center rtl:text-right border whitespace-nowrap items-center',
                padding: 'px-4 py-3.5',
                color: 'text-black dark:text-white',
                font: 'font-bold',
                size: 'text-sm'
            },
            td: {
                base: 'whitespace-nowrap border',
                padding: 'px-4 py-4',
                color: 'text-gray-800 dark:text-gray-300',
                font: '',
                size: 'text-sm'
            },
        }"
        >
        <template #name-data="{ row }">
            <div class="flex items-center space-x-2">
                <span class="text-sm italic font-medium text-mailix-primary dark:text-white cursor-pointer" @click="selectWork(row)">{{ row.name }}</span>
            </div>
        </template>
        <template #progress-data="{ row }">
            <UProgress :value=row.progress indicator/>
        </template>
        <template #start_date-data="{row}">
            <span v-if="row.start_date" class="text-sm font-medium text-gray-900 dark:text-white">{{ row.start_date?dayjs(row.start_date).format('YYYY-MM-DD'):'' }}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
        </template >
        <template #end_date-data="{row}">
            <span v-if="row.end_date" class="text-sm font-medium text-gray-900 dark:text-white">{{ row.end_date?dayjs(row.end_date).format('YYYY-MM-DD'):'' }}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
        </template >
        <template #actual_start_date-data="{row}">
            <span v-if="row.actual_start_date" class="text-sm font-medium text-gray-900 dark:text-white">{{ row.actual_start_date?dayjs(row.actual_start_date).format('YYYY-MM-DD'):'' }}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
        </template >
        <template #assigned_to-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.assigned_to && row.assigned_to.length">
                <div v-for="user in row.assigned_to" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No user assigned')}}</span>
            </div>
        </template>
        <template #assigned_by-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.assigned_by && row.assigned_by.length">
                <div v-for="user in row.assigned_by" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No assigned by')}}</span>
            </div>
        </template>
        <template #managers-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.managers && row.managers.length">
                <div v-for="user in row.managers" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No manager')}}</span>
            </div>
        </template>
        <template #created_by-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.created_by">
                <NuxtLink v-if="row.created_by.profile_hr" :to="{ name: 'hr-id', params: { id: row.created_by.profile_hr.id } }">
                    <UTooltip :text="row.created_by.display_name">
                        <UAvatar :src="row.created_by.avatar" :alt="row.created_by.display_name" />
                    </UTooltip>
                </NuxtLink>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No creator information')}}</span>
            </div>
        </template>
        <template #status_display-data="{row}">
            <UBadge :color="statusBadge[row.status] || 'gray'"
             variant="solid" size="xs" class="px-2 py-1" :ui="{ rounded: 'rounded' }">
                {{ $t(row.status_display) }}
            </UBadge>
        </template>
        <template v-for="column in _workColumn.filter(item => !excludeColumns.includes(item.key))" :key="column.key" #[`${column.key}-data`]="{ row }">
          <span v-if="row[column.key] !== null && row[column.key] !== undefined && row[column.key] !== ''" class="text-sm font-medium text-gray-900 dark:text-white">
            {{ row[column.key] }}
          </span>
          <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">
            --
          </span>
        </template>
        </UTable>
    </div>

</template>
<style scoped>

</style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(['update:page', 'update:selected'])
const dayjs = useDayjs()
import { useDisplayColStore } from '@/stores/column'
import { storeToRefs } from 'pinia'
const columnStore = useDisplayColStore()
const { workColumn } = storeToRefs(columnStore)
const props = defineProps({
  works: {
    type: Array,
    default: []
  },
  pageTotal:{
    type: Number,
    required: true
  },
  page:{
    type: Number,
    required: true
  },
  viewMode:{
    type: String,
    default: 'default'
  }
})
const _page = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  }
})
const excludeColumns = ['start_date', 'end_date', 'actual_start_date', 'assigned_to','assigned_by','managers','created_by', 'progress', 'name', 'status', 'status_display']
const _workColumn = computed(() => {
  const cols = workColumn.value.filter(item => item.is_show === true)
  return cols.map(col => ({
    ...col,
    label: t(col.label)
  }))
})
const statusBadge = {
    1: 'gray',       // Not Started
    2: 'blue',       // Backlog
    3: 'yellow',     // To Do
    4: 'primary',    // In Progress
    5: 'green',      // Completed
    6: 'orange',     // On Hold
    7: 'red',        // Cancelled
    8: 'indigo',     // Deferred
    9: 'purple',     // Waiting for Review
    10: 'teal',      // Approved
    11: 'red',       // Rejected
    12: 'yellow',    // Pending
    13: 'red',       // Failed
    14: 'green',     // Success
    15: 'gray',      // Archived
    16: 'gray',      // Deleted
    17: 'blue',      // Draft
}

const columns = [
    {   
        key: 'name',
        label: t('Work Name'),
        sortable: true,
    },
    {
        key: 'code',
        label: t('Work Code'),
        sortable: true,
    },
    {
        key: 'progress',
        label: t('Progress'),
        sortable: true,
    },
    {
        key: 'assigned_to',
        label: t('Work assigned to'),
        sortable: true,
    },
    {
        key: 'assigned_by',
        label: t('Work assigned by'),
        sortable: true,
    },
    {
        key: 'managers',
        label: t('Work manage by'),
        sortable: true,
    },
    {
        key: 'start_date',
        label: t('Start date'),
        sortable: true,
    },
    {
        key: 'end_date',
        label: t('End date'),
        sortable: true,
    },
    {
        key: 'actual_start_date',
        label: t('Actual start date'),
        sortable: true,
    },
    {
        key: 'created_by',
        label: t('Created By'),
        sortable: true,
    },
]

const selected = ref([])
const _selected = computed({
  get: () => selected.value,
  set: (val) => {
    selected.value = val; 
    emit('update:selected', val); 
  }
});
const selectWork =  (row) => {
  const userId = row.id
  if (props.viewMode === 'new_tab') {
    const routeData = useRouter().resolve({ name: 'works-id', params: { id: userId } });
    window.open(routeData.href, '_blank')
  } else {
    useRouter().push({ name: 'works-id', params: { id:userId } });
  }
}
</script>