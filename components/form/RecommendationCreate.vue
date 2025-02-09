<template>
    <BaseModal id="recommendation-create-modal" :modalOpen="isOpen" :closeOnClick="false" @close-modal="closeModal" 
        :title="recommendationId ? 'Cập nhật vị thế mở' : 'Thêm vị thế mở'"
        size="md">
        <form @submit.prevent="onSubmit">

            <div class="px-5 pt-4 pb-4">
                <div class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <BaseLabel text="Mã chứng khoán" :required="true" forId="symbol"/>
                            <input name="name" id="symbol" type="text" v-model="recommendationOpen.symbol"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Ví dụ: SCP" required @focusout="onSymbolFocusOut" autofocus/>
                        </div>
                        <div>
                            <BaseLabel text="Ngày mua" :required="true"/>
                            <BaseDatePicker :dateValue="recommendationOpen.buy_date" ref="datepicker" @onUpdate="recommendationOpen.buy_date = $event" :required="true"/>
                        </div>
                        <div>
                            <BaseLabel text="Giá mua" :required="true" forId="buy_price"/>
                            <input type="number" name="buy_price" id="buy_price" placeholder="Giá mua" v-model="recommendationOpen.buy_price"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required min="0" step="0.01"
                                />
                        </div>
                        <div>
                            <BaseLabel text="Giá mục tiêu" :required="true" forId="target_price"/>
                            <input type="number" name="target_price" id="target_price" placeholder="Giá mục tiêu" v-model="recommendationOpen.target_price"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required min="0" step="0.01"/>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <div>
                            <BaseLabel text="Stoploss" :required="true" forId="stop_loss"/>
                            <input type="number" name="stop_loss" id="stop_loss" placeholder="Giá cắt lỗ" v-model="recommendationOpen.stop_loss"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required min="0" step="0.01"
                                />
                        </div>
                        <div>
                            <BaseLabel text="Chiến lược" :required="true" forId="strategy"/>
                            <select name="strategy" id="strategy" placeholder="Chiến lược" v-model="recommendationOpen.strategy"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required>
                                <option value="T">Trading</option>
                                <option value="L">Dài hạn</option>
                                <option value="V">Giá trị</option>
                            </select>
                        </div>
                        <div>
                            <BaseLabel text="Tỉ trọng" :required="true" forId="ratio"/>
                            <div class="flex">
                                <input type="number" name="ratio" id="ratio" placeholder="Tỉ trọng" v-model="recommendationOpen.ratio"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required min="0" max="100"
                                    />
                                <span class="mt-2 ml-2">%</span>
                            </div>
                        </div>
                        <div class="col-span-3">
                            <BaseLabel text="Quan điểm đầu tư" forId="note"/>
                            <textarea name="note" id="note" placeholder="" v-model="recommendationOpen.note"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                rows="4"
                                ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-5 py-4 border-t-2 border-slate-200 dark:border-slate-700">
                <div class="flex flex-wrap justify-end space-x-2">
                    <button class="btn-sm border-slate-200 hover:border-slate-300 text-slate-600" type="button"
                        @click.stop.prevent="closeModal">
                        Hủy
                    </button>
                    <BaseButton type="submit" class="btn-sm bg-green-500 hover:bg-green-600 text-white">
                        Lưu
                    </BaseButton>
                </div>
            </div>
        </form>
    </BaseModal>
</template>
<script setup>
import _ from "lodash"
const dayjs = useDayjs()
const { $numeralFormat } = useNuxtApp()
const snackbar = useMySnackBar()

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

const recommendationOpen = ref({
    symbol: '',
    buy_date: new Date(),
    buy_price: 0,
    stop_loss: 0,
    target_price: 0,
    ratio: 20,
    note: '',
    strategy: 'T'
})

