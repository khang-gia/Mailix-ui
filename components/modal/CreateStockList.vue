<template>
  <BaseModal
    :title="modalType === 'addStock' ? 'Thêm cổ phiếu' : modalType === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'"
    :modalOpen="stockListModal && modalType"
    :closeOnClick="false"
    size="md"
    @close-modal="closeModal"
  >
    <div class="p-5" v-if="modalType!==''">
      <UForm
        ref="form"
        :state="userStockList"
        :schema="schema"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup v-if="modalType != 'addStock'" label="Tên" name="name" eager-validation required>
          <input v-model="userStockList.name" 
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required autofocus
          />
        </UFormGroup>
        
        <!-- <UFormGroup label="Tên viết tắt" name="short_name">
          <input v-model="userStockList.short_name"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </UFormGroup> -->
        <UFormGroup v-if="modalType != 'edit'" label="Mã cổ phiếu" name="stock">
            <USelectMenu
                v-model="userStockList.stock"
                :loading="loading"
                :searchable="searchStock"
                placeholder="Tìm theo mã chứng khoán..."
                option-attribute="name"
                value-attribute="id"
                trailing
                multiple
            >
              <template #option-empty="{ query }">
                  <q>{{ query }}</q> not found
              </template>
            </USelectMenu>
        </UFormGroup>
        <div v-if="modalType === 'addStock'" class="pt block">Chọn một hoặc nhiều mã cổ phiếu để thêm vào danh mục.</div>
        
        <div v-if="modalType =='create'" class="pt block">Để thuận tiện theo dõi danh mục, hệ thống chỉ hỗ trợ tạo tối đa 2 danh mục quan tâm.</div>
        <div class="h-40"></div>
        <div class="flex justify-end gap-2">
          <UButton color="gray" type="button" @click="closeModal"> Hủy bỏ </UButton>
          <UButton v-if="modalType === 'create'" type="submit" > Thêm danh mục </UButton>
          <UButton v-else-if="modalType === 'edit'" type="submit" > Cập nhật danh mục </UButton>
          <UButton v-else-if="modalType === 'addStock'" type="submit" > Xác nhận </UButton>
        </div>
      </UForm>
    </div>
  </BaseModal>
</template>

<script setup>
import * as yup from 'yup'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const modalStore = useModalStore()
const { stockListModal, modalType, stockListInfo } = storeToRefs(modalStore)
const { setStockListModal } = modalStore

const emit = defineEmits(["close-modal"]);
// const props = defineProps(["modalOpen"]);
const loading = ref(false);
const snackbar = useMySnackBar()
const form = ref(null);
const userStockList = reactive({
  _name: undefined,
  get name() {
    return this._name !== undefined ? this._name : (stockListInfo.value ? stockListInfo.value.name : undefined)
  },
  set name(value) {
    this._name = value
  },
  short_name: undefined,
  stock: [],
});
const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên danh mục').min(3, 'Tên danh mục cần ít nhất 3 ký tự')
})
async function onSubmit() {
  const data = {
    name: userStockList.name,
    short_name: userStockList.short_name,
    stocks: userStockList.stock
  }
  try {
    if (modalType.value == 'create') {
      const res = await createStockList(data);
      snackbar.success(`Danh mục ${userStockList.name} đã được thêm thành công!`, 'Thêm danh mục')
      closeModal(true)
    } else if (modalType.value == 'edit' && stockListInfo.value) {
      const res = await updateStockList(data);
      snackbar.success(`Danh mục ${userStockList.name} đã được cập nhật!`, 'Cập nhật danh mục')
      closeModal(true)
    } else if (modalType.value == 'addStock') {
      const res = await addStock(data);
      snackbar.success(`Đã thêm cổ phiếu vào danh mục ${userStockList.name}!`, 'Thêm cổ phiếu')
      closeModal(true)
    }

  } catch (err) {
    console.log('err', err)
    if (err.statusCode === 403) {
        snackbar.error('Bạn không có quyền thêm danh mục này!', 'Thêm danh mục thất bại!')
    }
    else if (err.statusCode === 401){
      snackbar.error('Bạn cần đăng nhập để thêm danh mục!', 'Thêm danh mục thất bại!')
    }
    else if (err.statusCode === 500){
        snackbar.error('Đã có lỗi không xác định xảy ra, hãy liên hệ admin để được hỗ trợ!', 'Thêm danh mục thất bại!')
    }
    else{
        if (err.data.length > 100) {
            err.data = err.data.substring(0, 100) + '...'
        }
        snackbar.error(err.data, 'Thêm danh mục thất bại!')
    }
  }
}
const closeModal = (created) => {
  form.value.clear()
  userStockList.name = undefined;
  userStockList.short_name = undefined;
  userStockList.stock = [];
  emit("close-modal", created)
  setStockListModal(false)
}

async function searchStock(q) {
    loading.value = true;
    const {data:stockSearch, error} = await useAPI().get("/stock/stocks/", { search: q });
    loading.value = false
    const res = stockSearch.value.results.map((e) => {
        return {
            id: e.id,
            name: e.symbol + " - " + e.name_vi,
        };
    });
    return res
}
const createStockList = async (value) => {
  const { data: stockList, error } = await useAPI().post(
    "/stock/user_stock_lists/",
    value
  );
  if (error.value) {
      throw error.value
  }
  return stockList
};
const updateStockList = async (value) => {
  const { data, error } = await useAPI().patch(
    `/stock/user_stock_lists/${stockListInfo.value.id}/`,
    value
  );
  if (error.value) {
      throw error.value
  }
  return data.value
};
const addStock = async (value) => {
  if (stockListInfo.value === undefined || stockListInfo.value === null) {
    throw 'stockListInfo is undefined'
  }
  const { data: stockList, error } = await useAPI().post(
      `/stock/user_stock_lists/${stockListInfo.value.id}/add/`,
      value
    );
    if (error.value) {
        throw error.value
    }
    return stockList
};
</script>
