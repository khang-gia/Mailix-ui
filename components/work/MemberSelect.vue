<template>
    <div class="relative" ref="containerRef">
        <!-- Trigger box -->
        <div
            class="min-h-[38px] w-full flex items-center flex-wrap gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-text focus-within:ring-2 focus-within:ring-primary-500 transition-all"
            @click="openDropdown"
        >
            <template v-if="selectedUsers.length > 0">
                <span
                    v-for="user in selectedUsers"
                    :key="user.id"
                    class="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full pl-1.5 pr-1 py-0.5 text-xs font-medium border border-primary-200 dark:border-primary-800"
                >
                    <UAvatar :alt="user.full_name || user.username" size="2xs" />
                    {{ user.full_name || user.username }}
                    <button
                        class="ml-0.5 text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 focus:outline-none"
                        @click.stop="removeUser(user)"
                    >
                        <UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
                    </button>
                </span>
            </template>
            <input
                ref="inputRef"
                v-model="searchQuery"
                :placeholder="selectedUsers.length ? '' : placeholder"
                class="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                @focus="openDropdown"
                @input="onInput"
                @keydown.escape="isOpen = false"
                @keydown.backspace="onBackspace"
            />
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
                class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto"
            >
                <div v-if="loading" class="flex items-center justify-center py-6">
                    <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5 text-gray-400" />
                </div>
                <div v-else-if="userResults.length === 0 && groupResults.length === 0" class="py-4 text-center text-sm text-gray-400">
                    {{ searchQuery ? $t('No results') : $t('Start typing to search...') }}
                </div>
                <template v-else>
                    <!-- Users section -->
                    <div v-if="userResults.length > 0">
                        <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                            {{ $t('Users') }}
                        </div>
                        <div
                            v-for="user in userResults"
                            :key="'user-' + user.id"
                            class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                            :class="isUserSelected(user) ? 'bg-primary-50 dark:bg-primary-950' : ''"
                            @mousedown.prevent="toggleUser(user)"
                        >
                            <UIcon name="i-heroicons-user-circle" class="h-5 w-5 text-blue-400 flex-shrink-0" />
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                    {{ user.full_name || user.username }}
                                </div>
                                <div v-if="user.subtitle" class="text-xs text-gray-400 truncate">{{ user.subtitle }}</div>
                            </div>
                            <UIcon v-if="isUserSelected(user)" name="i-heroicons-check" class="h-4 w-4 text-primary-500 flex-shrink-0" />
                        </div>
                    </div>

                    <!-- Groups section -->
                    <div v-if="groupResults.length > 0">
                        <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                            {{ $t('Groups') }}
                        </div>
                        <div
                            v-for="group in groupResults"
                            :key="'group-' + group.id"
                            class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
                            @mousedown.prevent="expandGroup(group)"
                        >
                            <UIcon name="i-heroicons-user-group" class="h-5 w-5 text-orange-400 flex-shrink-0" />
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ group.name }}</div>
                                <div class="text-xs text-gray-400">
                                    {{ (group.users || []).length }} {{ $t('members') }}
                                </div>
                            </div>
                            <UIcon name="i-heroicons-arrow-right-circle" class="h-4 w-4 text-orange-400 flex-shrink-0" />
                        </div>
                    </div>
                </template>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const props = defineProps({
    placeholder: { type: String, default: 'Search users or groups...' }
})

const selectedUsers = defineModel('selectedUsers', { type: Array, default: () => [] })

const isOpen = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const userResults = ref([])
const groupResults = ref([])
const containerRef = ref(null)
const inputRef = ref(null)
let searchTimer = null

function openDropdown() {
    isOpen.value = true
    inputRef.value?.focus()
    if (userResults.value.length === 0 && groupResults.value.length === 0) {
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
        const [usersRes, groupsRes] = await Promise.all([
            useAPI().get('core/users/', { search: q, limit: 10 }),
            useAPI().get('system/groups/', { search: q, limit: 10 })
        ])
        userResults.value = (usersRes.data.value?.results || []).map(u => ({
            ...u,
            full_name: u.full_name || u.username,
            subtitle: u.department_name || ''
        }))
        groupResults.value = groupsRes.data.value?.results || []
    } catch (err) {
        console.error('Search failed', err)
    } finally {
        loading.value = false
    }
}

function isUserSelected(user) {
    return selectedUsers.value.some(u => u.id === user.id)
}

function toggleUser(user) {
    if (isUserSelected(user)) {
        selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id)
    } else {
        selectedUsers.value = [...selectedUsers.value, user]
    }
}

function removeUser(user) {
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id)
}

function expandGroup(group) {
    const members = group.users || []
    if (members.length === 0) return

    const currentIds = new Set(selectedUsers.value.map(u => u.id))
    const toAdd = members.filter(u => !currentIds.has(u.id))
    if (toAdd.length > 0) {
        selectedUsers.value = [...selectedUsers.value, ...toAdd]
    }
    // Close dropdown briefly then reopen to show updated list
    searchQuery.value = ''
    fetchResults('')
}

function onBackspace() {
    if (!searchQuery.value && selectedUsers.value.length > 0) {
        selectedUsers.value = selectedUsers.value.slice(0, -1)
    }
}

// Close on outside click
onMounted(() => {
    document.addEventListener('mousedown', handleOutsideClick)
})
onUnmounted(() => {
    document.removeEventListener('mousedown', handleOutsideClick)
})
function handleOutsideClick(e) {
    if (containerRef.value && !containerRef.value.contains(e.target)) {
        isOpen.value = false
        searchQuery.value = ''
    }
}
</script>
