<template>
    <UModal v-model="isOpen" class="font-averta">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ $t('Manage Members') }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
                </div>
            </template>
            <div class="space-y-4">
                <UFormGroup
                    :label="$t('Assigned to')"
                    name="assigned_to">
                    <WorkMemberSelect v-model:selectedUsers="assignedTo" :placeholder="$t('Search users or groups...')"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work assigned by')"
                    name="assigned_by">
                    <WorkMemberSelect v-model:selectedUsers="assignedBy" :placeholder="$t('Search users or groups...')"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work manage by')"
                    name="managers">
                    <WorkMemberSelect v-model:selectedUsers="managers" :placeholder="$t('Search users or groups...')"/>
                </UFormGroup>
                
                <!-- <div v-if="assignedTo.length > 0" class="mt-4">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                        {{ $t('Current Assignees') }} ({{ assignedTo.length }})
                    </label>
                    <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-100 dark:border-gray-800 rounded-lg">
                        <template v-for="user in assignedTo" :key="user.id">
                            <UBadge color="blue" variant="soft" size="sm" class="rounded-full pl-1">
                                <UAvatar :src="user.avatar" size="2xs" class="mr-1" :alt="user.full_name" />
                                <span class="truncate max-w-[150px]">{{ user.full_name || user.username }}</span>
                                <UButton
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-x-mark-20-solid"
                                    size="2xs"
                                    class="-my-1 ml-1"
                                    @click="assignedTo = assignedTo.filter(u => u.id !== user.id)"
                                />
                            </UBadge>
                        </template>
                    </div>
                </div> -->
            </div>
            <template #footer>
                <div class="flex justify-end">
                    <UButton color="primary" :label="$t('Update')" @click="handleUpdate"/>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
const isOpen = defineModel({ type: Boolean, default: false })
const assignedTo = defineModel('assignedTo', { type: Array, default: () => [] })
const assignedBy = defineModel('assignedBy', { type: Array, default: () => [] })
const managers = defineModel('managers', { type: Array, default: () => [] })

const emit = defineEmits(['save'])

const handleUpdate = () => {
    emit('save')
    isOpen.value = false
}
</script>
