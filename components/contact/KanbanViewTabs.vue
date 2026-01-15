<template>
    <div class="p-2">
        <UCard :ui="{
            body: {
                padding: 'p-0 sm:p-0'
            }
        }">
            <div class="p-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {{ $t('Kanban board - Contact Management') }}
                </h2>
                <div class="kanban-container">
                    <ContactKanban 
                        :customers="customers" 
                        @update:status="handleStatusUpdate"
                    />
                </div>
            </div>
        </UCard>
    </div>

    <!-- Create Contact Modal -->
    <ModalCreateContactKanban @contactCreated="handleContactCreated" />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// Fetch customers
const customers = ref([])
const loading = ref(false)

const fetchCustomers = async () => {
    loading.value = true
    try {
        const { data: response } = await useAPI().get('core/customers/', {
            ordering: '-created_at',
            stage: 1 
        })
        customers.value = response.value.results || []
    } catch (error) {
        console.error('Error fetching customers:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to load customers'),
            color: 'red',
        })
    } finally {
        loading.value = false
    }
}

// Handle status update from drag & drop
const handleStatusUpdate = async ({ customerId, oldStatus, newStatus }) => {
    try {
        const response = await useAPI().patch(`core/customers/${customerId}/`, {
            status: newStatus
        })
        
        if (response.status.value === 'success') {
            // Update local customer status
            const customer = customers.value.find(c => c.id === customerId)
            if (customer) {
                customer.status = newStatus
                // Update status_display if available in response
                if (response.data.value?.status_display) {
                    customer.status_display = response.data.value.status_display
                }
            }
            
            useToast().add({
                title: t('Success'),
                description: t('Customer status updated'),
                color: 'green',
            })
        }
    } catch (error) {
        console.error('Error updating customer status:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to update status'),
            color: 'red',
        })
        
        // Revert the change by refetching
        await fetchCustomers()
    }
}

// Handle contact created from modal - add to array without full reload
const handleContactCreated = (newContact) => {
    customers.value.unshift(newContact)
    useToast().add({
        title: t('Success'),
        description: t('Contact added to kanban'),
        color: 'green',
    })
}

// Fetch customers on mount
onMounted(() => {
    fetchCustomers()
})
</script>

<style scoped>
.kanban-container {
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
}

html,
body {
    height: 100%;
    overflow: hidden;
}
</style>
