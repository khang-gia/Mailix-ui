<template>
    <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
      <div class="flex items-center">
        <!-- <UDropdown :items="listViewDropdown" :popper="{ placement: 'bottom-start' }" 
        :ui="{
            container:'w-fit',
            item:{
                padding: 'px-2 py-3',
            }
        }"
        >
            <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-vertical" />
        </UDropdown> -->
        <UDropdown :items="detailViewDropDown" :popper="{ placement: 'bottom-start' }">
            <UButton color="gray" variant="ghost" icon="hugeicons:file-view" />
            <template #tip="{ item }">
                <div class="text-left cursor-text">
                    <p>
                    {{$t('Choose view type detail')}}
                    </p>
                </div>
            </template>
            <template #item="{ item }">
                <span class="truncate" :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }"> {{ item.label }}</span>
                <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }" />
            </template>
        </UDropdown>
        <div class="px-2 flex items-center gap-1.5 border-l border-slate-300">
            <span class="text-sm leading-5">{{$t('records per page')}}:</span>
            <USelect
                v-model="pageSize"
                :options="[3, 5, 10, 20, 50, 80, 100]"
                class="me-2 w-fit"
                size="xs"
                @change="page = 1"
            />
        </div>

        <div class="flex items-center gap-3 border-l border-slate-300 pr-3">
            <span class="text-sm leading-5 pl-2">
                {{$t('Showing')}}
                <span class="font-medium">{{ pageFrom }}</span>
                {{$t('to')}}
                <span class="font-medium">{{ pageTo }}</span>
                {{$t('of')}}
                <span class="font-medium">{{ pageTotal }}</span>
                {{$t('records')}}
            </span>
        </div>
        <UDropdown v-if="selectedDepartments.length > 0" :items="actionSelected" :ui="{
            container:'w-fit',
            item:{
                padding: 'px-2 py-3',
            }
        }">
          <UButton
            icon="i-heroicons-chevron-down"
            color="gray"
            size="xs"
          >
          </UButton>
        </UDropdown>
      </div>
      <!-- <div class="flex justify-end">
          
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-up-tray" :label="$t('Import')" size="xs" :to="{name: 'hr-upload'}"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-down-tray" :label="$t('Export')" size="xs"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-cog-6-tooth" :label="$t('Setting')" size="xs" :to="{name: 'hr-setting'}"/>
      </div> -->
    </div>
    
    <div class="p-2">
      <UCard :ui="{body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
        <DepartmentTable :departments="departments" :page-total="pageTotal" :page="page" @update:page="page=$event" @update:selected="selectedDepartments=$event" :viewMode="viewMode"/>
        <template #footer>
          <div class="flex justify-end items-center space-x-2">
            <UPagination :max="3" :page-count="pageSize" :total="pageTotal" v-model="page"/>
          </div>
        </template>
      </UCard>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { useFilterStore } from '@/stores/filter'
// const filterStore = useFilterStore()
// const { setFilterModal, clearFilter} = filterStore

// const { customerFilter } = storeToRefs(filterStore)

