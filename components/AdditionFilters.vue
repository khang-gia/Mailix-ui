<template>
    <USlideover v-model="isOpenFilter" >
      <UCard class="flex flex-col flex-1 font-averta" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ $t('Additional Filters') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpenFilter = false" />
          </div>
        </template>

        <div class="h-full space-y-6">
          <UFormGroup
              v-if="checkView('type_of_customer')"
              :label="$t('Type of contact')"
              name="type_of_customer">
              <USelectMenu
                  class="w-full"
                  v-model="currentFilter.type_of_customer"
                  :options="type_of_customers"
                  :placeholder="$t('Type of contact')"
                  valueAttribute="value"
                  option-attribute="label"
                  :is-dark="colorMode.value === 'dark'"
              />
            </UFormGroup>
          <UFormGroup
              v-if="checkView('customer_source')"
              :label="$t('Contact Source')"
              name="customer_source">
              <USelectMenu
                  class="w-full"
                  v-model="currentFilter.customer_source"
                  :options="customer_sources"
                  :placeholder="$t('Contact Source')"
                  valueAttribute="value"
                  option-attribute="label"
                  :is-dark="colorMode.value === 'dark'"
              />
            </UFormGroup>
            <UFormGroup
                v-if="checkView('customer_group')"
                :label="$t('Customer Group')"
                name="customer_group">
                <USelectMenu
                    class="w-full"
                    v-model="currentFilter.customer_group"
                    :options="customer_groups"
                    :placeholder="$t('Customer Group')"
                    valueAttribute="value"
                    option-attribute="label"
                    :is-dark="colorMode.value === 'dark'"
                />
            </UFormGroup>
            <UFormGroup
                v-if="checkView('curators')"
                :label="$t('Curators')"
                name="curators">
                <CustomerUserSelect v-model="currentFilter.curators" :placeholder="$t('Curators')" :multiple="true"/>
            </UFormGroup>
          <UFormGroup v-if="checkView('status')" :label="$t('Status')">
            <USelectMenu v-model="currentFilter.statuses" :options="statusOptions" size="sm" :ui="{ base: 'w-full' }" valueAttribute="value">
              <template #label>
                <span class="truncate">{{$t('Status')}}: {{ statusOptions.find((item) => item.value === currentFilter.status)?.label || $t('All') }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup v-if="checkView('work_status')" :label="$t('Status')">
            <USelectMenu 
              v-model="currentFilter.statuses" 
              :options="work_statuses" 
              :placeholder="$t('Status')"
              size="sm" 
              :ui="{ base: 'w-full' }" 
              option-attribute="label"
              by="id"
              multiple
              :is-dark="colorMode.value === 'dark'">
              <template #label>
                <span v-if="currentFilter.statuses.length" class="truncate">{{ currentFilter.statuses.map(status => status.label).join(', ') }} </span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup v-if="checkView('work_priority')" :label="$t('Priority')">
            <PrioritySelect v-model="currentFilter.priority" :placeholder="$t('Priority')"/>
          </UFormGroup>
          <UFormGroup v-if="checkView('assigned_to')" :label="$t('Work assigned to')">
            <CustomerUserSelect v-model="currentFilter.assigned_tos" :placeholder="$t('Work assigned to')" :multiple="true"/>
          </UFormGroup>
          <UFormGroup v-if="checkView('assigned_by')" :label="$t('Assigned by')">
            <CustomerUserSelect v-model="currentFilter.assigned_bys" :placeholder="$t('Assigned by')" :multiple="true"/>
          </UFormGroup>
          <UFormGroup v-if="checkView('managers')" :label="$t('Manager')">
            <CustomerUserSelect v-model="currentFilter.managers" :placeholder="$t('Manager')" :multiple="true"/>
          </UFormGroup>
          <UFormGroup
              v-if="checkView('department')"
              :label="$t('Department')">
              <DepartmentSelectMulti v-model="currentFilter.departments" :placeholder="$t('Department')" :multiple="true"/>
          </UFormGroup>
          <UFormGroup
              v-if="checkView('direct_manager')"
              :label="$t('Direct manager')">
              <CustomerUserSelect v-model="currentFilter.direct_managers" :placeholder="$t('Direct manager')" :multiple="true"/>
          </UFormGroup>
          
        </div>
        <template #footer>
            <div class="flex justify-center space-x-4">
                <UButton icon="i-heroicons-funnel" color="primary" size="sm" :label="$t('Filter')" @click.prevent="onApplyFilters"/>
                <UButton icon="f7:arrow-2-circlepath" color="gray" size="sm" :label="$t('Reset')" @click="onResetFilters"/>
            </div>
        </template>
      </UCard>
    </USlideover>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const colorMode = useColorMode()
import lodash from 'lodash'; 
const { cloneDeep } = lodash; 
// const isOpenFilter = defineModel({ default: false })
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import DepartmentSelectMulti from "./core/DepartmentSelectMulti.vue";
const filterStore = useFilterStore()
const { currentFilter, filterType, isOpenFilter } = storeToRefs(filterStore)
const { setFilterModal, clearFilter, setFilter } = filterStore

const emit = defineEmits(['update:addtionFilters'])
const statusOptions = [
  { label: t('All'), value: null },
  { label: t('Active'), value: 'active' },
  { label: t('Inactive'), value: 'inactive' },
]
const work_statuses = [
  { label: t('Not Started'), id: 1 },
  { label: t('In Progress'), id: 2 },
  { label: t('Completed'), id: 3 },
  { label: t('On Hold'), id: 4 },
  { label: t('Cancelled'), id: 5 },
  { label: t('Deferred'), id: 6 },
  { label: t('Waiting for Review'), id: 7 },
  { label: t('Approved'), id: 8 },
  { label: t('Rejected'), id: 9 },
  { label: t('Pending'), id: 11 },
  { label: t('Success'), id: 12 },
  { label: t('Archived'), id: 13 },
  { label: t('Deleted'), id: 14 },
  { label: t('Draft'), id: 15 },
];
const viewAllow = ref({
  profile_hrs:['department','position','title','direct_manager','role','profile_status'],
  contacts:['customer_source','type_of_customer','curators','created_at'],
  customers:['customer_source','type_of_customer','curators','customer_group','created_at'],
  works:['work_status','progress','work_priority','assigned_to','assigned_by','managers','start_date','end_date','actual_start_date'],
})
const checkView = (key) => {
  return viewAllow.value[filterType.value]?.includes(key);

}
const type_of_customers = [
    {label: t('Personal'), value: 1},
    {label: t('Organization'), value: 2},
]
const customer_sources = [
    {label: 'Facebook', value: 1},
    {label: 'Instagram', value: 2},
    {label: 'Google', value: 3},
    {label: t('Old customer referral'), value: 4},
    {label: t('Website'), value: 5},
    {label: t('Self-searching'), value: 6},
    {label: t('Switchboard'), value: 7},
    {label: t('Broker'), value: 8},
    {label: t('Sale data'), value: 9},
]
const customer_groups = [
    {label: t('Loyal Customer'), value: 1},
    {label: t('Former Customer'), value: 2},
    {label: t('Potential Customer'), value: 3},
    {label: t('Casual Customer'), value: 4},
    {label: t('Newly acquired lead'), value: 5},
    {label: t('Nurturing customer lead'), value: 6},
    {label: 'VIP', value: 7},
    {label: 'VVIP', value: 8},
]
const company_types = [
    { label: t('Limited Liability Company'), value: 1 },
    { label: t('Joint Stock Company'), value: 2 },
    { label: t('Partnership'), value: 3 },
    { label: t('Sole Proprietorship'), value: 4 },
    { label: t('State-owned Enterprise'), value: 5 },
    { label: t('Foreign Enterprise'), value: 6 },
    { label: t('Cooperative'), value: 7 },
    { label: t('Non-profit Organization'), value: 8 },
];
const contact_statuses = [
    { value: 1, label: t('New') },
    { value: 2, label: t('1st Contacted') },
    { value: 3, label: t('2nd Contacted') },
    { value: 4, label: t('Consulting') },
    { value: 5, label: t('Negotiating') },
    { value: 6, label: t('Contracted') },
    { value: 7, label: t('Quoted') },
    { value: 8, label: t('Old Customer') },
    { value: 10, label: t('Others') },
];

const onApplyFilters = () => {
  isOpenFilter.value = false
  setFilter(filterType.value, currentFilter.value);
};
const onResetFilters = () => {
  Object.keys(currentFilter.value).forEach(key => {
    if (Array.isArray(currentFilter.value[key])) {
      currentFilter.value[key] = [];
    } else if (typeof currentFilter.value[key] === 'object') {
      currentFilter.value[key] = {};
    } else {
      currentFilter.value[key] = null;
    }
  });
  clearFilter(filterType.value);
  isOpenFilter.value = false;
}
// const initializeFilters = () => {
//   Object.assign(currentFilter, cloneDeep(props.filters));
// };

// watchEffect(() => {
//   if (isOpenFilter) {
//     initializeFilters();
//   }
// });
</script>