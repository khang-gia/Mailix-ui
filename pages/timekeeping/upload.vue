<template>
    <div class="p-2">
        <UCard :ui="{body: { base: 'divide-y divide-gray-200 dark:divide-gray-700'}, divide: 'divide-y divide-gray-200 dark:divide-gray-700',}">
            <template #header>
                <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-200">{{ $t('Import Time Record Daily') }}</h1>
                <span class="text-sm italic text-slate-500 dark:text-slate-400">{{ $t('Import timekeeping note') }}</span>
            </template>
            <div class="grid grid-flow-row ">
                <div class="pb-4">
                    <h2 class="text-titaca-text-primary font-bold text-lg font-averta">
                    Hệ thống sẽ bắt đầu import từ dòng thứ 3. Các cột import của file excel bao gồm:
                    </h2>
                    <ul class="mt-4 space-y-2">
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột A:</span> Số thứ tự của dòng import
                        </li>
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột B:</span> Mã nhân sự
                        </li>
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột C:</span> Họ & tên nhân sự
                        </li>
                        <!-- <li>
                            <span class="font-medium">Cột D:</span> Phòng ban
                        </li> -->
                        <li>
                            <span class="font-medium text-slate-900 dark:text-slate-200">Cột D trở đi:</span> Công làm việc tương ứng của từng ngày
                        </li>
                        
                    </ul>
                    <h2 class="text-red-600 font-averta font-bold text-md pt-4">
                        Lưu ý: Công của từng ngày làm việc có thể nhập số, ký hiệu x hoặc bỏ trống:
                    </h2>
                    <ul class="mt-4 pl-2 space-y-2">
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span> Nhập số, (1, 0.5, 0.75, ...) tương ứng tỉ lệ công trong ngày mà nhân viên đi làm dựa trên số giờ làm thực tế.
                        </li>
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span> Nhập x, hệ thống cập nhật nhân sự nghỉ không lý do.
                        </li>
                        <li>
                            <span class="text-sm dark:text-slate-200">+</span> Bỏ trống, bỏ qua, không cập nhật ngày công.
                        </li>
                    </ul>
                </div>
                <div class="flex justify-start items-center space-x-4">
                    <span class="font-averta text-md text-slate-700 dark:text-slate-200">Tải file mẫu
                        <a :href="`${useRuntimeConfig().app.baseURL}downloads/timekeeping/timekeeping_import_template_v1.xlsx`" target="_blank" class="text-titaca-text-primary dark">
                            {{ $t('Download Template') }}
                        </a>
                    </span>
                    
                </div>
                <div class="items-center py-4">
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
</script>