<template>
  <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
    <div class="flex items-center">
      <div class="flex items-center gap-3 pr-3">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          <span class="text-primary-500">{{ customerInfo.name }}</span>
        </h1>
      </div>
    </div>
    <div class="flex justify-end gap-2 items-center">
      <!-- Status Dropdown -->
      <UDropdown :items="statusDropdownItems" :popper="{ placement: 'bottom-end' }">
        <UButton color="gray" variant="soft" size="sm" icon="i-heroicons-arrow-path">
          {{ $t('Change Status') }}
        </UButton>
        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
        </template>
      </UDropdown>

      <!-- Action Dropdown -->
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
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
      <!-- <div class="lg:col-span-2">
        <UCard class="p-4 h-full">
          <div class="flex flex-col items-center">
            <img v-if="customerInfo.avatar" :src="customerInfo.avatar" alt="" class="mb-4 rounded-full w-44 h-44" />
            <img v-else :src="customerInfo.gender === 'Male'?'/images/user_male.png':'/images/user_female.png'" alt=""
              class="mb-4 rounded-full w-44 h-44" />
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
      </div> -->
      <div class="lg:col-span-4 md:col-span-2">
        <UCard>
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

            <ContactDetailItem label="Dob"
              :value="customerInfo.dob ? dayjs(customerInfo.dob).format('YYYY-MM-DD') : ''" />
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
                  $t(customerInfo.status_display) }}</UBadge>
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
            <UDivider class="md:col-span-2 lg:col-span-3 my-4" />
            <ContactDetailItem label="Phone" :value="customerInfo.phone" />
            <ContactDetailItem label="Email" :value="customerInfo.email" />
            <ContactDetailItem label="Address" :value="customerInfo.address" />
            <UDivider class="md:col-span-2 lg:col-span-3 my-4" />

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
              <span v-else>{{ $t('No note for this customer...') }}</span>
            </div>
          </UCard>

        </UCard>

        <!-- Company Information Card -->
        <UCard v-if="customerInfo.type_of_customer === 2" class="mt-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ $t('Company Information') }}
              </h2>
            </div>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            <ContactDetailItem label="Company Name" :value="customerInfo.company_name" />
            <ContactDetailItem label="Phone" :value="customerInfo.company_phone" />
            <ContactDetailItem label="Email" :value="customerInfo.company_email" />
            <ContactDetailItem label="Tax Code" :value="customerInfo.company_tax_code" />
            <ContactDetailItem label="Address" :value="customerInfo.company_address" />
            <ContactDetailItem label="Company Type" :value="customerInfo.company_type" />
            <ContactDetailItem label="Line of business" :value="customerInfo.line_of_business" />
          </div>
        </UCard>

        <!-- Additional Information Card -->
        <UCard class="mt-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ $t('Additional Information') }}
              </h2>
            </div>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            <ContactDetailItem label="Tax Code" :value="customerInfo.tax_code" />
            <ContactDetailItem label="Id Number" :value="customerInfo.id_number" />
          </div>
        </UCard>
      </div>
      <div class="col-span-2">
        <!-- Activity Log Card (standalone) -->
        <UCard class="mb-4">
          <template #header>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {{ $t('Activity Log') }}
            </h2>
          </template>
          <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div v-for="history in workHistory" :key="history.id"
              class="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
              <ActivityLogItem :history="history" history-type="customer" />
            </div>
          </div>
        </UCard>

        <!-- Tabs Card (Discussion & Attachments) -->
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
                <div v-else-if="item.key === 'attachments'" class="space-y-3">
                  <div v-if="customerAttachments.length === 0"
                    class="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {{ $t('No attachments yet') }}
                  </div>

                  <div v-for="attachment in customerAttachments" :key="attachment.id"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <svg v-if="getFileType(attachment.filename) === 'pdf'" class="h-8 w-8 text-red-500 flex-shrink-0"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd" />
                      </svg>
                      <svg v-else-if="getFileType(attachment.filename) === 'image'"
                        class="h-8 w-8 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="h-8 w-8 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd" />
                      </svg>
                      <div class="flex-1 min-w-0">
                        <a :href="attachment.file" target="_blank"
                          class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate block">
                          {{ attachment.filename || getFileName(attachment.file) }}
                        </a>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ attachment.uploaded_by.display_name }} - {{ formatDate(attachment.created_at) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <UButton icon="i-heroicons-arrow-down-tray" size="xs" color="gray" variant="ghost"
                        :to="attachment.file" target="_blank" />
                      <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost"
                        @click="deleteAttachment(attachment.id)" :loading="deletingAttachment === attachment.id" />
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>

  <!-- Hidden file input for direct file selection -->
  <input ref="fileInputRef" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"
    @change="handleFileSelect" />
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

definePageMeta({
  title: 'Chi tiết khách hàng',
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

// Status options for customer (excluding 2 and 3)
const statusOptions = [
  { value: 1, label: t('New') },
  { value: 4, label: t('Consulting') },
  { value: 5, label: t('Negotiating') },
  { value: 6, label: t('Contracted') },
  { value: 7, label: t('Quoted') },
  { value: 8, label: t('Old Customer') },
];

// Status dropdown items for UDropdown
const statusDropdownItems = [[
  {
    label: t('New'),
    click: () => updateStatus(1)
  },
  {
    label: t('Consulting'),
    click: () => updateStatus(4)
  },
  {
    label: t('Negotiating'),
    click: () => updateStatus(5)
  },
  {
    label: t('Contracted'),
    click: () => updateStatus(6)
  },
  {
    label: t('Quoted'),
    click: () => updateStatus(7)
  },
  {
    label: t('Old Customer'),
    click: () => updateStatus(8)
  }
]];

const selectedStatus = ref(null);

const tabs = [{
  label: t('Discussion'),
  key: 'discussions',
}, {
  label: t('Attachments'),
  key: 'attachments',
}]
const customerInfo = ref({})
const workHistory = ref([])
const customerAttachments = ref([])
const fileInputRef = ref(null)
const deletingAttachment = ref(null)
const uploading = ref(false)

const fetchHistory = async () => {
  try {
    const { data: response } = await useAPI().get(`core/customers/${useRoute().params.id}/history/`);
    workHistory.value = response.value
  } catch (error) {
    console.error('Error loading history data:', error);
  }
}

const fetchAttachments = async () => {
  try {
    const { data: response } = await useAPI().get(`core/customer-attachments/`, {
      customer: useRoute().params.id
    });
    customerAttachments.value = response.value.results || [];
  } catch (error) {
    console.error('Error loading attachments:', error);
  }
}

const fetchCustomerInfo = async () => {
  try {
    const { data: response } = await useAPI().get(`core/customers/${useRoute().params.id}/`);
    customerInfo.value = response.value
    customerInfo.value.dob = customerInfo.value.dob ? new Date(customerInfo.value.dob) : null
    selectedStatus.value = customerInfo.value.status; // Initialize selected status
    console.log('response', customerInfo.value)
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Update customer status
const updateStatus = async (newStatus) => {
  try {
    const response = await useAPI().patch(`core/customers/${customerInfo.value.id}/`, {
      status: newStatus
    });

    if (response.status.value === 'success') {
      customerInfo.value.status = newStatus;
      // Update the display value
      const statusOption = statusOptions.find(opt => opt.value === newStatus);
      if (statusOption) {
        customerInfo.value.status_display = statusOption.label;
      }

      useToast().add({
        title: t('Success'),
        description: t('Status updated successfully'),
        color: 'green',
      });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    useToast().add({
      title: t('Error'),
      description: t('Failed to update status'),
      color: 'red',
    });
  }
};

const fetchData = async () => {
  try {
    await fetchCustomerInfo();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchAttachments();
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
      useRouter().push({ name: 'customers-id-update', params: { id: useRoute().params.id } })
    }
  },
  {
    label: t('Add document'),
    icon: 'i-heroicons-arrow-up-on-square',
    click: () => {
      fileInputRef.value?.click()
    }
  }]
])

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  await uploadFiles(files);

  // Reset input
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const uploadFiles = async (files) => {
  try {
    uploading.value = true;

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('customer', useRoute().params.id);
      formData.append('file', file);

      return useAPI().post('core/customer-attachments/', formData);
    });

    await Promise.all(uploadPromises);

    useToast().add({
      title: t('Success'),
      description: `${files.length} ${t('file(s) uploaded successfully')}`,
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000,
    });

    // Refresh attachments list
    await fetchAttachments();
  } catch (error) {
    console.error('Error uploading files:', error);
    useToast().add({
      title: t('Error'),
      description: error.message || t('Failed to upload files'),
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
  } finally {
    uploading.value = false;
  }
};

const deleteAttachment = async (attachmentId) => {
  try {
    deletingAttachment.value = attachmentId;

    await useAPI().del(`core/customer-attachments/${attachmentId}/`);

    useToast().add({
      title: t('Success'),
      description: t('Attachment deleted successfully'),
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 2000,
    });

    // Refresh attachments list
    await fetchAttachments();
  } catch (error) {
    console.error('Error deleting attachment:', error);
    useToast().add({
      title: t('Error'),
      description: error.message || t('Failed to delete attachment'),
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
  } finally {
    deletingAttachment.value = null;
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    useToast().add({
      description: 'Copied to clipboard!',
      color: 'green',
      timeout: 1000,
      position: 'top-0',
    })
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const getFileName = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  return decodeURIComponent(parts[parts.length - 1]);
};

const getFileType = (filename) => {
  if (!filename) return 'file';
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image';
  if (lower.match(/\.(doc|docx)$/)) return 'document';
  return 'file';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMM D, YYYY');
};
</script>