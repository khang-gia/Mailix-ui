<template>
    <BaseModal id="recommendation-close-modal" :modalOpen="isOpen"  :closeOnClick="false" @close-modal="closeModal"
        title="Đóng vị thế"
        >
        <form @submit.prevent="onSubmit">

            <div class="px-5 pt-4 pb-4">
                <div class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <BaseLabel text="Giá đóng" :required="true" forId="close_price"/>
                            <UInput type="number" placeholder="Giá đóng" step="0.01" v-model="closePrice" trailing>
                                <template #trailing>
                                    <span class="text-gray-500 dark:text-gray-400 text-xs">nghìn đồng</span>
                                </template>
                            </UInput>
                            <!-- <input type="number" placeholder="Giá đóng" step="0.01" v-model="closePrice" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> -->
                        </div>
                        <div>
                            <BaseLabel text="Lý do đóng" :required="true" forId="close_price"/>
                            
                            <USelect
                                v-model="closeReason"
                                :options="closeReasons"
                                placeholder="Chọn một lý do"
                                option-attribute="name"
                                value-attribute="value"
                                required
                            >
                            </USelect>
                        </div>
                        <div>
                            <BaseLabel text="Ngày đóng" :required="true" forId="close_date"/>
                            <BaseDatePicker :dateValue="closeDate" @onUpdate="closeDate = $event" :required="true"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-5 py-4 border-t-2 border-slate-200 dark:border-slate-700">
                <div class="flex flex-wrap justify-end space-x-2">
                    <button class="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                        @click.stop.prevent="closeModal">
                        Hủy
                    </button>
                    <BaseButton type="submit" class="btn-sm bg-green-500 hover:bg-green-600 text-white" :disabled="closeReason === null || !closePrice">
                        Lưu
                    </BaseButton>
                </div>
            </div>
        </form>
    </BaseModal>
</template>
<script setup>
const dayjs = useDayjs()
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    recommendationId:{
        type: Number,
        default: 0
    }
});
let busy = ref(false)
const now = new Date();
const label = computed(() => closeDate.value.toLocaleDateString('vi-vi', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
)
const snackbar = useMySnackBar()
const closeReasons = [
    { value: 0, name: "OPENING" },
    { value: 1, name: "Đạt mục tiêu"},
    { value: 2, name: "Stop Loss"},
    { value: 3, name: "Vĩ mô không thuận lợi"},
    { value: 4, name: "Cơ cấu lại danh mục"},
    { value: 5, name: "Khác"}
]
const closeReason = ref(1)
const closeDate = ref(new Date())
const closePrice = ref(0)
const emit = defineEmits(["onCloseModal"]);
const onSubmit = () => {
    onCloseRecommend()
}
const closeRecommendation = async(id, body) => {
        const url = `/consult/recommendations/${id}/close/`
        const { data, error } = await useAPI().post(url, body)
        if (error.value) {
            throw error.value
        }

        return data.value
    }
const onCloseRecommend = async () => {
    const id  = props.recommendationId
    const data = {
        closed_reason: closeReason.value,
        close_date: closeDate.value ? dayjs(closeDate.value, 'DD/MM/YYYY').format('YYYY-MM-DD'):dayjs(now).format('YYYY-MM-DD'),
        close_price: closePrice.value
    }
    try {
        const res = await closeRecommendation(id, data)
        snackbar.success('Đóng vị thế thành công!')
        closeModal(true,'closeRecommend')
    }
    catch (err) {
        console.log('## error', err)
        if (err.statusCode === 403) {
            snackbar.error('Bạn không có quyền đóng vị thế này!', 'Đóng vị thế thất bại!')
        }
        else if (err.statusCode === 500){
            snackbar.error('Lỗi hệ thống!', 'Đóng vị thế thất bại!')
        }
        else{
            if (err.data.length > 100) {
                err.data = err.data.substring(0, 100) + '...'
            }
            const msg = Object.values(err.data).join(' | ')
            snackbar.error(msg, 'Đóng vị thế thất bại!')
        }
        
    }
}
const closeModal = (isSuccess, type) => {
    busy.value = false
    closeReason.value = null
    closeDate.value = new Date()
    closePrice.value = 0

    emit('onCloseModal', isSuccess, type)
}
</script>