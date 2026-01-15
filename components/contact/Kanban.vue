<template>
    <div class="kanban-board">
        <div class="flex gap-4 overflow-x-auto pb-4">
            <!-- 8 Customer Status Columns -->
            <div v-for="column in columns" :key="column.status"
                class="kanban-column flex-shrink-0 w-80 flex flex-col">
                <!-- Column Header -->
                <div class="rounded-t-xl p-4" :class="column.headerClass">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon :name="column.icon" :class="column.iconClass" />
                            <h3 class="font-semibold" :class="column.titleClass">
                                {{ column.label }}
                            </h3>
                        </div>
                        <div class="flex items-center gap-2">
                            <UBadge :color="column.color" variant="subtle" size="xs">
                                {{ getCustomersByStatus(column.status).length }}
                            </UBadge>
                            <UButton icon="i-heroicons-plus" size="xs" variant="ghost" color="gray"
                                @click="openCreateModal(column.status)" />
                        </div>
                    </div>
                </div>

                <!-- Column Content - Scrollable -->
                <div class="kanban-column-content rounded-b-xl flex flex-col" :class="column.contentClass">
                    <div class="overflow-y-auto flex-1 p-4 pb-0 space-y-3"
                        :class="{ 'drag-over': isDraggingOver === column.status }"
                        @drop="onDrop($event, column.status)"
                        @dragover.prevent="isDraggingOver = column.status"
                        @dragleave="isDraggingOver = null">
                        
                        <!-- Customer Cards -->
                        <ContactKanbanCard
                            v-for="customer in getCustomersByStatus(column.status)"
                            :key="customer.id"
                            :customer="customer"
                            @dragstart="onDragStart($event, customer)"
                        />

                        <!-- New Contact Button - Sticky at bottom -->
                        <div class="sticky bottom-0 py-2 w-full" :class="column.contentClass">
                            <UButton icon="i-heroicons-plus" size="sm" color="gray"
                                variant="ghost" block class="justify-start text-gray-500"
                                @click="openCreateModal(column.status)">
                                {{ $t('New Contact') }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    customers: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['update:status'])

// Drag and drop state
const isDraggingOver = ref(null)
const draggedCustomer = ref(null)

// 8 Customer Status Columns
const columns = [
    {
        status: 1,
        label: t('New'),
        icon: 'i-heroicons-sparkles',
        iconClass: 'text-gray-600',
        titleClass: 'text-gray-800 dark:text-gray-100',
        headerClass: 'bg-gray-100 dark:bg-gray-800',
        contentClass: 'bg-gray-50 dark:bg-gray-900',
        color: 'gray'
    },
    {
        status: 2,
        label: t('1st Contacted'),
        icon: 'i-heroicons-phone',
        iconClass: 'text-blue-600',
        titleClass: 'text-blue-800 dark:text-blue-100',
        headerClass: 'bg-blue-100 dark:bg-blue-900',
        contentClass: 'bg-blue-50 dark:bg-blue-950',
        color: 'blue'
    },
    {
        status: 3,
        label: t('2nd Contacted'),
        icon: 'i-heroicons-phone-arrow-up-right',
        iconClass: 'text-blue-600',
        titleClass: 'text-blue-800 dark:text-blue-100',
        headerClass: 'bg-blue-100 dark:bg-blue-900',
        contentClass: 'bg-blue-50 dark:bg-blue-950',
        color: 'blue'
    },
    {
        status: 4,
        label: t('Consulting'),
        icon: 'i-heroicons-chat-bubble-left-right',
        iconClass: 'text-yellow-600',
        titleClass: 'text-yellow-800 dark:text-yellow-100',
        headerClass: 'bg-yellow-100 dark:bg-yellow-900',
        contentClass: 'bg-yellow-50 dark:bg-yellow-950',
        color: 'yellow'
    },
    // {
    //     status: 5,
    //     label: t('Negotiating'),
    //     icon: 'i-heroicons-scale',
    //     iconClass: 'text-amber-600',
    //     titleClass: 'text-amber-800 dark:text-amber-100',
    //     headerClass: 'bg-amber-100 dark:bg-amber-900',
    //     contentClass: 'bg-amber-50 dark:bg-amber-950',
    //     color: 'amber'
    // },
    // {
    //     status: 6,
    //     label: t('Contracted'),
    //     icon: 'i-heroicons-document-check',
    //     iconClass: 'text-green-600',
    //     titleClass: 'text-green-800 dark:text-green-100',
    //     headerClass: 'bg-green-100 dark:bg-green-900',
    //     contentClass: 'bg-green-50 dark:bg-green-950',
    //     color: 'green'
    // },
    // {
    //     status: 7,
    //     label: t('Quoted'),
    //     icon: 'i-heroicons-document-text',
    //     iconClass: 'text-purple-600',
    //     titleClass: 'text-purple-800 dark:text-purple-100',
    //     headerClass: 'bg-purple-100 dark:bg-purple-900',
    //     contentClass: 'bg-purple-50 dark:bg-purple-950',
    //     color: 'purple'
    // },
    {
        status: 8,
        label: t('Old Customer'),
        icon: 'i-heroicons-archive-box',
        iconClass: 'text-slate-600',
        titleClass: 'text-slate-800 dark:text-slate-100',
        headerClass: 'bg-slate-100 dark:bg-slate-900',
        contentClass: 'bg-slate-50 dark:bg-slate-950',
        color: 'slate'
    }
]

// Get customers by status
const getCustomersByStatus = (status) => {
    return props.customers.filter(customer => customer.status === status)
}

// Open create modal with pre-filled status
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setContactKanbanModal } = modalStore

const openCreateModal = (status) => {
    // Open create contact modal with pre-filled status
    setContactKanbanModal(true, status)
}

// Drag start handler
const onDragStart = (event, customer) => {
    draggedCustomer.value = customer
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('customerId', customer.id)
}

// Drop handler
const onDrop = (event, newStatus) => {
    event.preventDefault()
    isDraggingOver.value = null
    
    if (!draggedCustomer.value) return
    
    const oldStatus = draggedCustomer.value.status
    
    if (oldStatus !== newStatus) {
        emit('update:status', {
            customerId: draggedCustomer.value.id,
            oldStatus,
            newStatus
        })
    }
    
    draggedCustomer.value = null
}
</script>

<style scoped>
.kanban-board {
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
}

.kanban-column {
    min-width: 320px;
}

.kanban-column-content {
    height: calc(100vh - 280px);
    min-height: 400px;
}

.drag-over {
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px dashed rgba(59, 130, 246, 0.5);
    border-radius: 0.5rem;
}
</style>
