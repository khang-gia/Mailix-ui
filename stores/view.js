import { defineStore } from 'pinia'

export const useViewStore = defineStore('viewStore', () => {
    const viewOption = ref({
        dashboardViewAsPage: false,
        showUserStockList: true,
        pinUserStockList: true,
    })
    const sortable = ref(false)
    const pageSize = ref(6)
    const readTime = ref(0)
    
    function toggleSortable() {
        sortable.value = !sortable.value
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
    return { setView, setViewAttr, viewOption,  sortable, toggleSortable, pageSize, setReadTime, readTime}
}, {
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
            maxAge: 12*30*24*60*60
        })
    }
})