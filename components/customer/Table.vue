<template>
    <div class="bg-white dark:bg-[#1E1E2E] rounded-md">
        <UTable v-model="_selected" v-model:sort="sort" sort-mode="manual" @update:sort="page = 1" :columns :rows="customers" 
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
                <span class="text-sm italic font-medium text-mailix-primary dark:text-white cursor-pointer" @click="selectCustomer(row)">{{ row.name }}</span>
            </div>
        </template>
        <template #customer_code-data="{ row }">
            <div class="flex items-center space-x-2">
                <span class="text-sm italic font-medium text-mailix-primary dark:text-white cursor-pointer" @click="selectCustomer(row)">{{ row.customer_code }}</span>
            </div>
        </template>
        <template #customer_source-data="{ row }">
            <span v-if="row.customer_source" class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(row.customer_source)}}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
        </template>
        <template #type_of_customer-data="{ row }">
            <span v-if="row.type_of_customer" class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(row.type_of_customer)}}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500"> --</span>
        </template>
        <template #customer_group-data="{ row }">
            <span v-if="row.customer_group" class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(row.customer_group) }}</span>
            <span v-else class="text-sm italic text-slate-400 dark:text-gray-500"> --</span>
        </template>
        <template #created_at-data="{row}">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ row.created_at?dayjs(row.created_at).format('YYYY-MM-DD'):'' }}</span>
        </template >
        <template #curators-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.curators && row.curators.length">
                <div v-for="curator in row.curators" :key="curator.id">
                    <NuxtLink v-if="curator.profile_hr" :to="{ name: 'hr-id', params: { id: curator.profile_hr.id } }">
                        <UTooltip :text="curator.display_name">
                            <UAvatar :src="curator.avatar" :alt="curator.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No curators assigned')}}</span>
            </div>
        </template>
        <template v-for="column in _customerColumn.filter(item => !excludeColumns.includes(item.key))" :key="column.key" #[`${column.key}-data`]="{ row }">
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
const { customerColumn } = storeToRefs(columnStore)
const props = defineProps({
  customers: {
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
const excludeColumns = ['curators', 'name', 'customer_code', 'created_at','customer_source','type_of_customer','customer_group']
const _customerColumn = computed(() => {
  const cols = customerColumn.value.filter(item => item.is_show === true)
  return cols.map(col => ({
    ...col,
    label: t(col.label)
  }))
})
const columns = [
    {   
        key: 'name',
        label: t('Customer Name'),
        sortable: true,
    },
    {
        key: 'customer_code',
        label: t('Customer Code'),
        sortable: true,
    },
    {
        key: 'company_name',
        label: t('Company/Organization Name'),
        sortable: true,
    },
    {
        key: 'phone',
        label: t('Phone'),
        sortable: true,
    },
    {
        key: 'email',
        label: "Email",
        sortable: true,
    },
    {
        key: 'address',
        label: t('Address'),
        sortable: true,
    },
    {
        key: 'curators',
        label: t('Assigned to'),
        sortable: true,
    },
    {
        key: 'customer_source',
        label: t('Customer Source'),
        sortable: true,
    },
    // {
    //     key: 'level',
    //     label: t('Level'),
    //     sortable: true,
    // },
    {
        key: 'customer_group',
        label: t('Customer Group'),
        sortable: true,
    },
    {
        key: 'type_of_customer',
        label: t('Type of customer'),
        sortable: true,
    },
    {
        key: 'created_at',
        label: t('Created At'),
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
const selectCustomer =  (row) => {
  const userId = row.id
  if (props.viewMode === 'new_tab') {
    const routeData = useRouter().resolve({ name: 'customers-id', params: { id: userId } });
    window.open(routeData.href, '_blank')
  } else {
    useRouter().push({ name: 'customers-id', params: { id:userId } });
  }
}
</script>