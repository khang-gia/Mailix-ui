<template>
    <div class="p-2">
        <UCard :ui="{body: { base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
            <template #header>
                <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-200">{{ $t('Import Time Record Daily') }}</h1>
                <span class="text-sm italic text-slate-500 dark:text-slate-400">{{ $t('Import timekeeping note') }}</span>
            
    <!-- Import History -->
    <div class="p-2 mt-2">
        <UCard :ui="{body: { base: ''}, divide: 'divide-y divide-gray-200 dark:divide-gray-700'}">
            <template #header>
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-200">{{ $t('Import History') }}</h2>
                    <UButton icon="i-heroicons-arrow-path" size="sm" variant="ghost" color="gray" :loading="historyLoading" @click="fetchHistory" />
                </div>
            </template>
            <UTable
                :rows="historyRows"
                :columns="historyColumns"
                :loading="historyLoading"
                class="w-full"
            >
                <template #created_at-data="{ row }">
                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(row.created_at) }}</span>
                </template>

                <template #status_name-data="{ row }">
                    <UBadge
                        :color="statusColor(row.status)"
                        variant="subtle"
                        size="sm"
                    >
                        {{ row.status_name }}
                    </UBadge>
                </template>

                <template #success-data="{ row }">
                    <span class="text-green-600 dark:text-green-400 font-medium">{{ row.success }}</span>
                </template>

                <template #failure-data="{ row }">
                    <span :class="row.failure > 0 ? 'text-red-500 dark:text-red-400 font-medium' : 'text-slate-400'">{{ row.failure }}</span>
                </template>

                <template #errors_log-data="{ row }">
                    <UButton
                        v-if="row.errors_log"
                        icon="i-heroicons-exclamation-triangle"
                        size="xs"
                        color="red"
                        variant="ghost"
                        :title="$t('Error Log')"
                        @click="openErrorLog(row)"
                    />
                </template>

                <template #actions-data="{ row }">
                    <div class="flex items-center">
                        <UButton
                            v-if="row.status === 3"
                            icon="i-heroicons-x-circle"
                            size="xs"
                            color="orange"
                            variant="ghost"
                            :title="$t('Cancel Import')"
                            @click="cancelImport(row)"
                        />
                    </div>
                </template>
            </UTable>

            <div v-if="historyRows.length === 0 && !historyLoading" class="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                {{ $t('No import history') }}
            </div>
        </UCard>
    </div>

    <!-- Error Log Modal -->
    <UModal v-model="errorModalOpen" :ui="{ width: 'max-w-2xl' }">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
                        {{ $t('Error Detail') }}
                    </h3>
                    <div class="flex items-center gap-2">
                        <!-- <UButton icon="i-heroicons-clipboard-document" size="sm" variant="ghost" color="gray" :title="$t('Copy Error Log')" @click="copyErrorLog" /> -->
                        <UButton icon="i-heroicons-x-mark" size="sm" variant="ghost" color="gray" @click="errorModalOpen = false" />
                    </div>
                </div>
            </template>
            <div class="bg-slate-50 dark:bg-slate-900 rounded-md p-4 max-h-[60vh] overflow-y-auto select-text">
                <pre class="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{{ selectedRow?.errors_log }}</pre>
            </div>
        </UCard>
    </UModal>
