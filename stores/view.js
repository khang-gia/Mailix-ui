import { defineStore } from 'pinia'

export const useViewStore = defineStore('viewStore', () => {
    const viewOption = ref({
        dashboardViewAsPage: false,
        showUserStockList: true,
        pinUserStockList: true,
    })
    const sortable = ref(false)
    const stockListOrder = ref([])
    const pageSize = ref(6)
    const readTime = ref(0)
    
    function toggleSortable() {
        sortable.value = !sortable.value
    }

    function setOrder(order) {
        stockListOrder.value = order
    }

    function changeOrder(oldIndex, newIndex) {
        const order = stockListOrder.value
        const movedItem = order.splice(oldIndex, 1)[0]
        order.splice(newIndex, 0, movedItem)
        stockListOrder.value = order
    }

    function setView(value) {
        viewOption.value = value
    }
    function setViewAttr(attr, value) {
        viewOption.value[attr] = value
    }
    function setReadTime(value) {
        readTime.value = value
    }
    return { setView, setViewAttr, viewOption, setOrder, changeOrder, stockListOrder, sortable, toggleSortable, pageSize, setReadTime, readTime}
}, {
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
            maxAge: 12*30*24*60*60
        })
    }
})