<template>
    <div class="kanban-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
        draggable="true" @dragstart="$emit('dragstart', $event)" @click="openCustomerDetail(customer)">

        <!-- Status Badge -->
        <div class="flex items-center justify-between mb-2">
            <UBadge :color="statusColors[customer.status]" variant="subtle" size="xs">
                {{ customer.status_display }}
            </UBadge>
        </div>

        <!-- Customer Code -->
        <p v-if="customer.customer_code" class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ customer.customer_code }}</p>

        <!-- Customer Name -->
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {{ customer.name }}
        </h4>

        <!-- Customer Title -->
        <p v-if="customer.title" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ customer.title }}
        </p>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <!-- Avatar -->
            <UAvatar 
                v-if="customer.avatar" 
                :src="customer.avatar" 
                :alt="customer.name" 
                size="xs"
            />
            <UAvatar 
                v-else
                :alt="customer.name" 
                size="xs"
            />

            <!-- Contact Info -->
            <div class="flex flex-col items-end gap-1">
                <div v-if="customer.phone" class="flex items-center gap-1 text-xs text-gray-500">
                    <UIcon name="i-heroicons-phone" class="w-3 h-3" />
                    <span>{{ customer.phone }}</span>
                </div>
                <div v-if="customer.email" class="flex items-center gap-1 text-xs text-gray-500">
                    <UIcon name="i-heroicons-envelope" class="w-3 h-3" />
                    <span class="truncate max-w-[120px]">{{ customer.email }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    customer: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['dragstart', 'openDetail'])

const statusColors = {
    1: 'gray',    // New
    2: 'blue',    // 1st Contacted
    3: 'blue',    // 2nd Contacted
    4: 'yellow',  // Consulting
    5: 'yellow',  // Negotiating
    6: 'green',   // Contracted
    7: 'purple',  // Quoted
    8: 'slate',   // Old Customer
}

const openCustomerDetail = (customer) => {
    navigateTo(`/contacts/${customer.id}`)
}
</script>

<style scoped>
.kanban-card {
    user-select: none;
}

.kanban-card:active {
    opacity: 0.8;
    cursor: grabbing;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