const modalStore = useModalStore()
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { setAlertModal } = modalStore
const pageTotal = ref(200)
const page = ref(1)
const pageSize = ref(10)
const pageFrom = computed(() => (page.value - 1) * pageSize.value + 1)
const pageTo = computed(() => Math.min(page.value * pageSize.value, pageTotal.value))
const selectedDepartments = ref([])
const props = defineProps({
  filters: {
    type: String,
    default: ''
  }
})
const mainFilter = computed({
  get: () => ({
    ordering: undefined,
    group: undefined,
    page: page.value,
    pageSize: pageSize.value,
    ...props.filters
  }),
  set: (filterValue) => {
    Object.assign(mainFilter.value, filterValue);
  }
});
const reload = ref(false);
const departments = computedAsync(async () => {
  // const processedAdditionalFilter = {};
  // for (const key in customerFilter.value) {
  //   if (Array.isArray(customerFilter.value[key])) {
  //     processedAdditionalFilter[key] = customerFilter.value[key].map(item => item.id || item).join(',');
  //   } else {
  //     processedAdditionalFilter[key] = customerFilter.value[key];
  //   }
  // }
  const params = {
    ...mainFilter.value,
  }
  const data = await useAPI().$get('system/departments/', { 
    ...params,
    reload: reload.value,
    page: page.value,
    page_size: pageSize.value,
    stage: 2,
  })
  console.log('data', data)
  pageTotal.value = data.count
  return data.results
})
const displayColumns = ref([
])
// const listViewDropdown = ref([ 
//   [
//     {
//       label: t('Filter by'),
//       icon: 'i-heroicons-funnel',
//       slot:"group",
//       click: () => {
//         setFilterModal(true, 'departments')
//       }
//     },{
//       label: t('Select display columns'),
//       icon: 'i-heroicons-view-columns',
//       click: () => {
//         console.log('hehe')
//       }
//     }]
//     , [
//     {
//       label: t('Clear filter'),
//       icon: 'i-heroicons-x-mark',
//       slot: 'ungroup',
//       click: () => {
//         clearFilter('departments')
//       }
//     },
//     {
//       label: t('Remove display columns'),
//       icon: 'i-heroicons-x-mark',
//       slot: 'remove_column',
//       disabled: displayColumns.value.length===0,
//       click: () => {
//         console.log('hi')
//       }
//     }]
// ])
const sortItemDropDown = ref([ 
  [{
      label: t('Employee code'),
    },{
      label: t('TK code'),
    },{
      label: t('Fullname'),
    },{
      label: t('Department'),
    },{
      label: t('Department code'),
    },{
      label: t('Position'),
    },{
      label: t('Title'),
    },{
      label: t('Level'),
    },{
      label: t('Join Date'),
    },{
      label: t('Dob'),
    },{
      label: t('Gender'),
    },{
      label: t('Date create account'),
    },{
      label: t('ID Profile hr'),
    }]
])
const viewMode=ref('default')
const detailViewDropDown = ref([
    [{
        label:t('Choose view type detail'),
        slot: 'tip',
        disabled: true
    }],
    [{
      label: t('Default'),
      selectedName:'default',
      icon: 'flowbite:window-outline',
      click: () => {
        viewMode.value='default'
      }
    },
    // {
    //   label: t('Slide'),
    //   icon: 'material-symbols:transition-slide-outline',
    //   click: () => {
    //     console.log('hi')
    //   }
    // },
    {
      label: t('New tab'),
      selectedName:'new_tab',
      icon: 'cuida:open-in-new-tab-outline',
      click: () => {
        viewMode.value = 'new_tab'
      }
    }]
])
const deleteProfile = async () => {
  try {
      const response = await useAPI().del(`system/departments/`, {
        profiles: selectedDepartments.value.map(user => user.id)
      });
      console.log('response', response)
      if (response && response.status.value === 'success') {
          return true;
      } else {
          throw new Error(t('Unexpected response status'));
      }
  } catch (error) {
      console.error('Error deleting fee:', error);
      throw error;
  }
} 
const deactivateProfile = async () => {
  try {
      const response = await useAPI().post(`core/profile_hrs/delete_users/`, {
          profiles: selectedDepartments.value.map(user => user.id)
      });
      if (response && response.status.value === 'success') {
          return true;
      } else {
          throw new Error(t('Unexpected response status'));
      }
  } catch (error) {
      console.error('Error deleting fee:', error);
      throw error;
  }
} 
const actionSelected = [
  [{
    key: 'delete',
    label: t('Delete'),
    slot: 'delete',
    icon: 'i-heroicons-trash',
    click: () => {
      setAlertModal(true, {
        message: t('Are you sure you want to delete these profiles?'),
        confirmButton: t('OK'),
        denyButton: t('Cancel'),
      }) 
      const unwatch = watch(
        () => alertModal.value,
        async (newVal) => {
          if (!newVal) {
            if (alertConfirm.value) {
              const isDeleted = await deleteProfile();
              if (isDeleted) {
                reload.value = !reload.value
                useToast().add({
                  title: t('Success'),
                  description: t('Profile deleted successfully'),
                  icon: 'i-heroicons-check-circle',
                  color: 'green',
                });
              } else {
                useToast().add({
                  title: t('Error'),
                  description: t('Profile deletion failed'),
                  icon: 'i-heroicons-x-circle',
                  color: 'red',
                });
              }
            }
            unwatch();
          }
        }
      )
    }
  }],
  // [
  //   {
  //     key: 'deactivate',
  //     label: t('Deactivate'),
  //     slot: 'deactivate',
  //     icon: 'i-humbleicons:lock',
  //     click: () => {
  //       setAlertModal(true, {
  //         message: t('Are you sure you want to deactivate these profiles?'),
  //         confirmButton: t('OK'),
  //         denyButton: t('Cancel'),
  //       }) 
  //       const unwatch = watch(
  //         () => alertModal.value,
  //         async (newVal) => {
  //           if (!newVal) {
  //             if (alertConfirm.value) {
  //               const isDeactivated = await deactivateProfile();
  //               if (isDeactivated) {
  //                 reload.value = !reload.value
  //                 useToast().add({
  //                   title: t('Success'),
  //                   description: t('Profile deactivated successfully'),
  //                   icon: 'i-heroicons-check-circle',
  //                   color: 'green',
  //                 });
  //               } else {
  //                 useToast().add({
  //                   title: t('Error'),
  //                   description: t('Profile deactivation failed'),
  //                   icon: 'i-heroicons-x-circle',
  //                   color: 'red',
  //                 });
  //               }
  //             }
  //             unwatch();
  //           }
  //         }
  //       )
  //     }
  //   }
  // ]
]

</script>