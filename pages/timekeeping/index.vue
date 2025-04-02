<template>
    <div>
        <TimekeepingListTabs v-model="tab"/>
        <div class="py-4 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
          
          <div class="flex items-center space-x-2">
              <div class="px-2 flex items-center gap-1.5 ">
                  <span class="text-sm leading-5">{{$t('profile rows per page')}}:</span>
                  <USelect
                      v-model="pageSize"
                      :options="[3, 5, 10, 20, 50, 80, 100]"
                      class="me-2 w-fit"
                      size="xs"
                  />
              </div>
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
              </div>
              <UPopover>
                  <UButton color="white" variant="ghost" :label="$t('Month')" icon="i-heroicons-calendar-days-20-solid" size="sm"/>
                    <template #panel>
                      <div class="flex justify-between items-center py-2 border-b">
                        <!-- <button @click="decrementYear" class="px-2 py-1 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                          &lt;
                        </button> -->
                        <UButton color="none" variant="ghost" icon="i-heroicons-chevron-left" @click="decrementYear"/>
                        <span class="text-lg font-medium dark:text-white">{{ selectedYear }}</span>
                        <!-- <button @click="incrementYear" class="px-2 py-1 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                          &gt;
                        </button> -->
                        <UButton color="none" variant="ghost" icon="i-heroicons-chevron-right" @click="incrementYear"/>

                      </div>
                      <div class="p-4 grid grid-cols-3 gap-2">
                        <button v-for="month in months"
                          :key="month.value"
                          @click="selectMonth(month.value)"
                          class="px-2 py-2 text-sm font-medium items-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
                          :class="{
                            'bg-gray-300 dark:bg-gray-600': selectedMonth === month.value && selectedYear === currentYear,
                          }"
                        >
                        {{ month.label }}
                        </button>
                      </div>
                    </template>
                </UPopover>
          </div>
          <div class="flex justify-end space-x-2">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-up-tray" :label="$t('Import')" size="xs" :to="{name: 'hr-upload'}"/>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-down-tray" :label="$t('Export')" size="xs"/>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-cog-6-tooth" :label="$t('Setting')" size="xs" :to="{name: 'hr-setting'}"/>
              </div>
        </div>
        <div class="p-2">
          <UCard :ui="{body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
            <TimekeepingTRTable :page="page" :page-size="pageSize" :page-total="pageTotal" :selected-month="selectedMonth + '-' + currentYear"/>
            <template #footer>
                <div class="flex justify-end items-center space-x-2">
                <UPagination :max="3" :page-count="pageSize" :total="pageTotal" v-model="page"/>
                </div>
            </template>
          </UCard>
        </div>
        
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Chấm công'
})
const colorMode = useColorMode()
const tab = ref(0)
const pageSize = ref(10)
const page = ref(1)
const pageFrom = computed(() => (page.value - 1) * pageSize.value + 1)
const pageTo = computed(() => Math.min(page.value * pageSize.value, pageTotal.value))
const pageTotal = ref(200)
const months = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'Sept' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];
const selectedMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())
const selectedYear = ref(new Date().getFullYear());
// Function to handle month selection
const selectMonth = (month) => {
  selectedMonth.value = month;
  currentYear.value = selectedYear.value
};

const incrementYear = () => {
  selectedYear.value++;
};

const decrementYear = () => {
  selectedYear.value--;
};
</script>