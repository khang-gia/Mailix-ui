<template>
    <div class="space-y-6">
        <!-- Header with Create Group Button -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Groups') }}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('Connect with teams and participate in company discussions') }}</p>
            </div>
            <UButton icon="i-heroicons-plus" :label="t('Create Group')" color="primary" size="lg"
                @click="showCreateGroupModal = true" />
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]">
                    <div class="flex items-center gap-2">
                        <UIcon :name="tab.icon" class="w-5 h-5" />
                        <span>{{ tab.label }}</span>
                        <span v-if="tab.count"
                            class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                            {{ tab.count }}
                        </span>
                    </div>
                </button>
            </nav>
        </div>

        <!-- Your Groups Tab -->
        <div v-if="activeTab === 'your-groups'" class="space-y-4">
            <!-- Search and Filter -->
            <div class="flex gap-4">
                <div class="flex-1">
                    <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass"
                        :placeholder="t('Search your groups...')" size="lg" />
                </div>
                <USelectMenu v-model="sortBy" :options="sortOptions" value-attribute="value" option-attribute="label"
                    size="lg" class="w-48">
                    <template #label>
                        <UIcon name="i-heroicons-arrows-up-down" class="w-4 h-4 mr-2" />
                        {{sortOptions.find(opt => opt.value === sortBy)?.label || t('Default')}}
                    </template>
                </USelectMenu>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 3" :key="i"
                    class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div class="h-32 bg-gray-200 dark:bg-gray-700"></div>
                    <div class="p-4 space-y-3">
                        <div class="flex items-start gap-3">
                            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Groups Grid -->
            <div v-else-if="yourGroups.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="group in yourGroups" :key="group.id"
                    class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                    @click="navigateToGroup(group.id)">
                    <!-- Cover Image -->
                    <div class="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
                        <img v-if="group.cover" :src="group.cover" :alt="group.name"
                            class="w-full h-full object-cover" />
                        <div class="absolute top-2 right-2">
                            <span :class="[
                                'px-2 py-1 text-xs font-medium rounded-full',
                                group.is_public
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            ]">
                                <UIcon :name="group.is_public ? 'i-heroicons-globe-alt' : 'i-heroicons-lock-closed'"
                                    class="w-3 h-3 inline mr-1" />
                                {{ group.is_public ? t('Public') : t('Private') }}
                            </span>
                        </div>
                    </div>

                    <!-- Group Info -->
                    <div class="p-4">
                        <div class="flex items-start gap-3">
                            <!-- Group Avatar -->
                            <div class="flex-shrink-0">
                                <UAvatar :src="group.avatar" :alt="group.name" size="lg"
                                    class="ring-2 ring-white dark:ring-gray-800" />
                            </div>

                            <!-- Group Details -->
                            <div class="flex-1 min-w-0">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {{ group.name }}
                                </h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1"
                                    v-html="group.description">
                                </p>

                                <!-- Group Stats -->
                                <div class="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    <div class="flex items-center gap-1">
                                        <UIcon name="i-heroicons-users" class="w-4 h-4" />
                                        <span>{{ group.members_count }} {{ t('members') }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                                        <span>{{ group.posts_count }} {{ t('posts') }}</span>
                                    </div>
                                </div>

                                <!-- Your Role Badge -->
                                <div class="mt-2">
                                    <span :class="[
                                        'inline-flex items-center px-2 py-1 text-xs font-medium rounded',
                                        group.your_role === 'Admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    ]">
                                        {{ group.your_role }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="yourGroups.length === 0" class="text-center py-12">
                <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('No groups yet') }}</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('Join or create a group to get started') }}</p>
                <UButton icon="i-heroicons-plus" :label="t('Create Your First Group')" color="primary"
                    @click="showCreateGroupModal = true" />
            </div>
        </div>

        <!-- Discover Groups Tab -->
        <div v-if="activeTab === 'discover'" class="space-y-4">
            <!-- Search -->
            <UInput v-model="discoverSearchQuery" icon="i-heroicons-magnifying-glass"
                :placeholder="t('Search groups...')" size="lg" />

            <!-- Suggested Groups -->
            <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('Suggested for you') }}</h2>

                <!-- Loading State -->
                <div v-if="discoverLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="i in 6" :key="i"
                        class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div class="h-24 bg-gray-200 dark:bg-gray-700"></div>
                        <div class="p-4 space-y-3">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full -mt-8"></div>
                                <div class="flex-1 space-y-2 mt-1">
                                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Groups Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="group in suggestedGroups" :key="group.id"
                        class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                        <!-- Cover Image -->
                        <div class="relative h-24 bg-gradient-to-r from-indigo-500 to-pink-500">
                            <img v-if="group.cover" :src="group.cover" :alt="group.name"
                                class="w-full h-full object-cover" />
                        </div>

                        <!-- Group Info -->
                        <div class="p-4">
                            <div class="flex items-start gap-3 mb-3">
                                <UAvatar :src="group.avatar" :alt="group.name" size="md"
                                    class="ring-2 ring-white dark:ring-gray-800 -mt-8" />
                                <div class="flex-1 min-w-0 mt-1">
                                    <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                                        {{ group.name }}
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ group.members_count }} {{ t('members') }}
                                    </p>
                                </div>
                            </div>

                            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3"
                                v-html="group.description">
                            </p>

                            <UButton :label="t('Join Group')" color="primary" block size="sm"
                                @click="joinGroup(group.id)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Group Modal -->
        <UModal v-model="showCreateGroupModal" :ui="{ width: 'sm:max-w-2xl' }">
            <UCard class="font-averta">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('Create New Group') }}</h2>
                        <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost"
                            @click="showCreateGroupModal = false" />
                    </div>
                </template>

                <form @submit.prevent="handleCreateGroup" class="space-y-6">
                    <!-- Group Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('Group Name') }} <span class="text-red-500">*</span>
                        </label>
                        <UInput v-model="newGroup.name" :placeholder="t('Enter group name...')" size="lg" required />
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('Description') }} <span class="text-red-500">*</span>
                        </label>
                        <RickTextEditor v-model="newGroup.description" :placeholder="t('Describe your group...')" />
                    </div>

                    <!-- Privacy Setting -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('Privacy') }}
                        </label>
                        <div class="flex items-center gap-4">
                            <URadio v-model="newGroup.is_public" :value="true" :label="t('Public')"
                                help="Anyone can see and join this group" />
                            <URadio v-model="newGroup.is_public" :value="false" :label="t('Private')"
                                help="Only members can see group content" />
                        </div>
                    </div>

                    <!-- Avatar Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('Group Avatar') }}
                        </label>
                        <div class="flex items-center gap-4">
                            <div v-if="avatarPreview" class="relative">
                                <img :src="avatarPreview" alt="Avatar preview"
                                    class="w-20 h-20 rounded-full object-cover" />
                                <UButton icon="i-heroicons-x-mark" size="xs" color="red"
                                    class="absolute -top-2 -right-2" @click="removeAvatar" />
                            </div>
                            <UButton icon="i-heroicons-photo"
                                :label="avatarPreview ? t('Change Avatar') : t('Upload Avatar')" color="gray"
                                variant="outline" @click="$refs.avatarInput.click()" />
                            <input ref="avatarInput" type="file" accept="image/*" class="hidden"
                                @change="handleAvatarUpload" />
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ $t('Recommended: Square image, at least 200x200px') }}</p>
                    </div>

                    <!-- Cover Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('Cover Image') }}
                        </label>
                        <div class="space-y-3">
                            <div v-if="coverPreview" class="relative">
                                <img :src="coverPreview" alt="Cover preview"
                                    class="w-full h-32 rounded-lg object-cover" />
                                <UButton icon="i-heroicons-x-mark" size="xs" color="red" class="absolute top-2 right-2"
                                    @click="removeCover" />
                            </div>
                            <UButton icon="i-heroicons-photo"
                                :label="coverPreview ? t('Change Cover') : t('Upload Cover')" color="gray"
                                variant="outline" block @click="$refs.coverInput.click()" />
                            <input ref="coverInput" type="file" accept="image/*" class="hidden"
                                @change="handleCoverUpload" />
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ t('Recommended: 800x200px or wider')
                            }}</p>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <UButton :label="t('Cancel')" color="gray" variant="ghost"
                            @click="showCreateGroupModal = false" />
                        <UButton type="submit" :label="t('Create Group')" color="primary" :loading="creatingGroup"
                            :disabled="!newGroup.name || !newGroup.description" />
                    </div>
                </form>
            </UCard>
        </UModal>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useAPI()
