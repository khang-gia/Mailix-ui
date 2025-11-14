<template>
  <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
    <div class="flex items-center">
      <div class="flex items-center gap-3 pr-3">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          <span class="text-primary-500">{{ customerInfo.name }}</span>
        </h1>
      </div>
    </div>
    <div class="flex justify-end">
      <!-- <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-up-tray" :label="$t('Import')" size="xs" :to="{name: 'works-upload'}"/> -->
      <!-- <UButton icon="i-heroicons-pencil-square" label="Cập nhật" @click="editcustomerInfo" /> -->
      <UDropdown :items="actionDropdown" :popper="{ placement: 'bottom-start' }">
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-chevron-double-down" class="border" />
        <template #item="{ item }">
          <span class="truncate" :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }">{{
            item.label }}
          </span>
          <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }" />
        </template>
      </UDropdown>
    </div>
  </div>
  <div class="p-4 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
      <div class="lg:col-span-2">
        <UCard class="p-4 h-full">
          <div class="flex flex-col items-center">
            <img v-if="customerInfo.avatar" :src="customerInfo.avatar" alt="" class="mb-4 rounded-full w-44 h-44" />
            <img v-else :src="customerInfo.gender === 'Male'?'/images/user_male.png':'/images/user_female.png'" alt="" class="mb-4 rounded-full w-44 h-44" />
            <span class="text-mailix-primary text-2xl">{{ customerInfo.name }}</span>
            <span class="text-md text-gray-500 mt-1">{{ customerInfo.customer_code || '--' }}</span>
          </div>

          <UDivider class="my-6" />

          <div class="space-y-4 text-md">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 justify-center text-gray-400" />
              <span class="font-medium truncate items-center">{{ customerInfo.phone || '--' }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 justify-center text-gray-400" />
              <span v-if="customerInfo.mail" class="font-medium truncate cursor-pointer hover:text-blue-700"
                @click="copyToClipboard(customerInfo.mail)">{{ customerInfo.mail }}</span>
              <span v-else class="font-medium truncate">--</span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 justify-center text-gray-400" />
              <span v-if="customerInfo.address" class="font-medium truncate cursor-pointer hover:text-blue-700 "
                @click="copyToClipboard(customerInfo.address)">{{ customerInfo.address }}</span>
              <span v-else class="font-medium truncate">--</span>
            </div>
          </div>
        </UCard>
      </div>
      <div class="lg:col-span-4 md:col-span-2 h-full">
        <UCard class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ $t('Personal Information') }}
              </h2>

            </div>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            
            <!-- <WorkDetailItem label="Contact Name" :value="customerInfo.name" class="md:col-span-1" />
            <WorkDetailItem label="Contact Code" :value="customerInfo.customer_code" class="md:col-span-1" /> -->
            <ContactDetailItem label="Name" :value="customerInfo.name" />
            <ContactDetailItem label="Customer title" :value="customerInfo.title" />
            
            <ContactDetailItem label="Dob" :value="customerInfo.dob?dayjs(customerInfo.dob).format('YYYY-MM-DD'):''" />
            <ContactDetailItem label="Gender" :value="customerInfo.gender" />
            <ContactDetailItem label="Type of contact" :value="customerInfo.type_of_customer_display" />
            
            <ContactDetailItem label="Curators" :value="customerInfo.curators_list" />
            <ContactDetailItem label="Contact Source" :value="customerInfo.customer_source_display" />
            <!-- <WorkDetailItem label="Progress" :value="progress" >

              <template #value>
                <UProgress :value="customerInfo.progress" indicator class="w-32" />
              </template>
            </WorkDetailItem> -->

            <!-- <WorkDetailItem label="End date" :value="dayjs(customerInfo.end_date).format('YYYY-MM-DD HH:mm')" />
            <WorkDetailItem label="Actual start date" :value="dayjs(customerInfo.actual_start_date).format('YYYY-MM-DD')" /> -->
            <ContactDetailItem v-if="customerInfo.status" label="Status" :value="customerInfo.status_display"
              class="md:col-span-1">
              <template #value>
                <UBadge :color="statusMapping[customerInfo.status]" variant="subtle" class="font-semibold">{{
                  $t(customerInfo.status_display)}}</UBadge>
              </template>
            </ContactDetailItem>
            <!-- <WorkDetailItem v-if="customerInfo.priority" label="Priority" :value="customerInfo.priority"
              class="md:col-span-1">
              <template #value>
                <UBadge :color="statusMapping[customerInfo.priority]" variant="subtle" class="font-semibold">{{
                  $t(customerInfo.priority_display)}}</UBadge>
              </template>
            </WorkDetailItem> -->
            <!-- <WorkDetailItem label="Priority" :value="customerInfo.priority" /> -->

            <!-- <UDivider class="md:col-span-2 lg:col-span-3 my-4" /> -->

          </div>


          <UCard class="my-6">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-red-500 dark:text-gray-100">
                  {{ $t('Note') }}
                </h2>
              </div>
            </template>
            <div
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              <span v-if="customerInfo.note" v-html="customerInfo.note"></span>
              <span v-else>{{ $t('No note for this contact...') }}</span>
            </div>
          </UCard>

        </UCard>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-4">
      
      <div class="lg:col-span-3 md:col-span-2">
        <UCard class="">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ $t('Descriptions & Accounting') }}
              </h2>
            </div>
          </template>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
              <ContactDetailItem label="Tax Code" :value="customerInfo.tax_code" />
              <ContactDetailItem label="Id Number" :value="customerInfo.id_number" />
              
            </div>
        </UCard>
      </div>
      <div class="lg:col-span-4 md:col-span-2">
        <UCard class="" :ui="{
          footer: {
            base: 'border-none', padding: 'px-4 py-4 sm:px-6'
          }
        }">
          <UTabs :items="tabs" class="w-full h-full">
            <template #item="{ item }">
              <div class="mt-4">
                <div v-if="item.key === 'discussions'" class="h-full overflow-x-hidden">
                  <CommentsSection comment-type="customers" />
                </div>
                <div v-else-if="item.key === 'activity_log'" class="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                  <div v-for="history in workHistory" :key="history.id"
                    class="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                    <ActivityLogItem :history="history" history-type="contact" />
                  </div>
                </div>
              </div>

            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

