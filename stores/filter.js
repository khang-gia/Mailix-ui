import { defineStore } from 'pinia'
import lodash from 'lodash'; 
const { cloneDeep } = lodash;

export const useFilterStore = defineStore('filter', () => {

  const isOpenFilter = ref(false)
  const filterType = ref('')
  const contactFilter = ref({
    customer_source: [],
    curators: [],
  })
  const customerFilter = ref({
    customer_source: [],
    customer_group: [],
    curators: [],
  })
  const hrFilter = ref({
    departments: [],
    title: [],
    direct_managers: [],
    statuses: [],
    join_date: null,
  })
  const workFilter = ref({
    statuses: [],
    progress_start: '',
    progress_end: '',
    priorities: [],
    assigned_tos: [],
    assigned_bys: [],
    managers: [],
    start_date: null,
    end_date: null,
    actual_start_date: null,
  })
  const currentFilter = ref({})
  function setFilterModal(is_open, type){
    isOpenFilter.value = is_open
    filterType.value = type
    currentFilter.value = cloneDeep(getFilter(type))
  }
  function clearFilter(type) {
    if (type === 'contacts') {
      contactFilter.value = {
        customer_source: [],
        curators: [],
      }
    }
    if (type === 'customers') {
      customerFilter.value = {
        customer_source: [],
        customer_group: [],
        curators: [],
      }
    }
    if (type === 'profile_hrs') {
      hrFilter.value = {
        departments: [],
        title: [],
        direct_managers: [],
        statuses: [],
        join_date: null,
      }
    }
    if (type === 'works') {
      workFilter.value = {
        statuses: [],
        progress_start: '',
        progress_end: '',
        priorities: [],
        curators: [],
        assigned_tos: [],
        assigned_bys: [],
        managers: [],
        start_date: null,
        end_date: null,
        actual_start_date: null,
      }
    }
  }
  function getFilter(type) {
    if (type === 'contacts') {
      return contactFilter.value
    } else if (type === 'customers') {
      return customerFilter.value
    } else if (type === 'profile_hrs') {
      return hrFilter.value
    } else if (type === 'works') {
      return workFilter.value
    }
    return {}
  }
  function setFilter(type, filter) {
    if (type === 'contacts') {
      contactFilter.value = filter
    } else if (type === 'customers') {
      customerFilter.value = filter
    } else if (type === 'profile_hrs') {
      hrFilter.value = filter
    } else if (type === 'works') {
      workFilter.value = filter
    }
  }
  return {
    clearFilter,
    isOpenFilter,
    filterType,
    contactFilter,
    customerFilter,
    hrFilter,
    workFilter,
    setFilterModal,
    setFilter,
    currentFilter
  }
}, {
  persist: true,
})