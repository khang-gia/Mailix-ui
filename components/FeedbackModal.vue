<template>
    <BaseModal title="Góp ý"
        v-if="feedbackModal"
        :modalOpen="feedbackModal" :closeOnClick="false" :closeOnEsc="false" @close-modal="closeModal">
        <div class="p-5">
            <div class="mb-5">
                <div class="block py-2 text-md font-medium">
                    Team rất trân trọng những đánh giá và góp ý của các bạn để sản phẩm ngày càng hoàn thiện và hữu ích hơn cho các nhà đầu tư.
                    Đừng ngần ngại gửi ý kiến của bạn cho Team nhé!
                </div>
                <textarea
                    v-model="feedback"
                    name="feedbackInput"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    rows="3"
                ></textarea>
            </div>
            <div class="mb-5">
                <div class="block py-2 text-md font-medium text-slate-500 dark:text-white">Thêm hình ảnh</div>
                <FileSelector 
                    :multiple="false" 
                    :readonly="busy"
                    fileTypes=".jpg,.jpeg,.png,"
                    @on-select="onSelectFiles"
                    ref="fileSelectors"
                />
            </div>
            <div class="flex justify-end">
                <UButton
                    color="primary"
                    @click="onSubmit"
                    :disabled="feedback.length === 0"
                >
                    <Icon name="tabler:send"></Icon>
                    Gửi
                </UButton>
            </div>

        </div>
    </BaseModal>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import { useModalStore } from '@/stores/modal'
    const modalStore = useModalStore()
    const { feedbackModal } = storeToRefs(modalStore)
    const { setFeedbackModal } = modalStore
    
    const props = defineProps(['id', 'modalOpen'])
    const emit = defineEmits(['close-modal'])
    const busy = ref(false)
    const closeModal = () => {
        feedback.value = ''
        uploadFile.value = null
        fileSelectors.value.removeAllFiles()
        setFeedbackModal(false)
        emit('close-modal')
    }
    const feedback = ref('')
    const snackbar = useMySnackBar()
    const uploadFile= ref(null)
    const totalSize = ref(0)
    const fileSelectors = ref(null)

    const onSelectFiles = (files) => {
        if (!files.value || !files.value.length) return
        uploadFile.value = files.value[0]
        totalSize.value = uploadFile.value.size
    }
    const sendFeedback = async (value) => {
        const { data: res, error } = await useAPI().post(
            "/core/feedbacks/",
            value
        );
        if (error.value) {
            throw error.value
        }
        return res
    }
    async function onSubmit() {
        const data = new FormData()
        data.append('feedback', feedback.value)
        if(uploadFile.value) {
            data.append('image', uploadFile.value, uploadFile.value.name)
        }
        try{
            const res = await sendFeedback(data)
            snackbar.success('Cám ơn bạn đã góp ý cho SIEUCOPHIEU.VN','Gửi góp ý thành công')
            closeModal()
        }
        catch(err){
            console.log(err)
            snackbar.error('Đã có lỗi xảy ra, hãy thử lại hoặc gửi cho team qua Telegram nhé!', 'Không thành công')
        }
    }
</script>
