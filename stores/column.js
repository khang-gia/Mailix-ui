import { defineStore } from 'pinia'
import lodash from 'lodash'; 
const { cloneDeep } = lodash;

export const useDisplayColStore = defineStore('column', () => {

  const isOpen = ref(false)
  const page = ref('')
  const contactColumn = ref([
    {   
        key: 'name',
        label: 'Contact Name',
        sortable: true,
        is_show:true,
    },
    {
        key: 'customer_code',
        label: 'Contact Code',
        sortable: true,
        is_show:true,
    },
    {
        key: 'company_name',
        label: 'Company/Organization Name',
        sortable: true,
        is_show:true,
    },
    {
        key: 'phone',
        label: 'Phone',
        sortable: true,
        is_show:true,
    },
    {
        key: 'email',
        label: "Email",
        sortable: true,
        is_show:true,
    },
    {
        key: 'address',
        label: 'Address',
        sortable: true,
        is_show:true,
    },
    {
        key: 'curators',
        label: 'Assigned to',
        sortable: true,
        is_show:true,
    },
    {
        key: 'customer_source',
        label: 'Contact Source',
        sortable: true,
        is_show:true,
    },
    {
        key: 'type_of_customer',
        label: 'Type of contact',
        sortable: true,
        is_show:true,
    },
    {
        key: 'created_at',
        label: 'Created At',
        sortable: true,
        is_show:true,
    },
    {
        key: 'status_display',
        label: 'Status',
        sortable: true,
        is_show:true,
    }
  ])
  const customerColumn = ref([
    {   
        key: 'name',
        label: 'Customer Name',
        sortable: true,
        is_show:true,
    },
    {
        key: 'customer_code',
        label: 'Customer Code',
        sortable: true,
        is_show:true,
    },
    {
        key: 'company_name',
        label: 'Company/Organization Name',
        sortable: true,
        is_show:true,
    },
    {
        key: 'phone',
        label: 'Phone',
        sortable: true,
        is_show:true,
    },
    {
        key: 'email',
        label: "Email",
        sortable: true,
        is_show:true,
    },
    {
        key: 'address',
        label: 'Address',
        sortable: true,
        is_show:true,
    },
    {
        key: 'curators',
        label: 'Assigned to',
        sortable: true,
        is_show:true,
    },
    {
        key: 'customer_source',
        label: 'Customer Source',
        sortable: true,
        is_show:true,
    },
    {
        key: 'customer_group',
        label: 'Customer Group',
        sortable: true,
        is_show:true,
    },
    {
        key: 'type_of_customer',
        label: 'Type of customer',
        sortable: true,
        is_show:true,
    },
    {
        key: 'created_at',
        label: 'Created At',
        sortable: true,
        is_show:true,
    },
])
  const hrColumn = ref([
    {
        key: 'full_name',
        label: 'Full Name',
        sortable: true,
        is_show:true,
    },
    {   
        key: 'employee_code',
        label: 'Employee Code',
        sortable: true,
        is_show:true,
    },
    {
        key: 'profile_code',
        label: 'Profile code',
        sortable: true,
        is_show:true,
    },
    {
        key: 'dob',
        label: 'Dob',
        sortable: true,
        is_show:true,
    },
    {
        key: 'gender',
        label: 'Gender',
        sortable: true,
        is_show:true,
    },
    {
        key: 'department_name',
        label: 'Department',
        sortable: true,
        is_show:true,
    },
    {
        key: 'title_name',
        label: 'Title',
        sortable: true,
        is_show:true,
    },
    {
        key: 'join_date',
        label: 'Join Date',
        sortable: true,
        is_show:true,
    },
    {
        key: 'system_date_joined',
        label: 'Date create account',
        sortable: true,
        is_show:true,
    },
    {
        key: 'phone',
        label: 'Phone',
        sortable: true,
        is_show:true,
    },
    {
        key: 'position',
        label: 'Position',
        sortable: true,
        is_show:false,
    },
    
])
  const workColumn = ref([
    {   
        key: 'name',
        label: 'Work Name',
        sortable: true,
        is_show:true,
    },
    {
        key: 'code',
        label: 'Work Code',
        sortable: true,
        is_show:true,
    },
    {
        key: 'progress',
        label: 'Progress',
        sortable: true,
        is_show:true,
    },
    {
        key: 'assigned_to',
        label: 'Work assigned to',
        sortable: true,
        is_show:true,
    },
    {
        key: 'assigned_by',
        label: 'Work assigned by',
        sortable: true,
        is_show:true,
    },
    {
        key: 'managers',
        label: 'Work manage by',
        sortable: true,
        is_show:true,
    },
    {
        key: 'start_date',
        label: 'Start date',
        sortable: true,
        is_show:true,
    },
    {
        key: 'end_date',
        label: 'End date',
        sortable: true,
        is_show:true,
    },
    {
        key: 'actual_start_date',
        label: 'Actual start date',
        sortable: true,
        is_show:true,
    },
    {
        key: 'created_by',
        label: 'Created By',
        sortable: true,
        is_show:true,
    },
])
  const currentColumn = ref([])
  function setColumnModal(is_open, type){
    isOpen.value = is_open
    page.value = type
    currentColumn.value = cloneDeep(getColumn(type))
  }
  function clearColumn(type) {
    if (type === 'contacts') {
      contactColumn.value = [
        {   
            key: 'name',
            label: 'Contact Name',
            sortable: true,
            is_show:true,
        },
        {
            key: 'customer_code',
            label: 'Contact Code',
            sortable: true,
            is_show:true,
        },
        {
            key: 'company_name',
            label: 'Company/Organization Name',
            sortable: true,
            is_show:true,
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
            is_show:true,
        },
        {
            key: 'email',
            label: "Email",
            sortable: true,
            is_show:true,
        },
        {
            key: 'address',
            label: 'Address',
            sortable: true,
            is_show:true,
        },
        {
            key: 'curators',
            label: 'Assigned to',
            sortable: true,
            is_show:true,
        },
        {
            key: 'customer_source',
            label: 'Contact Source',
            sortable: true,
            is_show:true,
        },
        {
            key: 'type_of_customer',
            label: 'Type of contact',
            sortable: true,
            is_show:true,
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            is_show:true,
        },
      ]
    }
    if (type === 'customers') {
      customerColumn.value = [
        {   
            key: 'name',
            label: 'Customer Name',
            sortable: true,
            is_show:true,
        },
        {
            key: 'customer_code',
            label: 'Customer Code',
            sortable: true,
            is_show:true,
        },
        {
            key: 'company_name',
            label: 'Company/Organization Name',
            sortable: true,
            is_show:true,
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
            is_show:true,
        },
        {
            key: 'email',
            label: "Email",
            sortable: true,
            is_show:true,
        },
        {
            key: 'address',
            label: 'Address',
            sortable: true,
            is_show:true,
        },
        {
            key: 'curators',
            label: 'Assigned to',
            sortable: true,
            is_show:true,
        },
        {
            key: 'customer_source',
            label: 'Customer Source',
            sortable: true,
            is_show:true,
        },
        {
            key: 'customer_group',
            label: 'Customer Group',
            sortable: true,
            is_show:true,
        },
        {
            key: 'type_of_customer',
            label: 'Type of customer',
            sortable: true,
            is_show:true,
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            is_show:true,
        },
    ]
    }
    if (type === 'profile_hrs') {
      hrColumn.value = [
        {
            key: 'full_name',
            label: 'Full Name',
            sortable: true,
            is_show:true,
        },
        {   
            key: 'employee_code',
            label: 'Employee Code',
            sortable: true,
            is_show:true,
        },
        {
            key: 'profile_code',
            label: 'Profile code',
            sortable: true,
            is_show:true,
        },
        {
            key: 'dob',
            label: 'Dob',
            sortable: true,
            is_show:true,
        },
        {
            key: 'gender',
            label: 'Gender',
            sortable: true,
            is_show:true,
        },
        {
            key: 'department_name',
            label: 'Department',
            sortable: true,
            is_show:true,
        },
        {
            key: 'title_name',
            label: 'Title',
            sortable: true,
            is_show:true,
        },
        {
            key: 'join_date',
            label: 'Join Date',
            sortable: true,
            is_show:true,
        },
        {
            key: 'system_date_joined',
            label: 'Date create account',
            sortable: true,
            is_show:true,
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
            is_show:true,
        },
        {
            key: 'position',
            label: 'Position',
            sortable: true,
            is_show:false,
        },
        
    ]
    }
    if (type === 'works') {
      workColumn.value = [
        {   
            key: 'name',
            label: 'Work Name',
            sortable: true,
            is_show:true,
        },
        {
            key: 'code',
            label: 'Work Code',
            sortable: true,
            is_show:true,
        },
        {
            key: 'progress',
            label: 'Progress',
            sortable: true,
            is_show:true,
        },
        {
            key: 'assigned_to',
            label: 'Work assigned to',
            sortable: true,
            is_show:true,
        },
        {
            key: 'assigned_by',
            label: 'Work assigned by',
            sortable: true,
            is_show:true,
        },
        {
            key: 'managers',
            label: 'Work manage by',
            sortable: true,
            is_show:true,
        },
        {
            key: 'start_date',
            label: 'Start date',
            sortable: true,
            is_show:true,
        },
        {
            key: 'end_date',
            label: 'End date',
            sortable: true,
            is_show:true,
        },
        {
            key: 'actual_start_date',
            label: 'Actual start date',
            sortable: true,
            is_show:true,
        },
        {
            key: 'created_by',
            label: 'Created By',
            sortable: true,
            is_show:true,
        },
    ]
    }
  }
  function getColumn(type) {
    if (type === 'contacts') {
      return contactColumn.value
    } else if (type === 'customers') {
      return customerColumn.value
    } else if (type === 'profile_hrs') {
      return hrColumn.value
    } else if (type === 'works') {
      return workColumn.value
    }
    return []
  }
  function setColumn(type, filter) {
    if (type === 'contacts') {
      contactColumn.value = filter
    } else if (type === 'customers') {
      customerColumn.value = filter
    } else if (type === 'profile_hrs') {
      hrColumn.value = filter
    } else if (type === 'works') {
      workColumn.value = filter
    }
  }
  return {
    clearColumn,
    isOpen,
    page,
    contactColumn,
    customerColumn,
    hrColumn,
    workColumn,
    setColumnModal,
    setColumn,
    currentColumn
  }
}, {
  persist: true,
})
