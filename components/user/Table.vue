<template>
    <div class="bg-white dark:bg-[#1E1E2E] rounded-md">
        <UTable v-model="_selected" v-model:sort="sort" sort-mode="manual" @update:sort="page = 1" :columns :rows="users" 
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

        </UTable>
    </div>

</template>
<style scoped>

</style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(['update:page', 'update:selected'])
 
const props = defineProps({
  users: {
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
        key: 'employee_code',
        label: t('Employee Code'),
        sortable: true,
    },
    {
        key: 'timekeeping_id',
        label: t('TK code'),
        sortable: true,
    },
    {
        key: 'full_name',
        label: t('Full Name'),
        sortable: true,
    },
    {
        key: 'department_name',
        label: t('Department'),
        sortable: true,
    },
    {
        key: 'position',
        label: t('Position'),
        sortable: true,
    },
    {
        key: 'title',
        label: t('Title'),
        sortable: true,
    },
    {
        key: 'level',
        label: t('Level'),
        sortable: true,
    },
    {
        key: 'join_date',
        label: t('Join Date'),
        sortable: true,
    },
    {
        key: 'dob',
        label: t('Dob'),
        sortable: true,
    },
    {
        key: 'gender',
        label: t('Gender'),
        sortable: true,
    },
    {
        key: 'account_created_at',
        label: t('Date create account'),
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
</script>