const { data: userInfo } = useAuth()

const activeTab = ref('your-groups')
const searchQuery = ref('')
const discoverSearchQuery = ref('')
const sortBy = ref('default')
const showCreateGroupModal = ref(false)

// Loading and error states
const loading = ref(false)
const discoverLoading = ref(false)
const error = ref(null)
const creatingGroup = ref(false)

// New group form data
const newGroup = ref({
    name: '',
    description: '',
    is_public: true,
    avatar: null,
    cover: null
})

// Image previews
const avatarPreview = ref(null)
const coverPreview = ref(null)

const tabs = computed(() => [
    { id: 'your-groups', label: t('Your Groups'), icon: 'i-heroicons-user-group', count: yourGroups.value.length },
    { id: 'discover', label: t('Discover'), icon: 'i-heroicons-magnifying-glass' },
])

const sortOptions = computed(() => [
    { label: t('Default'), value: 'default' },
    { label: t('Latest Join'), value: 'latest_join' },
    { label: t('Earliest Join'), value: 'earliest_join' },
])

// Your groups - groups where the user is a member (using computedAsync for reactivity)
const yourGroups = computedAsync(async () => {
    // Determine ordering based on sort option
    let ordering = '-membership_date' // Default: Latest join first
    if (sortBy.value === 'latest_join') {
        ordering = '-membership_date'
    } else if (sortBy.value === 'earliest_join') {
        ordering = 'membership_date'
    }

    // Build params object
    const params = {
        my_groups: true,
        ordering: ordering
    }

    // Add search query if present
    if (searchQuery.value && searchQuery.value.trim()) {
        params.search = searchQuery.value.trim()
    }

    try {
        const response = await api.$get('social/groups/', params)
        return response.results || response || []
    } catch (err) {
        console.error('Failed to fetch your groups:', err)
        return []
    }
}, [])

