<template>
    <div>
        <UserImportTabs v-model="tab" />
    </div>
    <div class="p-2">
        <UCard :ui="{body: { base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
            <template #header>
                <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-200">{{ $t('Import Profile HR') }}</h1>
                <span class="text-sm italic text-slate-500 dark:text-slate-400">{{ $t('Import note') }}</span>
            </template>
            <div class="grid grid-flow-row ">
                <div class="flex justify-start items-center space-x-4">
                    <span class="font-averta text-md text-slate-700 dark:text-slate-200">Template</span>
                    <UButton color="" variant="outline" class="w-fit dark:text-slate-200" icon="i-heroicons-arrow-down-tray" size="sm">
                        <a :href="`${useRuntimeConfig().app.baseURL}downloads/hr/profile_hr_import_template_v1.xlsx`" target="_blank" >
                            profile_hr_import_template_v1.xlsx
                        </a>
                    </UButton>
                </div>
                <div class="items-center py-4 ">
                    <FileSelector 
                        :multiple="false" 
                        :readonly="busy"
                        fileTypes=".xlsx, .xls, .csv,"
                        @on-select="onSelectFiles"
                        ref="fileSelectors"
                    />
                </div>
                <UProgress v-if="isUploading" color="blue" :value="uploadedPercent" max="100" size="sm" indicator/>
            </div>
            <template #footer>
                <div class="flex justify-end items-center space-x-2">
                    <UButton color="" @click="onSubmit" :disabled="!uploadFile || busy" class="bg-red-600 hover:bg-red-700 text-white">
                        {{ $t('Remove') }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>

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
                        <UButton icon="i-heroicons-x-mark" size="sm" variant="ghost" color="gray" @click="errorModalOpen = false" />
                    </div>
                </div>
            </template>
            <div class="bg-slate-50 dark:bg-slate-900 rounded-md p-4 max-h-[60vh] overflow-y-auto select-text">
                <template v-if="parseErrors(selectedRow?.errors_log)">
                    <div class="space-y-3">
                        <div v-for="(err, idx) in parseErrors(selectedRow?.errors_log)" :key="idx" class="text-sm">
                            <span class="font-semibold text-slate-800 dark:text-slate-200">{{ $t('Row') }} {{ err.row }}:</span>
                            <span v-if="err.type === 'invalid_choice'" class="text-red-600 dark:text-red-400 ml-1">
                                {{ $t('error.invalid_choice', { value: err.value, field: $t('fields.' + err.field), allowed: err.allowed.join(', ') }) }}
                            </span>
                            <span v-else-if="err.type === 'validation'" class="text-red-600 dark:text-red-400 ml-1">
                                <ul class="list-disc pl-5 mt-1">
                                    <li v-for="(msgs, field) in err.details" :key="field">
                                        <span class="font-medium">{{ $t('fields.' + field) || field }}:</span> {{ msgs.join(', ') }}
                                    </li>
                                </ul>
                            </span>
                            <span v-else-if="err.type === 'not_found'" class="text-red-600 dark:text-red-400 ml-1">
                                {{ $t('error.not_found', { code: err.code }) }}
                            </span>
                            <span v-else class="text-red-600 dark:text-red-400 ml-1">
                                {{ err.message }}
                            </span>
                        </div>
                    </div>
                </template>
                <pre v-else class="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{{ selectedRow?.errors_log }}</pre>
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const parseErrors = (errStr) => {
    if (!errStr) return null;
    try {
        const parsed = JSON.parse(errStr);
        if (Array.isArray(parsed)) return parsed;
        return null;
    } catch (e) {
        return null;
    }
};


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
        const data = await useAPI().$get(`upload/uploads/?upload_type=101`)
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

const onSelectFiles = (files) => {
    if (!files.value || !files.value.length) return
    uploadFile.value = files.value[0]
    totalSize.value = uploadFile.value.size
}
const importFile = async (value) => {
    const data = new FormData()
    const upload_type = 101
    data.append('file', value)
    data.append('upload_type', upload_type)
    const { data: upload, error } = await useAPI().post(
        `upload/uploads/`, data
    );
    if (error.value) {
        throw error.value
    }
    return upload
}
const onSubmit = async() => {
    if (!uploadFile) return
    const res = await importFile(uploadFile.value)
    if (res){
        busy.value = true
        busy.value = false
        uploadFile.value = null
        fileSelectors.value.removeAllFiles()
        useToast().add({
            title: t('Success'),
            description: t('Import successfully'),
            icon: 'i-heroicons-check-circle',
            color: 'green',
        })
        await fetchHistory()
    }
    else {
        useToast().add({
            title: t('Error'),
            description: t('Import failed'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
        })
    }
}

onMounted(() => {
    fetchHistory()
})
</script>