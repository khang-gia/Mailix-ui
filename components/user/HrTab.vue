<template>
    <div class="py-2 px-4 bg-white dark:bg-[#1E1E2E] flex justify-start items-center space-x-2">
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
                <span class="px-2 font-sans font-medium">{{ item.label }}</span>
            </template>
            <template #ungroup="{item}">
                <UIcon :name="item.icon" class="h-4 w-4 ml-1"/>
                <span class="px-2 font-sans font-medium">{{ item.label }}</span>
            </template>
            <template #remove_column="{item}">
                <UIcon :name="item.icon" class="h-4 w-4 ml-1" />
                <span class="px-2 font-sans font-medium">{{ item.label }}</span>
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
        <!-- <div class="px-2 flex items-center gap-1.5 border-l border-slate-300">
            <span class="text-sm leading-5">{{$t('profile rows per page')}}:</span>
            <USelect
                v-model="pageSize"
                :options="[3, 5, 10, 20, 50, 80, 100]"
                class="me-2 w-fit"
                size="xs"
            />
        </div> -->

        <div class="flex items-center gap-3 border-l border-slate-300">
            <span class="text-sm leading-5 pl-2">
                {{$t('Showing')}}
                <span class="font-medium">{{ pageFrom }}</span>
                {{$t('to')}}
                <span class="font-medium">{{ pageTo }}</span>
                {{$t('of')}}
                <span class="font-medium">{{ pageTotal }}</span>
                {{$t('profiles')}}
            </span>
            <!-- <UPagination :max="3" :page-count="pageSize" :total="pageTotal" v-model="page" /> -->
        </div>
    </div>
    <div class="p-2">
        <UserTable :users="users" :page-size="pageSize" @update:page-size="pageSize=$event" :page-total="pageTotal" :page="page" @update:page="page=$event"/>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const pageTotal = ref(200)
const page = ref(1)
const pageSize = ref(10)
const pageFrom = computed(() => (page.value - 1) * pageSize.value + 1)
const pageTo = computed(() => Math.min(page.value * pageSize.value, pageTotal.value))

const userFilter = ref(
  {
    status: 'Working',
    ordering: undefined,
    group: undefined,
    page: page.value,
    pageSize: pageSize.value,
  }
)
const users = computedAsync(async () => {
  const {data:data } = await useAPI().get('core/profile_hrs/', { 
    // customer_company_id: userStore.company.id, 
    // search: userStore.search, 
    
    page: page.value, page_size: pageSize.value })
  console.log('data',data.value)
//   total.value = data.value.count
  return data.value.results
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
</script>