// Suggested groups - groups where the user is NOT a member (using computedAsync for reactivity)
const suggestedGroups = computedAsync(async () => {
    // Build params object
    const params = {
        is_public: true,
        ordering: '-members_count', // Most popular first
        page_size: 20
    }

    // Add search query if present
    if (discoverSearchQuery.value && discoverSearchQuery.value.trim()) {
        params.search = discoverSearchQuery.value.trim()
    }

    try {
        const response = await api.$get('social/groups/', params)
        const allGroups = response.results || response || []

        // Filter out groups where user is already a member (your_role will be null for non-members)
        return allGroups.filter(group => !group.your_role)
    } catch (err) {
        console.error('Failed to fetch suggested groups:', err)
        return []
    }
}, [])




// Navigate to group detail page
const navigateToGroup = (groupId) => {
    navigateTo(`/social/groups/${groupId}`)
}

// Join a group
const joinGroup = async (groupId) => {
    try {
        await api.$post(`social/groups/${groupId}/join/`)

        // computedAsync will automatically refresh both lists

        // Show success message
        console.log('Successfully joined group')
    } catch (err) {
        console.error('Failed to join group:', err)
        // TODO: Show error toast
    }
}

// Handle avatar upload
const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        newGroup.value.avatar = file
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Handle cover upload
const handleCoverUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        newGroup.value.cover = file
        const reader = new FileReader()
        reader.onload = (e) => {
            coverPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Remove avatar
const removeAvatar = () => {
    newGroup.value.avatar = null
    avatarPreview.value = null
}

// Remove cover
const removeCover = () => {
    newGroup.value.cover = null
    coverPreview.value = null
}

// Reset form
const resetForm = () => {
    newGroup.value = {
        name: '',
        description: '',
        is_public: true,
        avatar: null,
        cover: null
    }
    avatarPreview.value = null
    coverPreview.value = null
}

// Handle create group
const handleCreateGroup = async () => {
    creatingGroup.value = true
    try {
        const formData = new FormData()
        formData.append('name', newGroup.value.name)
        formData.append('description', newGroup.value.description)
        formData.append('is_public', newGroup.value.is_public)

        if (newGroup.value.avatar) {
            formData.append('avatar', newGroup.value.avatar)
        }

        if (newGroup.value.cover) {
            formData.append('cover', newGroup.value.cover)
        }

        await api.$post('social/groups/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        showCreateGroupModal.value = false
        resetForm()
        // computedAsync will automatically refresh yourGroups

        console.log('Group created successfully')
    } catch (err) {
        console.error('Failed to create group:', err)
    } finally {
        creatingGroup.value = false
    }
}


</script>
