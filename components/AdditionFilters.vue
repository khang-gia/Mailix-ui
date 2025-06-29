<template>
    <USlideover v-model="isOpen" >
      <UCard class="flex flex-col flex-1 font-averta" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ $t('Additional Filters') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div v-if="filters" class="h-full space-y-6">
          <!-- <UFormGroup :label="$t('Status')">
            <USelectMenu
                  class="w-full"
                  v-model="localFilters.status"
                  :options="contact_statuses"
                  :placeholder="$t('Status')"
                  valueAttribute="value"
                  option-attribute="label"
            >
            </USelectMenu>
          </UFormGroup> -->
          <UFormGroup
              v-if="checkView('type_of_customer')"
              :label="$t('Type of contact')"
              name="type_of_customer">
              <USelectMenu
                  class="w-full"
                  v-model="localFilters.type_of_customer"
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
                  v-model="localFilters.customer_source"
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
                    v-model="localFilters.customer_group"
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
                <CustomerUserSelect v-model="localFilters.curators" :placeholder="$t('Curators')" :multiple="true"/>
            </UFormGroup>
          <UFormGroup v-if="checkView('status')" :label="$t('Status')">
            <USelectMenu v-model="localFilters.status" :options="statusOptions" size="sm" :ui="{ base: 'w-full' }" valueAttribute="value">
              <template #label>
                <span class="truncate">{{$t('Status')}}: {{ statusOptions.find((item) => item.value === localFilters.status)?.label || $t('All') }}</span>
              </template>
            </USelectMenu>
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
const isOpen = defineModel({ default: false })
const props = defineProps({
  filters: {
    type: Object,
    default: {}
  },
  view: {
    type: String,
    required: true,
  }
})
const localFilters = reactive(cloneDeep(props.filters));
const emit = defineEmits(['update:addtionFilters'])
const statusOptions = [
  { label: t('All'), value: null },
  { label: t('Active'), value: 'active' },
  { label: t('Inactive'), value: 'inactive' },
]
// const feeTypes = [
//   { label: t('All'), value: null },
//   { label: t('Fee'), value: 'fee' },
//   { label: t('Usage Fee'), value: 'usage' },
//   { label: t('Package Fee'), value: 'package' },
//   { label: t('Usage or Package'), value: 'usage_or_package' },
// ]
const viewAllow = ref({
  profile_hrs:['department','position','title','direct_manager','role','profile_status'],
  contacts:['customer_source','type_of_customer','curators','created_at'],
  customers:['customer_source','type_of_customer','curators','customer_group','created_at'],
})
const checkView = (key) => {
  return viewAllow.value[props.view]?.includes(key);

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
  isOpen.value = false
  emit('update:addtionFilters', cloneDeep(localFilters));
};
const onResetFilters = () => {
  Object.keys(localFilters).forEach(key => {
    if (Array.isArray(localFilters[key])) {
      localFilters[key] = [];
    } else if (typeof localFilters[key] === 'object') {
      localFilters[key] = {};
    } else {
      localFilters[key] = null;
    }
  });
}
const initializeFilters = () => {
  Object.assign(localFilters, cloneDeep(props.filters));
};

watchEffect(() => {
  if (isOpen) {
    initializeFilters();
  }
});
</script>