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
                class="flex-1 min-w-[50px] bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                @focus="openDropdown"
                @input="onInput"
                @keydown.escape="isOpen = false"
                @keydown.backspace="onBackspace"
            />

            <!-- Action icons -->
            <div class="flex items-center gap-1 self-center ml-auto pl-2">
                <button
                    v-if="selectedUsers.length > 0"
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
                <!-- Search tabs for large lists -->
                <div class="flex items-center gap-1 p-1.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <button 
                        v-for="tab in [{id: 'all', label: $t('All')}, {id: 'user', label: $t('Users')}, {id: 'group', label: $t('Groups')}]"
                        :key="tab.id"
                        @mousedown.prevent="activeTab = tab.id"
                        class="flex-1 px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all"
                        :class="activeTab === tab.id 
                            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <div class="overflow-y-auto flex-1 custom-scrollbar">
                    <div v-if="loading" class="flex items-center justify-center py-8">
                        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5 text-primary-500" />
                    </div>
                    
                    <div v-else-if="userResults.length === 0 && groupResults.length === 0" class="py-6 text-center text-sm text-gray-400">
                        <UIcon name="i-heroicons-magnifying-glass" class="h-8 w-8 mx-auto mb-2 opacity-20" />
                        {{ searchQuery ? $t('No results found') : $t('Type to search...') }}
                    </div>

                    <template v-else>
                        <!-- Users section -->
                        <div v-if="userResults.length > 0 && (activeTab === 'all' || activeTab === 'user')">
                            <div class="sticky top-0 z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700">
                                {{ $t('Users') }} ({{ userResults.length }})
                            </div>
                            <div
                                v-for="user in userResults"
                                :key="'user-' + user.id"
                                class="group flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors"
                                :class="isUserSelected(user) 
                                    ? 'bg-primary-50 dark:bg-primary-900/40 border-l-2 border-primary-500' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-2 border-transparent'"
                                @mousedown.prevent="toggleUser(user)"
                            >
                                <div class="relative">
                                    <UAvatar :alt="user.full_name || user.username" size="sm" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                        {{ user.full_name || user.username }}
                                    </div>
                                    <div v-if="user.subtitle" class="text-[11px] text-gray-400 truncate opacity-80">{{ user.subtitle }}</div>
                                </div>
                                <UIcon v-if="isUserSelected(user)" name="i-heroicons-check-circle-20-solid" class="h-5 w-5 text-primary-500 flex-shrink-0" />
                            </div>
                        </div>

                        <!-- Groups section -->
                        <div v-if="groupResults.length > 0 && (activeTab === 'all' || activeTab === 'group')">
                            <div class="sticky top-0 z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400 bg-orange-50/95 dark:bg-orange-900/40 backdrop-blur-sm border-b border-orange-100 dark:border-orange-800">
                                {{ $t('Groups') }} ({{ groupResults.length }})
                            </div>
                            <div
                                v-for="group in groupResults"
                                :key="'group-' + group.id"
                                class="group flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                                @mousedown.prevent="expandGroup(group)"
                            >
                                <div class="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <UIcon name="i-heroicons-user-group" class="h-5 w-5" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-orange-600 transition-colors">{{ group.name }}</div>
                                    <div class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <UIcon name="i-heroicons-users" class="h-3 w-3" />
                                        {{ (group.users || []).length }} {{ $t('members will be added') }}
                                    </div>
                                </div>
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <UIcon name="i-heroicons-plus-circle-20-solid" class="h-5 w-5 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
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
const activeTab = ref('all')
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

function clearAll() {
    selectedUsers.value = []
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
