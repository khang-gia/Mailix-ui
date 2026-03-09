<template>
    <div class="bg-white dark:bg-[#1E1E2E] rounded-md">
        <UTable v-model="_selected" v-model:sort="sort" sort-mode="manual" @update:sort="page = 1" :columns :rows="groups" 
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
                <span class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer" @click="selectCustomer(row)">{{ row.name }}</span>
            </div>
        </template>
        <template #department_type_display-data="{ row }">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(row.department_type_display) }}</span>
        </template>
        <template #parent-data="{ row }">
            <NuxtLink v-if="row.parent" :to="`/groups/${row.parent.id}`" class="text-sm font-medium text-gray-900 dark:text-white">
              {{ row.parent.name }}
            </NuxtLink>
            <span v-else class="text-sm font-medium text-gray-900 dark:text-white"></span>
        </template>
        <template #created_at-data="{row}">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ row.created_at?dayjs(row.created_at).format('YYYY-MM-DD'):'' }}</span>
        </template >
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
 
const props = defineProps({
  groups: {
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
const columns = [
    {   
        key: 'name',
        label: t('Group name'),
        sortable: true,
    },
    {
        key: 'code',
        label: t('Code'),
        sortable: true,
    },
    // {
    //     key: 'resources',
    //     label: t('Resource'),
    //     sortable: true,
    // },
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
const selectGroup =  (row) => {
  const groupId = row.id
  if (props.viewMode === 'new_tab') {
    const routeData = useRouter().resolve({ name: 'groups-id', params: { id: groupId } });
    window.open(routeData.href, '_blank')
  } else {
    useRouter().push({ name: 'groups-id', params: { id:groupId } });
  }
}
</script>