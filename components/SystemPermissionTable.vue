<template>
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <!-- Table Container with Scroll -->
        <div class="overflow-x-auto" style="max-height: 600px;">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="sticky top-0 bg-gray-50 z-10">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            style="min-width: 200px;">
                            {{ $t('Resource') }}
                        </th>
                        <th v-for="group in columns" :key="group.id" scope="col"
                            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            style="min-width: 130px;">
                            {{ group.name }}
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <template v-for="(row, rowIndex) in permissionList" :key="rowIndex">
                        <!-- Category Header Row -->
                        <tr v-if="row.resource_list.length === 0" class="bg-primary-600">
                            <td :colspan="columns.length + 1" class="px-6 py-3">
                                <span class="text-sm font-bold text-white uppercase">
                                    {{ $t(row.resource_name) }}
                                </span>
                            </td>
                        </tr>

                        <!-- Resource Permission Row -->
                        <tr v-else class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ $t(row.resource_view) }}
                            </td>
                            <td v-for="(permission, index) in row.resource_list" :key="index"
                                class="px-6 py-4 text-center">
                                <UCheckbox v-model="permission.status" color="primary" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Footer with Action Button -->
        <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
            <UButton color="primary" size="lg" icon="i-heroicons-check-circle" :loading="saving" @click="onConfirm">
                {{ $t('Update permissions') }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

// Props
interface Props {
    data?: any[]
    columns?: any[]
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    columns: () => []
})

// Emits
const emit = defineEmits<{
    updated: [groupResource: any]
}>()

// Composables
const api = useAPI()
const toast = useToast()
const modalStore = useModalStore()
const { setAlertModal } = modalStore
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { t } = useI18n()

// State
const saving = ref(false)
const permissions = ref<any[]>([])

// Fetch existing permissions from the database
const fetchPermissions = async () => {
    try {
        const data = await api.$get('/system/permissions/', { page_size: 5000 }) as any
        permissions.value = data?.results || data || []
    } catch (error) {
        console.error('Error fetching permissions:', error)
        permissions.value = []
    }
}

// Watch for data/columns changes to refetch permissions
watch(() => [props.data, props.columns], () => {
    if (props.data.length > 0 && props.columns.length > 0) {
        fetchPermissions()
    }
}, { immediate: true })

// Computed
const permissionList = computed(() => {
    const data = _.sortBy(props.data, ['sort_number', 'id'])
    const permissionList: any[] = []

    _.forEach(data, (resource, index) => {
        // Add resource name header row
        if (index === 0 || resource.name !== data[index - 1].name) {
            permissionList.push({
                resource_name: resource.name,
                resource_view: '',
                resource_list: []
            })
        }

        // Build resource list with permissions for each group
        const resourceList = _.map(props.columns, (group) => ({
            resource: resource.id,
            group: group.id,
            status: getPermissionStatus(resource.id, group.id)
        }))

        // Add resource row with permissions
        permissionList.push({
            resource_name: resource.name,
            resource_view: resource.name_view,
            resource_list: resourceList
        })
    })

    return permissionList
})

// Methods
/**
 * Get the permission status from the Permission model
 * This checks the actual Permission.status field from the database
 */
const getPermissionStatus = (resourceId: number, groupId: number): boolean => {
    const permission = permissions.value.find(
        p => p.resource === resourceId && p.group === groupId
    )
    return permission?.status || false
}

const prepareData = () => {
    return _.filter(permissionList.value, (item) => {
        return item.resource_list.length !== 0
    })
}

const performUpdate = async () => {
    saving.value = true

    try {
        const data = prepareData()

        // Call API to update permissions using the update_multiple endpoint
        await api.$post('/system/permissions/update_multiple/', data)

        // Refetch permissions to get updated values
        await fetchPermissions()

        // Emit updated event
        if (props.data.length > 0) {
            emit('updated', props.data[0].group_resource)
        }

        // Show success notification
        toast.add({
            title: t('Success'),
            description: t('Permissions updated successfully!'),
            color: 'green',
            icon: 'i-heroicons-check-circle'
        })
    } catch (error: any) {
        console.error('Error updating permissions:', error)
        toast.add({
            title: t('Error'),
            description: error.message || t('Failed to update permissions'),
            color: 'red',
            icon: 'i-heroicons-exclamation-circle'
        })
    } finally {
        saving.value = false
    }
}

const onConfirm = () => {
    // Show confirmation modal
    setAlertModal(true, {
        message: t('Are you sure you want to save these permission changes?'),
        confirmButton: t('Confirm'),
        denyButton: t('Cancel'),
    }, true)

    // Watch for modal close to get confirmation result
    const unwatch = watch(
        () => alertModal.value,
        async (newVal) => {
            if (!newVal) {
                if (alertConfirm.value) {
                    await performUpdate()
                }
                unwatch()
            }
        }
    )
}
</script>

<style scoped>
/* Minimal custom styles - mostly using Tailwind */
</style>