</template>

            <div class="grid grid-flow-row ">
                <div class="pb-4">
                    <h2 class="text-titaca-text-primary font-bold text-lg font-averta">{{ $t('The system will start importing from the 3rd line. The import columns in the excel file include:') }}</h2>
                    <ul class="mt-4 space-y-2">
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột A:</span>{{ $t('Import line number') }}</li>
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột B:</span>{{ $t('Employee Code') }}</li>
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột C:</span>{{ $t('Employee Full Name') }}</li>
                        <!-- <li>
                            <span class="font-medium">Cột D:</span>{{ $t('Department') }}</li> -->
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột D trở đi:</span>{{ $t('Daily working days') }}</li>
                        
                    </ul>
                    <h2 class="text-red-600 font-averta font-bold text-md pt-4">{{ $t("Note: Units for each working day can be a number, 'x', or left blank:") }}</h2>
                    <ul class="mt-4 pl-2 space-y-2">
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span>{{ $t('Enter a number (1, 0.5, 0.75, ...) corresponding to the ratio of work in the day the employee worked based on actual working hours.') }}</li>
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span>{{ $t("Enter 'x' for the system to update as unexcused absence.") }}</li>
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span>{{ $t('Leave blank to skip and not update working days.') }}</li>
                    </ul>
                </div>
                <div class="flex justify-start items-center space-x-4">
                    <span class="font-averta text-md text-slate-700 dark:text-slate-200">{{ $t('Download template') }}<a :href="`${useRuntimeConfig().app.baseURL}downloads/timekeeping/timekeeping_import_template_v1.xlsx`" target="_blank" class="text-titaca-text-primary dark">
                            {{ $t('Download Template') }}
                        </a>
                    </span>
                    
                </div>
                <div class="items-center py-4">
                    <FileSelector 
                        :multiple="false" 
                        :readonly="busy"
                        fileTypes=".xlsx, .xls, .csv"
                        @on-select="onSelectFiles"
                        ref="fileSelectors"
                    />
                </div>
                <UProgress v-if="isUploading" color="blue" :value="uploadedPercent" max="100" size="sm" indicator/>
            </div>
            <template #footer>
                <div class="flex justify-end items-center space-x-2">
                    <UButton color="gray" @click="onCancel" :label="$t('Cancel')">
                    
                    </UButton>
                        
                    <UButton color="" @click="onSubmit" :disabled="!uploadFile || busy" class="bg-mailix-primary hover:bg-primary-800">
                        {{ $t('Import') }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
    
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useRouter } from "vue-router";
const router = useRouter();
definePageMeta({
  title: 'Tải lên'
})
const tab = ref(0)
const uploadFile= ref(null)
const totalSize = ref(0)
const busy = ref(false)
const fileSelectors = ref(null)
const uploadedPercent = ref(0)
const isUploading = ref(false)
const onSelectFiles = (files) => {
    if (!files.value || !files.value.length) return
    uploadFile.value = files.value[0]
    totalSize.value = uploadFile.value.size
}
const importFile = async (value) => {
    const data = new FormData()
    const upload_type = 5
    data.append('file', value)
    data.append('upload_type', upload_type)
    const { data: invoice, error } = await useAPI().post(
        `upload/uploads/`, data
    );
    if (error) {
        throw error
    }
    return invoice
}
const onSubmit = async() => {
    console.log('uploadFile', uploadFile.value)
    if (!uploadFile) return
    const res = await importFile(uploadFile.value)
    if (res){
        busy.value = true
        // isUploading.value = true
        
        // const config = {
        //     onUploadProgress: (progressEvent) => {
        //         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //         uploadedPercent.value = percentCompleted
        //     }
        // }
        // isUploading.value = false
        busy.value = false
        // uploadedPercent.value = 0
        uploadFile.value = null
        fileSelectors.value.removeAllFiles()
        useToast().add({
            title: 'Success',
            description: 'Import successfully, please wait for the system to process',
            icon: 'i-heroicons-check-circle',
            color: 'green',
        })
        await fetchHistory()
    }
    else {
        useToast().add({
            title: 'Error',
            description: 'Error while uploading file',
            icon: 'i-heroicons-x-circle',
            color: 'red',
        })
    }
}
const onCancel = () => {
  router.back(); // Go back to the previous page
};
// History state
const historyRows = ref([])
const historyLoading = ref(false)
const errorModalOpen = ref(false)
const selectedRow = ref(null)

const historyColumns = [
    { key: 'file_name', label: t('File name') },
    { key: 'created_at', label: t('Imported at') },
    { key: 'created_by_name', label: t('Import by') },
    { key: 'status_name', label: t('Status') },
    { key: 'total', label: t('Total') },
    { key: 'success', label: t('Success') },
    { key: 'failure', label: t('Failure') },
    { key: 'errors_log', label: t('Error Detail') },
    { key: 'actions', label: t('Action') },
]

const statusColor = (status) => {
    const map = { 0: 'gray', 1: 'yellow', 2: 'green', 3: 'blue', 9: 'red' }
    return map[status] ?? 'gray'
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

const fetchHistory = async () => {
    historyLoading.value = true
    try {
        const data = await useAPI().$get(`upload/uploads/?upload_type=5`)
        if (data) {
            historyRows.value = data?.results ?? data ?? []
        }
    } catch (e) {
        console.error(e)
    } finally {
        historyLoading.value = false
    }
}

const openErrorLog = (row) => {
    selectedRow.value = row
    errorModalOpen.value = true
}

const copyErrorLog = async () => {
    if (!selectedRow.value?.errors_log) return
    try {
        await navigator.clipboard.writeText(selectedRow.value.errors_log)
        useToast().add({ title: t('Success'), description: t('Copied to clipboard'), color: 'green' })
    } catch (e) {
        useToast().add({ title: t('Error'), description: t('Failed to copy'), color: 'red' })
    }
}

const cancelImport = async (row) => {
    try {
        await useAPI().$post(`upload/uploads/${row.id}/revoke_import_in_progress/`)
        useToast().add({ title: t('Success'), description: t('Import cancelled'), color: 'green' })
        fetchHistory()
    } catch (e) {
        console.error(e)
        useToast().add({ title: t('Error'), description: t('Failed to cancel import'), color: 'red' })
    }
}

onMounted(() => {
    fetchHistory()
})
</script>