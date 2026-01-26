<template>
    <UModal v-model="isOpen" class="font-averta">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ $t('Add Members') }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <div class="space-y-4">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid"
                    :placeholder="$t('Search users...')" @update:model-value="onSearch" />

                <div class="h-96 overflow-y-auto">
                    <UTable v-model="selected" :rows="users" :columns="columns" :loading="loading"
                        :empty-state="{ icon: 'i-heroicons-user-group', label: $t('No users found') }">
                        <template #name-data="{ row }">
                            <div class="flex items-center gap-3">
                                <UAvatar :src="row.avatar" :alt="row.user?.display_name" size="sm" />
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white">{{ row.user?.display_name }}
                                    </div>
                                    <div class="text-xs text-gray-500">{{ row.user?.email }}</div>
                                </div>
                            </div>
                        </template>
                    </UTable>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="ghost" @click="isOpen = false">
                        {{ $t('Cancel') }}
                    </UButton>
                    <UButton color="primary" @click="addMembers" :loading="submitting"
                        :disabled="selected.length === 0">
                        {{ $t('Add') }} ({{ selected.length }})
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: [String, Number],
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'added'])

const { t } = useI18n()
const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const search = ref('')
const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const selected = ref([])

const columns = [
    {
        key: 'name',
        label: t('User')
    }
]

// Debounce search
const onSearch = useDebounceFn(async () => {
    await fetchUsers()
}, 300)

const fetchUsers = async () => {
    loading.value = true
    try {
        const data = await useAPI().$get('social/profiles/', {
            search: search.value,
            page_size: 50, // Limit results
            not_in_group: props.groupId
        })
        users.value = data.results || []
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const addMembers = async () => {
    if (selected.value.length === 0) return

    submitting.value = true
    try {
        const userIds = selected.value.map(u => u.user.id)
        await useAPI().post(`social/groups/${props.groupId}/add_members/`, {
            user_ids: userIds
        })

        useToast().add({
            title: t('Success'),
            description: t('Members added successfully'),
            color: 'green'
        })

        emit('added')
        selected.value = [] // Clear selection
        isOpen.value = false
    } catch (e) {
        useToast().add({
            title: t('Error'),
            description: e.message || t('Failed to add members'),
            color: 'red'
        })
    } finally {
        submitting.value = false
    }
}

// Fetch initial users when modal opens
watch(isOpen, (val) => {
    if (val) {
        fetchUsers()
        selected.value = []
    }
})
</script>
