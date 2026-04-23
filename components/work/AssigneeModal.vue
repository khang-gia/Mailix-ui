<template>
    <UModal v-model="isOpen" class="font-averta">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ $t('Manage Assignees') }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
                </div>
            </template>
            <div class="space-y-4">
                <UFormGroup
                    :label="$t('Work assigned to (Groups)')"
                    name="assigned_groups">
                    <SystemGroupSelectMulti v-model="assignedGroups" :placeholder="$t('Work assigned to groups')" :multiple="true"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work assigned to (Users)')"
                    name="assigned_to">
                    <CustomerUserSelect v-model="assignedTo" :placeholder="$t('Work assigned to users')" :multiple="true"/>
                </UFormGroup>
            </div>
            <template #footer>
                <div class="flex justify-end">
                    <UButton color="primary" :label="$t('Update')" @click="isOpen = false"/>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
const isOpen = defineModel({ type: Boolean, default: false })
const assignedGroups = defineModel('assignedGroups', { type: Array, default: () => [] })
const assignedTo = defineModel('assignedTo', { type: Array, default: () => [] })
</script>
