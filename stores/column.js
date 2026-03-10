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
    {
        key: 'status_display',
        label: 'Status',
        sortable: true,
        is_show:true,
    }
])
  const workKanbanColumn = ref([
    {
        key: 'not_started',
        label: 'Not Started',
        is_show:false,
    },
    {
        key: 'backlog',
        label: 'Backlog',
        is_show:true,
    },
    {
        key: 'todo',
        label: 'Todo',
        is_show:true,
    },
    {
        key: 'in_progress',
        label: 'In Progress',
        is_show:true,
    },
    {
        key: 'completed',
        label: 'Completed',
        is_show:true,
    },
    {
        key: 'on_hold',
        label: 'On Hold',
        is_show:false,
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        is_show:false,
    },
    {
        key: 'deferred',
        label: 'Deferred',
        is_show:false,
    },
    {
        key: 'waiting_for_review',
        label: 'Waiting for Review',
        is_show:false,
    },
    {
        key: 'approved',
        label: 'Approved',
        is_show:false,
    },
    {
        key: 'rejected',
        label: 'Rejected',
        is_show:false,
    },
    {
        key: 'pending',
        label: 'Pending',
        is_show:false,
    },
    {
        key: 'failed',
        label: 'Failed',
        is_show:false,
    },
    {
        key: 'success',
        label: 'Success',
        is_show:false,
    },
    {
        key: 'archived',
        label: 'Archived',
        is_show:false,
    },
    {
        key: 'deleted',
        label: 'Deleted',
        is_show:false,
    },
    {
        key: 'draft',
        label: 'Draft',
        is_show:false,
    },
  ])
  const currentColumn = ref([])
  function setColumnModal(is_open, type){
    isOpen.value = is_open
    page.value = type
    currentColumn.value = cloneDeep(getColumn(type))
  }
  // Helper function to get default column configurations
  function getDefaultColumns(type) {
    const defaults = {
      contacts: [
        { key: 'name', label: 'Contact Name', sortable: true, is_show: true },
        { key: 'customer_code', label: 'Contact Code', sortable: true, is_show: true },
        { key: 'company_name', label: 'Company/Organization Name', sortable: true, is_show: true },
        { key: 'phone', label: 'Phone', sortable: true, is_show: true },
        { key: 'email', label: 'Email', sortable: true, is_show: true },
        { key: 'address', label: 'Address', sortable: true, is_show: true },
        { key: 'curators', label: 'Assigned to', sortable: true, is_show: true },
        { key: 'customer_source', label: 'Contact Source', sortable: true, is_show: true },
        { key: 'type_of_customer', label: 'Type of contact', sortable: true, is_show: true },
        { key: 'created_at', label: 'Created At', sortable: true, is_show: true },
        { key: 'status_display', label: 'Status', sortable: true, is_show: true }
      ],
      customers: [
        { key: 'name', label: 'Customer Name', sortable: true, is_show: true },
        { key: 'customer_code', label: 'Customer Code', sortable: true, is_show: true },
        { key: 'company_name', label: 'Company/Organization Name', sortable: true, is_show: true },
        { key: 'phone', label: 'Phone', sortable: true, is_show: true },
        { key: 'email', label: 'Email', sortable: true, is_show: true },
        { key: 'address', label: 'Address', sortable: true, is_show: true },
        { key: 'curators', label: 'Assigned to', sortable: true, is_show: true },
        { key: 'customer_source', label: 'Customer Source', sortable: true, is_show: true },
        { key: 'customer_group', label: 'Customer Group', sortable: true, is_show: true },
        { key: 'type_of_customer', label: 'Type of customer', sortable: true, is_show: true },
        { key: 'created_at', label: 'Created At', sortable: true, is_show: true }
      ],
      profile_hrs: [
        { key: 'full_name', label: 'Full Name', sortable: true, is_show: true },
        { key: 'employee_code', label: 'Employee Code', sortable: true, is_show: true },
        { key: 'profile_code', label: 'Profile code', sortable: true, is_show: true },
        { key: 'dob', label: 'Dob', sortable: true, is_show: true },
        { key: 'gender', label: 'Gender', sortable: true, is_show: true },
        { key: 'department_name', label: 'Department', sortable: true, is_show: true },
        { key: 'title_name', label: 'Title', sortable: true, is_show: true },
        { key: 'join_date', label: 'Join Date', sortable: true, is_show: true },
        { key: 'system_date_joined', label: 'Date create account', sortable: true, is_show: true },
        { key: 'phone', label: 'Phone', sortable: true, is_show: true },
        { key: 'position', label: 'Position', sortable: true, is_show: false }
      ],
      works: [
        { key: 'name', label: 'Work Name', sortable: true, is_show: true },
        { key: 'code', label: 'Work Code', sortable: true, is_show: true },
        { key: 'progress', label: 'Progress', sortable: true, is_show: true },
        { key: 'assigned_to', label: 'Work assigned to', sortable: true, is_show: true },
        { key: 'assigned_by', label: 'Work assigned by', sortable: true, is_show: true },
        { key: 'managers', label: 'Work manage by', sortable: true, is_show: true },
        { key: 'start_date', label: 'Start date', sortable: true, is_show: true },
        { key: 'end_date', label: 'End date', sortable: true, is_show: true },
        { key: 'actual_start_date', label: 'Actual start date', sortable: true, is_show: true },
        { key: 'created_by', label: 'Created By', sortable: true, is_show: true },
        { key: 'status_display', label: 'Status', sortable: true, is_show: true }
      ],
      work_kanban: [
        { key: 'not_started', label: 'Not Started', sortable: true, is_show: false },
        { key: 'backlog', label: 'Backlog', sortable: true, is_show: true },
        { key: 'todo', label: 'Todo', sortable: true, is_show: true },
        { key: 'in_progress', label: 'In Progress', sortable: true, is_show: true },
        { key: 'completed', label: 'Completed', sortable: true, is_show: true },
        { key: 'on_hold', label: 'On Hold', sortable: true, is_show: false },
        { key: 'cancelled', label: 'Cancelled', sortable: true, is_show: false },
        { key: 'deferred', label: 'Deferred', sortable: true, is_show: false },
        { key: 'waiting_for_review', label: 'Waiting for Review', sortable: true, is_show: false },
        { key: 'approved', label: 'Approved', sortable: true, is_show: false },
        { key: 'rejected', label: 'Rejected', sortable: true, is_show: false },
        { key: 'pending', label: 'Pending', sortable: true, is_show: false },
        { key: 'failed', label: 'Failed', sortable: true, is_show: false },
        { key: 'success', label: 'Success', sortable: true, is_show: false },
        { key: 'archived', label: 'Archived', sortable: true, is_show: false },
        { key: 'deleted', label: 'Deleted', sortable: true, is_show: false },
        { key: 'draft', label: 'Draft', sortable: true, is_show: false }
      ]
    }
    return defaults[type] || []
  }

  function clearColumn(type) {
    const columnMap = {
      contacts: contactColumn,
      customers: customerColumn,
      profile_hrs: hrColumn,
      works: workColumn,
      work_kanban: workKanbanColumn
    }
    
    const column = columnMap[type]
    if (column) {
      column.value = cloneDeep(getDefaultColumns(type))
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
    }else if (type === 'work_kanban') {
      return workKanbanColumn.value
    }
    return []
  }
  function setColumn(type, filter) {
    console.log('setColumn', type, filter)
    if (type === 'contacts') {
      contactColumn.value = filter
    } else if (type === 'customers') {
      customerColumn.value = filter
    } else if (type === 'profile_hrs') {
      hrColumn.value = filter
    } else if (type === 'works') {
      workColumn.value = filter
    }else if (type === 'work_kanban') {
      workKanbanColumn.value = filter
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
    workKanbanColumn,
    setColumnModal,
    setColumn,
    currentColumn
  }
}, {
  persist: true,
})
