<template>
    <div class="relative" ref="containerRef">
        <!-- Trigger box -->
        <div
            class="min-h-[38px] w-full flex items-center flex-wrap gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-text focus-within:ring-2 focus-within:ring-primary-500 transition-all"
            @click="openDropdown"
        >
            <template v-if="multiple && selectedUsers && selectedUsers.length > 0">
                <span
                    v-for="user in selectedUsers"
                    :key="user.id"
                    class="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full pl-1.5 pr-1 py-0.5 text-xs font-medium border border-primary-200 dark:border-primary-800"
                >
                    <UAvatar :src="user.avatar" :alt="user.full_name || user.username" size="2xs" />
                    {{ user.full_name || user.username }}
                    <button
                        class="ml-0.5 text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 focus:outline-none"
                        @click.stop="removeUser(user)"
                    >
                        <UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
                    </button>
                </span>
            </template>
            <template v-else-if="!multiple && selectedUsers">
                <span class="inline-flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                    <UAvatar :src="selectedUsers.avatar" :alt="selectedUsers.full_name || selectedUsers.username" size="2xs" />
                    {{ selectedUsers.full_name || selectedUsers.username }}
                </span>
            </template>

            <input
                ref="inputRef"
                v-model="searchQuery"
                :placeholder="hasValue ? '' : placeholder"
                class="flex-1 min-w-[50px] bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                @focus="openDropdown"
                @input="onInput"
                @keydown.escape="isOpen = false"
                @keydown.backspace="onBackspace"
            />

            <!-- Action icons -->
            <div class="flex items-center gap-1 self-center ml-auto pl-2">
                <button
                    v-if="hasValue"
                    class="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors group"
                    :title="$t('Clear all')"
                    @click.stop="clearAll"
                >
                    <UIcon name="i-heroicons-x-mark-20-solid" class="h-4 w-4" />
                </button>
                <UIcon 
                    name="i-heroicons-chevron-down-20-solid" 
                    class="h-4 w-4 text-gray-400 transition-transform duration-200"
                    :class="isOpen ? 'rotate-180' : ''"
                />
            </div>
        </div>

        <!-- Dropdown panel -->
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-80"
            >
                <div class="overflow-y-auto flex-1 custom-scrollbar">
                    <div v-if="loading" class="flex items-center justify-center py-8">
                        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5 text-primary-500" />
                    </div>
                    
                    <div v-else-if="results.length === 0" class="py-6 text-center text-sm text-gray-400">
                        <UIcon name="i-heroicons-magnifying-glass" class="h-8 w-8 mx-auto mb-2 opacity-20" />
                        {{ searchQuery ? $t('No results found') : $t('Type to search...') }}
                    </div>

                    <div v-else>
                        <div
                            v-for="user in results"
                            :key="user.id"
                            class="group flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors"
                            :class="isSelected(user) ? 'bg-primary-50 dark:bg-primary-900/40 border-l-2 border-primary-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-2 border-transparent'"
                            @click="selectUser(user)"
                        >
                            <UAvatar :src="user.avatar" :alt="user.full_name || user.username" size="sm" />
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {{ user.full_name || user.username }}
                                </div>
                                <div v-if="user.department_name" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {{ user.department_name }}
                                </div>
                            </div>
                            <div v-if="isSelected(user)" class="text-primary-500">
                                <UIcon name="i-heroicons-check-circle-20-solid" class="h-5 w-5" />
                            </div>
                            <div v-else class="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 transition-opacity">
                                <UIcon name="i-heroicons-plus-circle-20-solid" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { onClickOutside } from '@vueuse/core'

const { t } = useI18n()
const props = defineProps({
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
})

const selectedUsers = defineModel({ required: true, type: [Array, Object, null] })

const isOpen = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const results = ref([])
const containerRef = ref(null)
const inputRef = ref(null)
let searchTimer = null

const hasValue = computed(() => {
    if (props.multiple) {
        return selectedUsers.value && selectedUsers.value.length > 0
    }
    return !!selectedUsers.value
})

function openDropdown() {
    isOpen.value = true
    inputRef.value?.focus()
    if (results.value.length === 0) {
        fetchResults('')
    }
}

function onInput() {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchResults(searchQuery.value), 300)
}

async function fetchResults(q) {
    loading.value = true
    try {
        const { data } = await useAPI().get('core/users/', { search: q, limit: 10 })
        results.value = (data.value?.results || []).map(u => ({
            ...u,
            full_name: u.full_name || u.username,
        }))
    } catch (err) {
        console.error('Search failed', err)
    } finally {
        loading.value = false
    }
}

function isSelected(user) {
    if (props.multiple) {
        return (selectedUsers.value || []).some(u => u.id === user.id)
    }
    return selectedUsers.value?.id === user.id
}

function selectUser(user) {
    if (props.multiple) {
        const index = (selectedUsers.value || []).findIndex(u => u.id === user.id)
        if (index === -1) {
            selectedUsers.value = [...(selectedUsers.value || []), user]
        } else {
            selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id)
        }
    } else {
        selectedUsers.value = user
        isOpen.value = false
        searchQuery.value = ''
    }
}

function removeUser(user) {
    if (props.multiple) {
        selectedUsers.value = (selectedUsers.value || []).filter(u => u.id !== user.id)
    } else {
        selectedUsers.value = null
    }
}

function clearAll() {
    selectedUsers.value = props.multiple ? [] : null
    searchQuery.value = ''
}

function onBackspace() {
    if (searchQuery.value === '' && hasValue.value) {
        if (props.multiple) {
            const last = selectedUsers.value[selectedUsers.value.length - 1]
            removeUser(last)
        } else {
            selectedUsers.value = null
        }
    }
}

onClickOutside(containerRef, () => {
    isOpen.value = false
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
}
</style>