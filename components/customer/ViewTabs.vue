<template>
    <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
      <div class="flex items-center">
        <UDropdown :items="listViewDropdown" :popper="{ placement: 'bottom-start' }" 
        :ui="{
            container:'w-fit',
            item:{
                padding: 'px-2 py-3',
            }
        }"
        >
            <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-vertical" />
            <!-- <template #unsort="{item}">
                <UIcon :name="item.icon" class="h-4 w-4 ml-1" />
                <span class="px-2 font-averta font-medium">{{ item.label }}</span>
            </template>
            <template #ungroup="{item}">
                <UIcon :name="item.icon" class="h-4 w-4 ml-1"/>
                <span class="px-2 font-averta font-medium">{{ item.label }}</span>
            </template>
            <template #remove_column="{item}">
                <UIcon :name="item.icon" class="h-4 w-4 ml-1" />
                <span class="px-2 font-averta font-medium">{{ item.label }}</span>
            </template> -->
        </UDropdown>
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
                <span class="truncate">{{ item.label }}</span>

                <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
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
        <UDropdown v-if="selectedUsers.length > 0" :items="actionSelected" :ui="{
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
      <div class="flex justify-end">
          
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-up-tray" :label="$t('Import')" size="xs" :to="{name: 'hr-upload'}"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-down-tray" :label="$t('Export')" size="xs"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-cog-6-tooth" :label="$t('Setting')" size="xs" :to="{name: 'hr-setting'}"/>
      </div>
    </div>
    
    <div class="p-2">
      <UCard :ui="{body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
        <CustomerTable :customers="customers" :page-total="pageTotal" :page="page" @update:page="page=$event" @update:selected="selectedUsers=$event"/>
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

const modalStore = useModalStore()
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { setAlertModal } = modalStore
const pageTotal = ref(200)
const page = ref(1)
const pageSize = ref(10)
const pageFrom = computed(() => (page.value - 1) * pageSize.value + 1)
const pageTo = computed(() => Math.min(page.value * pageSize.value, pageTotal.value))
const selectedUsers = ref([])
const props = defineProps({
  filters: {
    type: String,
    default: ''
  }
})
const userFilter = computed({
  get: () => ({
    status: 'Working',
    ordering: undefined,
    group: undefined,
    page: page.value,
    pageSize: pageSize.value,
    ...props.filters
  }),
  set: (filterValue) => {
    Object.assign(userFilter.value, filterValue);
  }
});
const reload = ref(false);
const customers = computedAsync(async () => {
  const params = {
    ...userFilter.value
  }
  const data = await useAPI().$get('core/customers/', { 
    ...params,
    reload: reload.value,
    page: page.value,
    page_size: pageSize.value,
  })
  console.log('data', data)
  pageTotal.value = data.count
  return data.results
})
const displayColumns = ref([
])
const listViewDropdown = ref([ 
  [{
      label: t('Sort'),
      icon: 'i-heroicons-funnel',
      slot: "sort",
      click: () => {
        console.log('hehe')
      }
    },{
      label: t('Group by'),
      icon: 'i-heroicons-rectangle-group',
      slot:"group",
      click: () => {
        console.log('hehe')
      }
    },{
      label: t('Select display columns'),
      icon: 'i-heroicons-view-columns',
      click: () => {
        console.log('hehe')
      }
    }]
    , [{
      label: t('Unsort'),
      icon: 'i-heroicons-x-mark',
      slot: 'unsort',
      disabled: userFilter.ordering === undefined,
      click: () => {
        console.log('hi')
      }
    },{
      label: t('Ungroup'),
      icon: 'i-heroicons-x-mark',
      slot: 'ungroup',
      disabled: userFilter.group === undefined,
      click: () => {
        console.log('hi')
      }
    },
    {
      label: t('Remove display columns'),
      icon: 'i-heroicons-x-mark',
      slot: 'remove_column',
      disabled: displayColumns.value.length===0,
      click: () => {
        console.log('hi')
      }
    }]
])
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
const detailViewDropDown = ref([
    [{
        label:t('Choose view type detail'),
        slot: 'tip',
        disabled: true
    }],
    [{
      label: t('Default'),
      icon: 'flowbite:window-outline',
      click: () => {
        console.log('hi')
      }
    },{
      label: t('Slide'),
      icon: 'material-symbols:transition-slide-outline',
      click: () => {
        console.log('hi')
      }
    }]
])
const deleteProfile = async () => {
  try {
      const response = await useAPI().post(`core/profile_hrs/delete_users/`, {
        profiles: selectedUsers.value.map(user => user.id)
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
          profiles: selectedUsers.value.map(user => user.id)
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
  }],[
    {
      key: 'deactivate',
      label: t('Deactivate'),
      slot: 'deactivate',
      icon: 'i-humbleicons:lock',
      click: () => {
        setAlertModal(true, {
          message: t('Are you sure you want to deactivate these profiles?'),
          confirmButton: t('OK'),
          denyButton: t('Cancel'),
        }) 
        const unwatch = watch(
          () => alertModal.value,
          async (newVal) => {
            if (!newVal) {
              if (alertConfirm.value) {
                const isDeactivated = await deactivateProfile();
                if (isDeactivated) {
                  reload.value = !reload.value
                  useToast().add({
                    title: t('Success'),
                    description: t('Profile deactivated successfully'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                  });
                } else {
                  useToast().add({
                    title: t('Error'),
                    description: t('Profile deactivation failed'),
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
    }
  ]
]

</script>