definePageMeta({
  title: 'Chi tiết liên hệ',
})

const statusMapping = [
  "none",
  "gray",
  "blue",
  "green",
  "amber",
  "slate",
  "indigo",
  "cyan",
  "emerald",
  "red",
  "yellow",
  "rose",
  "lime",
  "gray",
  "red",
  "purple"
];
const tabs = [{
  label: t('Discussion'),
  key: 'discussions',
}, {
  label: t('Activity Log'),
  key: 'activity_log',
}]
const customerInfo = ref({})
const workHistory = ref([])

const fetchHistory = async () => {
  try {
    const { data: response } = await useAPI().get(`core/customers/${useRoute().params.id}/history/`);
    workHistory.value = response.value
  } catch (error) {
    console.error('Error loading history data:', error);
  }
}
const fetchCustomerInfo = async () => {
  try {
    const { data: response } = await useAPI().get(`core/customers/${useRoute().params.id}/`);
    customerInfo.value = response.value
    customerInfo.value.dob = customerInfo.value.dob ? new Date(customerInfo.value.dob) : null
    // customerInfo.value.end_date = customerInfo.value.end_date ? new Date(customerInfo.value.end_date) : null
    // customerInfo.value.actual_start_date = customerInfo.value.actual_start_date ? new Date(customerInfo.value.actual_start_date) : null
    // customerInfo.value.related_work = customerInfo.value.related_work ? customerInfo.value.related_work.id : '',
    console.log('response', customerInfo.value)
  } catch (error) {
    console.error('Error loading data:', error);
  }
};
const fetchData = async () => {
  try {
    await fetchCustomerInfo();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchHistory();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
fetchData();

const viewMode = ref('default')

const actionDropdown = ref([
  [{
    label: t('Update'),
    icon: 'i-heroicons-pencil-square',
    click: () => {
      useRouter().push({ name: 'contacts-id-update', params: { id: useRoute().params.id } })
    }
  },
  {
    label: t('Add document'),
    icon: 'i-heroicons-arrow-up-on-square',
    click: () => {
      viewMode.value = 'new_tab'
    }
  }]
])
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    useToast().add({
      description: 'Copied to clipboard!',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 1000,
      position: 'top-0',
    })
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>