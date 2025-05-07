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
                    <span class="font-sans text-md text-slate-700 dark:text-slate-200">Template</span>
                    <UButton color="" variant="outline" class="w-fit dark:text-slate-200" icon="i-heroicons-arrow-down-tray" size="sm">
                        <a href="/downloads/hr/profile_hr_import_template_v1.xlsx" >
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
                    <UButton color="" @click="onSubmit" :disabled="!uploadFile || busy" class="bg-titaca-button-primary">
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
    const upload_type = 1
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
    console.log('uploadFile', uploadFile.value)
    if (!uploadFile) return
    const res = await importFile(uploadFile.value)
    // console.log('res',res)
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
            title: t('Success'),
            description: t('Import successfully'),
            icon: 'i-heroicons-check-circle',
            color: 'green',
        })
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
</script>