watch(
    [() => props.recommendationId, () => props.isOpen],
    async ([recommendationId, isOpen]) => {
        if (recommendationId && isOpen) {
            const {data: _recommendationOpen, error} = await useAPI().get(`/consult/recommendations/${recommendationId}/`)
            if (_recommendationOpen.value) {
                recommendationOpen.value = {
                    ..._recommendationOpen.value,
                    buy_date: _recommendationOpen.value.buy_date ? dayjs(_recommendationOpen.value.buy_date).toDate() : '',
                }
            }
        }
    }
);
const emit = defineEmits(["onCloseModal"]);
const formatData = () => {
    console.log('date', recommendationOpen.value.buy_date)
    
    return {
        ..._.pick(recommendationOpen.value, ['symbol', 'buy_price', 'stop_loss', 'target_price', 'strategy', 'ratio', 'note']),
        buy_date: recommendationOpen.value.buy_date ? dayjs(recommendationOpen.value.buy_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    }
}
const onSubmit = () => {
    if (props.recommendationId) {
        onUpdate()
    }
    else {
        onCreate()
    }
}
const createRecommend = async(body) => {
    const { data, error } = await useAPI().post('/consult/recommendations/', body)
    if (error.value) {
        throw error.value
    }
    return data.value
}

const onCreate = async() => {
    busy.value = true
    const data = formatData()
    try
        {
            const res = await createRecommend(data)
            snackbar.success('Thêm vị thế thành công!')
            closeModal(true)
    }
    catch (err) {
        if (err.statusCode === 403) {
            snackbar.error('Bạn không có quyền thêm vị thế này!', 'Thêm vị thế thất bại!')
        }
        else if (err.statusCode === 500){
            snackbar.error('Lỗi hệ thống!', 'Thêm vị thế thất bại!')
        }
        else{
            if (err.data.length > 100) {
                err.data = err.data.substring(0, 100) + '...'
            }
            snackbar.error(err.data, 'Thêm vị thế thất bại!')
        }
    }
}

const updateRecommend = async(body) => {
    const { data, error } = await useAPI().patch(`/consult/recommendations/${props.recommendationId}/`, body)
    if (error.value) {
        throw error.value
    }
    return data.value
}

const onUpdate = async() => {
    busy.value = true
    const data = formatData()
    try
        {
            const res = await updateRecommend(data)
            snackbar.success('Cập nhật vị thế thành công!')
            closeModal(true)
    }
    catch (err) {
        if (err.statusCode === 403) {
            snackbar.error('Bạn không có quyền cập nhật vị thế này!', 'Cập nhật vị thế thất bại!')
        }
        else if (err.statusCode === 500){
            snackbar.error('Lỗi hệ thống!', 'Cập nhật vị thế thất bại!')
        }
        else{
            if (err.data.length > 100) {
                err.data = err.data.substring(0, 100) + '...'
            }
            snackbar.error(err.data, 'Cập nhật vị thế thất bại!')
        }
    }
}
const closeModal = (isSuccess) => {
    busy.value = false
    recommendationOpen.value = {
        symbol: '',
        buy_date: new Date(),
        buy_price: 0,
        stop_loss: 0,
        target_price: 0,
        strategy: 'T',
        ratio: 20,
        note: ''
    }
    emit('onCloseModal', isSuccess)
}
const onSymbolFocusOut = async () => {
    if (recommendationOpen.value.symbol.length===3) {
        const {data: _latestPrices } = await useAPI({lazy:true}).get('/stock/latest/', {symbols: recommendationOpen.value.symbol})
        if (_latestPrices.value) {
            for (const s of Object.keys(_latestPrices.value)) {
                const _p = _latestPrices.value[s].last_price
                recommendationOpen.value.buy_price = _p
                recommendationOpen.value.stop_loss = $numeralFormat(_p).multiply(0.92).format('0.[00]')
                recommendationOpen.value.target_price = $numeralFormat(_p).multiply(1.2).format('0.[00]')
            }
        }
    }
}

</script>