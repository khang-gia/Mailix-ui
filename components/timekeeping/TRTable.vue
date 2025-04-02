<template>
    <UTable :columns :rows="users" 
        :sortButton="{icon:'none',type:'string', color: 'none', variant: 'ghost', size: '2xs', square: true } "
        :ui="{
            base: 'w-max',
            wrapper: 'relative overflow-x-auto',
            thead: 'sticky top-0',
            th: {
                base: 'text-center border whitespace-nowrap',
                padding: 'px-4 my-3.5',
                color: 'text-black dark:text-white',
                font: 'font-bold',
                size: 'text-sm'
            },
            td: {
                base: 'whitespace-nowrap border',
                padding: 'mx-4 my-3',
                color: 'text-gray-800 dark:text-gray-300',
                font: '',
                size: 'text-sm'
            },
        }"
        >
        <template v-for="idday in daysInMonth" :key="idday" #[`${idday}-header`]="{column}">
            <div class="grid grid-flow-row -mx-4">
                <span >
                    {{ column.label }}
                </span>
                <UDivider class="w-full"/>
                <span>
                    {{ column.key }}
                </span>
            </div>
            
        </template>
    </UTable>
</template>
<style scoped>
.hidden-button {
  display: none;
}
</style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import dayjs from "dayjs";
const daysInMonth = ref(0)
const props = defineProps({
  pageTotal:{
    type: Number,
    required: true
  },
  page:{
    type: Number,
    required: true
  },
  pageSize:{
    type: Number,
    required: true
  },
  selectedMonth:{
    type:String,
    default: () => dayjs().format("MM-YYYY"),
  }
})
const users = computedAsync(async () => {
  const {data:data } = await useAPI().get('core/profile_hrs/', { 
    // search: userStore.search, 
    page: props.page, page_size: props.pageSize })
  console.log('data',data.value)
  props.pageTotal = data.value.count
  return data.value.results
}) 
const baseColumns = [
    {   
        key: 'employee_code',
        label: t('Employee Code'),
        sortable: true,
        class: "w-fit"
    },
    {
        key: 'full_name',
        label: t('Full Name'),
        sortable: true,
        class: "w-fit"
    },
    {
        key: 'timekeeping_id',
        label: t('TK code'),
        sortable: true,
        class: "w-fit"
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
]
// const dayColumns = computed(() => {
//   const [month, year] = props.selectedMonth.split("-");
//   const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

//   return Array.from({ length: daysInMonth }, (_, i) => ({
//     key: `day_${i + 1}`,
//     label: `${i + 1}`,
//     sortable: false,
//   }));
// });
const dayColumns = computed(() => {
  const [month, year] = props.selectedMonth.split("-");
  daysInMonth.value = dayjs(`${year}-${month}-01`).daysInMonth();

  return Array.from({ length: daysInMonth.value }, (_, i) => {
    const date = dayjs(`${year}-${month}-${i + 1}`);
    const weekday = date.format("ddd"); // Format as short weekday (e.g., "Mon", "Tue")
    return {
      key: `${i + 1}`,
      label: `${weekday}`, // Combine day and weekday
      sortable: false,
    };
  });
});
const columns = computed(() => [...baseColumns, ...dayColumns.value]);
</script>