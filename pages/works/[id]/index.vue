<template>
  <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
    <div class="flex items-center">
      <div class="flex items-center gap-3 pr-3">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          <span class="text-primary-500">{{ workInfo.name }}</span>
        </h1>
      </div>
    </div>
    <div class="flex justify-end gap-2 items-center">
      <!-- Status Dropdown -->
      <!-- <UDropdown :items="statusDropdownItems" :popper="{ placement: 'bottom-end' }">
        <UButton color="gray" variant="soft" size="sm" icon="i-heroicons-arrow-path">
          {{ $t('Change Status') }}
        </UButton>
        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
        </template>
</UDropdown> -->

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

      <div class="lg:col-span-4 space-y-4">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ $t('General Information') }}
              </h2>

            </div>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">

            <WorkDetailItem label="Work Name" :value="workInfo.name" />
            <WorkDetailItem label="Work Code" :value="workInfo.work_code" />


            <WorkDetailItem label="Progress" :value="progress">

              <template #value>
                <div class="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3"
                  @click="showProgressModal = true">
                  <UProgress :value="workInfo.progress" :indicator="false" class="w-32" size="md" />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem]">{{
                    workInfo.progress }}%</span>
                </div>
              </template>
            </WorkDetailItem>

            <WorkDetailItem label="Start date" :value="dayjs(workInfo.start_date).format('YYYY-MM-DD HH:mm')" />
            <WorkDetailItem label="End date" :value="dayjs(workInfo.end_date).format('YYYY-MM-DD HH:mm')" />
            <WorkDetailItem label="Actual start date" :value="dayjs(workInfo.actual_start_date).format('YYYY-MM-DD')" />
            <WorkDetailItem v-if="workInfo.status" label="Status" :value="workInfo.status_display"
              class="md:col-span-1">
              <template #value>
                <!-- Status Badge with Popover -->
                <UPopover :popper="{ placement: 'bottom' }">
                  <UBadge :color="statusMapping[workInfo.status]" variant="subtle" class="font-semibold cursor-pointer">
                    {{ $t(workInfo.status_display) }}
                    <template #trailing>
                      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1" />
                    </template>
                  </UBadge>

                  <template #panel>
                    <div class="p-4 w-80">
                      <h3 class="text-lg font-semibold mb-4">{{ $t('Update Status') }}</h3>

                      <!-- Status Radio Group -->
                      <URadioGroup v-model="selectedStatus" :options="statusDropdownOptions" class="mb-4">
                        <template #label="{ option }">
                          <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" :class="getStatusDotClass(option.value)"></div>
                            <span>{{ option.label }}</span>
                          </div>
                        </template>
                      </URadioGroup>

                      <!-- Action Buttons -->
                      <div class="flex justify-end gap-2">
                        <UButton color="gray" variant="ghost" @click="cancelStatusUpdate">
                          {{ $t('Cancel') }}
                        </UButton>
                        <UButton color="primary" @click="updateWorkStatus" :loading="isUpdatingStatus">
                          {{ $t('Update') }}
                        </UButton>
                      </div>
                    </div>
                  </template>
                </UPopover>
              </template>
            </WorkDetailItem>
            <WorkDetailItem v-if="workInfo.priority" label="Priority" :value="workInfo.priority" class="md:col-span-1">
              <template #value>
                <!-- Priority Badge with Popover -->
                <UPopover :popper="{ placement: 'bottom' }">
                  <UBadge :color="statusMapping[workInfo.priority]" variant="subtle"
                    class="font-semibold cursor-pointer">
                    {{ $t(workInfo.priority_display) }}
                    <template #trailing>
                      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1" />
                    </template>
                  </UBadge>

                  <template #panel>
                    <div class="p-4 w-80">
                      <h3 class="text-lg font-semibold mb-4">{{ $t('Update Priority') }}</h3>

                      <!-- Priority Radio Group -->
                      <URadioGroup v-model="selectedPriority" :options="priorityOptions" class="mb-4">
                        <template #label="{ option }">
                          <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" :class="getPriorityDotClass(option.value)"></div>
                            <span>{{ option.label }}</span>
                          </div>
                        </template>
                      </URadioGroup>

                      <!-- Action Buttons -->
                      <div class="flex justify-end gap-2">
                        <UButton color="gray" variant="ghost" @click="cancelPriorityUpdate">
                          {{ $t('Cancel') }}
                        </UButton>
                        <UButton color="primary" @click="updateWorkPriority" :loading="isUpdatingPriority">
                          {{ $t('Update') }}
                        </UButton>
                      </div>
                    </div>
                  </template>
                </UPopover>
              </template>
            </WorkDetailItem>
            <!-- <WorkDetailItem label="Priority" :value="workInfo.priority" /> -->

            <!-- <UDivider class="md:col-span-2 lg:col-span-3 my-4" /> -->

            <WorkDetailItem label="Assigned to" :value="workInfo.assigned_to_list" />
            <WorkDetailItem label="Assigned by" :value="workInfo.assigned_by_list" />
            <WorkDetailItem label="Work manage by" :value="workInfo.managers_list" />


          </div>

          <UDivider class="my-6" />

          <h2 class="text-xl font-semibold border-b pb-3 mb-4 text-gray-800 dark:text-gray-100">
            {{ $t('Description') }}
          </h2>
          <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            <span v-if="workInfo.description" v-html="workInfo.description"></span>
            <span v-else>{{ $t('No description for this work...') }}</span>
          </div>

        </UCard>

        <!-- Tabs Card (Discussion & Documents) -->
        <UCard :ui="{
          footer: {
            base: 'border-none', padding: 'px-4 py-4 sm:px-6'
          }
        }">
          <UTabs :items="tabs" class="w-full">
            <template #item="{ item }">
              <div class="mt-4">
                <div v-if="item.key === 'discussions'" class="h-full overflow-x-hidden">
                  <CommentsSection comment-type="works" />
                </div>
                <div v-else-if="item.key === 'documents'" class="space-y-3">
                  <div v-if="workDocuments.length === 0"
                    class="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {{ $t('No documents yet') }}
                  </div>

                  <div v-for="document in workDocuments" :key="document.id"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <svg v-if="getFileType(document.filename) === 'pdf'" class="h-8 w-8 text-red-500 flex-shrink-0"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd" />
                      </svg>
                      <svg v-else-if="getFileType(document.filename) === 'image'"
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
                        <a :href="document.file" target="_blank"
                          class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate block">
                          {{ document.filename || getFileName(document.file) }}
                        </a>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ document.uploaded_by?.display_name }} - {{ formatDate(document.created_at) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <UButton icon="i-heroicons-arrow-down-tray" size="xs" color="gray" variant="ghost"
                        :to="document.file" target="_blank" />
                      <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost"
                        @click="deleteDocument(document.id)" :loading="deletingDocument === document.id" />
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </UTabs>
        </UCard>
      </div>

      <div class="lg:col-span-2">
        <!-- Activity Log Card -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {{ $t('Activity Log') }}
            </h2>
          </template>
          <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div v-for="history in workHistory" :key="history.id"
              class="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
              <ActivityLogItem :history="history" history-type="work" />
            </div>
          </div>
        </UCard>
      </div>

    </div>
  </div>

  <!-- Hidden file input for direct file selection -->
  <input ref="fileInputRef" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"
    @change="handleFileSelect" />

  <!-- Progress Edit Modal -->
  <ModalUpdateProgress v-model="showProgressModal" :work-id="workInfo.id" :progress="workInfo.progress"
    @updated="handleProgressUpdated" />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

definePageMeta({
  title: 'Chi tiết công việc',
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

// Work status options (all 17 statuses)
const statusOptions = [
  { value: 1, label: t('Not Started') },
  { value: 2, label: 'Backlog' },
  { value: 3, label: 'To Do' },
  { value: 4, label: t('In Progress') },
  { value: 5, label: t('Completed') },
  { value: 6, label: t('On Hold') },
  { value: 7, label: t('Cancelled') },
  { value: 8, label: t('Deferred') },
  { value: 9, label: t('Waiting for Review') },
  { value: 10, label: t('Approved') },
  { value: 11, label: t('Rejected') },
  { value: 12, label: t('Pending') },
  { value: 13, label: t('Failed') },
  { value: 14, label: t('Success') },
  { value: 15, label: t('Archived') },
  { value: 16, label: t('Deleted') },
  { value: 17, label: t('Draft') },
];

// Status dropdown items for UDropdown
const statusDropdownItems = [[
  { label: t('Not Started'), click: () => updateStatus(1) },
  { label: 'Backlog', click: () => updateStatus(2) },
  { label: 'To Do', click: () => updateStatus(3) },
  { label: t('In Progress'), click: () => updateStatus(4) },
  { label: t('Completed'), click: () => updateStatus(5) },
  { label: t('On Hold'), click: () => updateStatus(6) },
  { label: t('Cancelled'), click: () => updateStatus(7) },
  { label: t('Deferred'), click: () => updateStatus(8) },
  { label: t('Waiting for Review'), click: () => updateStatus(9) },
  { label: t('Approved'), click: () => updateStatus(10) },
  { label: t('Rejected'), click: () => updateStatus(11) },
  { label: t('Pending'), click: () => updateStatus(12) },
  { label: t('Failed'), click: () => updateStatus(13) },
  { label: t('Success'), click: () => updateStatus(14) },
  { label: t('Archived'), click: () => updateStatus(15) },
  { label: t('Deleted'), click: () => updateStatus(16) },
  { label: t('Draft'), click: () => updateStatus(17) }
]];

const selectedStatus = ref(null);
const isUpdatingStatus = ref(false);

// Status options for radio group in popover
const statusDropdownOptions = computed(() => [
  { value: 1, label: t('Not Started') },
  { value: 2, label: 'Backlog' },
  { value: 3, label: 'To Do' },
  { value: 4, label: t('In Progress') },
  { value: 5, label: t('Completed') },
  { value: 6, label: t('On Hold') },
  { value: 7, label: t('Cancelled') },
  { value: 8, label: t('Deferred') },
  { value: 9, label: t('Waiting for Review') },
  { value: 10, label: t('Approved') },
  { value: 11, label: t('Rejected') },
  { value: 12, label: t('Pending') },
  { value: 13, label: t('Failed') },
  { value: 14, label: t('Success') },
  { value: 15, label: t('Archived') },
  { value: 16, label: t('Deleted') },
  { value: 17, label: t('Draft') },
]);

// Helper function to get status dot color class
const getStatusDotClass = (status) => {
  const colorMap = {
    1: 'bg-gray-500',    // Not Started
    2: 'bg-gray-500',    // Backlog
    3: 'bg-blue-500',    // To Do
    4: 'bg-green-500',   // In Progress
    5: 'bg-amber-500',   // Completed
    6: 'bg-slate-500',   // On Hold
    7: 'bg-indigo-500',  // Cancelled
    8: 'bg-cyan-500',    // Deferred
    9: 'bg-emerald-500', // Waiting for Review
    10: 'bg-red-500',    // Approved
    11: 'bg-yellow-500', // Rejected
    12: 'bg-rose-500',   // Pending
    13: 'bg-lime-500',   // Failed
    14: 'bg-gray-500',   // Success
    15: 'bg-red-500',    // Archived
    16: 'bg-purple-500', // Deleted
    17: 'bg-gray-500',   // Draft
  };
  return colorMap[status] || 'bg-gray-500';
};

// Update work status via popover
const updateWorkStatus = async () => {
  try {
    isUpdatingStatus.value = true;
    const response = await useAPI().patch(`core/works/${workInfo.value.id}/`, {
      status: selectedStatus.value
    });

    if (response.status.value === 'success') {
      workInfo.value.status = selectedStatus.value;
      // Update the display value
      const statusOption = statusOptions.find(opt => opt.value === selectedStatus.value);
      if (statusOption) {
        workInfo.value.status_display = statusOption.label;
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
  } finally {
    isUpdatingStatus.value = false;
  }
};

// Cancel status update and reset to current value
const cancelStatusUpdate = () => {
  selectedStatus.value = workInfo.value.status;
};

// Priority Management
const selectedPriority = ref(null);
const isUpdatingPriority = ref(false);

// Priority options (6 levels)
const priorityOptions = computed(() => [
  { value: 1, label: t('Low') },
  { value: 2, label: t('Medium') },
  { value: 3, label: t('High') },
  { value: 4, label: t('Urgent') },
  { value: 5, label: t('Critical') },
  { value: 6, label: t('None') },
]);

// Helper function to get priority dot color class
const getPriorityDotClass = (priority) => {
  const colorMap = {
    1: 'bg-gray-500',    // Low
    2: 'bg-blue-500',    // Medium
    3: 'bg-green-500',   // High
    4: 'bg-amber-500',   // Urgent
    5: 'bg-red-500',     // Critical
    6: 'bg-slate-500',   // None
  };
  return colorMap[priority] || 'bg-gray-500';
};

// Update work priority via popover
const updateWorkPriority = async () => {
  try {
    isUpdatingPriority.value = true;
    const response = await useAPI().patch(`core/works/${workInfo.value.id}/`, {
      priority: selectedPriority.value
    });

    if (response.status.value === 'success') {
      workInfo.value.priority = selectedPriority.value;
      // Update the display value
      const priorityOption = priorityOptions.value.find(opt => opt.value === selectedPriority.value);
      if (priorityOption) {
        workInfo.value.priority_display = priorityOption.label;
      }

      useToast().add({
        title: t('Success'),
        description: t('Priority updated successfully'),
        color: 'green',
      });
    }
  } catch (error) {
    console.error('Error updating priority:', error);
    useToast().add({
      title: t('Error'),
      description: t('Failed to update priority'),
      color: 'red',
    });
  } finally {
    isUpdatingPriority.value = false;
  }
};

// Cancel priority update and reset to current value
const cancelPriorityUpdate = () => {
  selectedPriority.value = workInfo.value.priority;
};

const tabs = [{
  label: t('Discussion'),
  key: 'discussions',
}, {
  label: t('Documents'),
  key: 'documents',
}]
const workInfo = ref({})
const workHistory = ref([])
const workDocuments = ref([])
const deletingDocument = ref(null)
const fileInputRef = ref(null)
const uploading = ref(false)
const showProgressModal = ref(false)

// Handle progress update from modal
const handleProgressUpdated = (newProgress) => {
  workInfo.value.progress = newProgress;
};

const fetchHistory = async () => {
  try {
    const { data: response } = await useAPI().get(`core/works/${useRoute().params.id}/history/`);
    workHistory.value = response.value
  } catch (error) {
    console.error('Error loading history data:', error);
  }
}
const fetchWorkInfo = async () => {
  try {
    const { data: response } = await useAPI().get(`core/works/${useRoute().params.id}/`);
    workInfo.value = response.value
    workInfo.value.start_date = workInfo.value.start_date ? new Date(workInfo.value.start_date) : null
    workInfo.value.end_date = workInfo.value.end_date ? new Date(workInfo.value.end_date) : null
    workInfo.value.actual_start_date = workInfo.value.actual_start_date ? new Date(workInfo.value.actual_start_date) : null
    workInfo.value.related_work = workInfo.value.related_work ? workInfo.value.related_work.id : '',
      selectedStatus.value = workInfo.value.status; // Initialize selected status
    selectedPriority.value = workInfo.value.priority; // Initialize selected priority
    console.log('response', workInfo.value)
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Update work status
const updateStatus = async (newStatus) => {
  try {
    const response = await useAPI().patch(`core/works/${workInfo.value.id}/`, {
      status: newStatus
    });

    if (response.status.value === 'success') {
      workInfo.value.status = newStatus;
      // Update the display value
      const statusOption = statusOptions.find(opt => opt.value === newStatus);
      if (statusOption) {
        workInfo.value.status_display = statusOption.label;
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
    await fetchWorkInfo();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchHistory();
    await fetchWorkDocuments();
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
      useRouter().push({ name: 'works-id-update', params: { id: useRoute().params.id } })
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

// Helper functions for documents
const getFileType = (filename) => {
  if (!filename) return 'file';
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  return 'file';
};

const getFileName = (url) => {
  if (!url) return 'Unknown file';
  return url.split('/').pop();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

// Delete document
const deleteDocument = async (documentId) => {
  try {
    deletingDocument.value = documentId;
    const response = await useAPI().del(`core/work-attachments/${documentId}/`);

    if (response.status.value === 'success') {
      // Remove from local array
      workDocuments.value = workDocuments.value.filter(doc => doc.id !== documentId);

      useToast().add({
        title: t('Success'),
        description: t('Document deleted successfully'),
        color: 'green',
      });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    useToast().add({
      title: t('Error'),
      description: t('Failed to delete document'),
      color: 'red',
    });
  } finally {
    deletingDocument.value = null;
  }
};

// Fetch work documents
const fetchWorkDocuments = async () => {
  try {
    const { data: response } = await useAPI().get(`core/work-attachments/`, {
       work: useRoute().params.id 
    });
    workDocuments.value = response.value.results || [];
  } catch (error) {
    console.error('Error loading documents:', error);
    workDocuments.value = [];
  }
};

// Handle file selection
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  await uploadFiles(files);

  // Reset input
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Upload files to API
const uploadFiles = async (files) => {
  try {
    uploading.value = true;

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('work', useRoute().params.id);
      formData.append('file', file);

      return useAPI().post('core/work-attachments/', formData);
    });

    await Promise.all(uploadPromises);

    useToast().add({
      title: t('Success'),
      description: `${files.length} ${t('file(s) uploaded successfully')}`,
      color: 'green',
    });

    // Refresh documents list
    await fetchWorkDocuments();
  } catch (error) {
    console.error('Error uploading files:', error);
    useToast().add({
      title: t('Error'),
      description: t('Failed to upload files'),
      color: 'red',
    });
  } finally {
    uploading.value = false;
  }
};

</script>