<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <SocialSidebar :user="userInfo" current-page="company" />
        </div>

        <!-- Main Content (9 cols) -->
        <div class="col-span-12 lg:col-span-9">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
                <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary" />
            </div>

            <!-- Create Company Page State -->
            <div v-else-if="!companyGroup"
                class="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow min-h-[400px]">
                <UIcon name="i-heroicons-building-office-2" class="w-24 h-24 text-gray-300 dark:text-gray-600" />
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ $t('Company Page') }}
                </h2>
                <p class="text-gray-500 max-w-md">
                    {{ $t('The official company page has not been set up yet.') }}
                </p>
                <div class="space-y-4">
                    <p class="text-sm text-gray-400">
                        {{ $t('As an administrator, you can create the official company page now.') }}
                    </p>
                    <UButton :loading="creating" icon="i-heroicons-plus" :label="$t('Create Company Page')"
                        color="primary" size="lg" @click="createCompanyPage" />
                </div>
            </div>

            <!-- Company Page Content -->
            <div v-else class="space-y-6">
                <!-- Cover Photo Section -->
                <div class="relative overflow-visible group rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                    <!-- Cover Image Container -->
                    <div ref="coverContainer"
                        class="relative h-[300px] lg:h-[380px] w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
                        <!-- Existing Cover -->
                        <img v-if="!previewMode && companyGroup.cover" :src="companyGroup.cover" alt="Cover Photo"
                            class="w-full h-full object-cover" />

                        <!-- Preview Mode Overlay -->
                        <div v-if="previewMode" class="absolute inset-0 bg-black overflow-hidden cursor-move"
                            @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
                            <img :src="previewImageUrl" alt="Preview Cover Photo" :style="{
                                position: 'absolute',
                                left: imagePosition.x + 'px',
                                top: imagePosition.y + 'px',
                                width: imageDimensions.width + 'px',
                                height: imageDimensions.height + 'px',
                                objectFit: 'cover',
                                userSelect: 'none'
                            }" draggable="false" />
                        </div>

                        <!-- Edit Cover Button (only when not in preview) -->
                        <UButton v-if="isAdmin && !previewMode" icon="i-heroicons-camera" color="white" variant="solid"
                            class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            @click="$refs.coverInput.click()">
                            {{ $t('Edit Cover') }}
                        </UButton>

                        <!-- Confirm/Cancel Buttons (only in preview mode) -->
                        <div v-if="previewMode" class="absolute bottom-4 right-4 z-10 flex gap-2">
                            <UButton icon="i-heroicons-x-mark" color="red" variant="solid" @click="cancelCoverUpload">
                                {{ $t('Cancel') }}
                            </UButton>
                            <UButton icon="i-heroicons-check" color="green" variant="solid" @click="confirmCoverUpload"
                                :loading="isUploadingCover">
                                {{ $t('Confirm') }}
                            </UButton>
                        </div>

                        <input ref="coverInput" type="file" accept="image/*" class="hidden"
                            @change="handleCoverSelection" />
                    </div>

                    <!-- Profile Info - Overlapping cover -->
                    <div class="px-6 pb-6">
                        <div class="relative mb-3">
                            <div
                                class="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                                <!-- Avatar -->
                                <div class="relative flex-shrink-0 group/avatar">
                                    <div
                                        class="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
                                        <img v-if="companyGroup.avatar" :src="companyGroup.avatar"
                                            :alt="companyGroup.name" class="w-full h-full object-cover" />
                                        <UIcon v-else name="i-heroicons-building-office-2"
                                            class="w-16 h-16 text-gray-400" />
                                    </div>
                                    <UButton v-if="isAdmin" icon="i-heroicons-camera" color="gray" variant="solid"
                                        size="sm"
                                        class="absolute bottom-2 right-2 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                        @click="$refs.avatarInput.click()" />
                                    <input ref="avatarInput" type="file" accept="image/*" class="hidden"
                                        @change="handleAvatarUpload" />
                                </div>

                                <!-- Info -->
                                <div class="flex-1 min-w-0 pb-2">
                                    <div class="flex justify-between items-start">
                                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white truncate">
                                            {{ companyGroup.name }}
                                        </h1>
                                        <UButton v-if="isAdmin" icon="i-heroicons-pencil-square" color="gray"
                                            variant="soft" @click="activeTab = 'about'">
                                            {{ $t('Edit') }}
                                        </UButton>
                                    </div>
                                    <p v-if="companyGroup.slogan" class="text-gray-500 dark:text-gray-400 mt-1 italic">
                                        {{ companyGroup.slogan }}
                                    </p>
                                    <div
                                        class="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span>{{ companyGroup.posts_count || 0 }} {{ $t('posts') }}</span>
                                        <!-- <span>•</span>
                                        <span>{{ companyGroup.members_count || 0 }} {{ $t('members') }}</span> -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation Tabs -->
                        <div class="border-t border-gray-100 dark:border-gray-700 mt-4 pt-2">
                            <div class="flex overflow-x-auto gap-1">
                                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                                    class="px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                                    :class="activeTab === tab.key
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'">
                                    <div class="flex items-center gap-2">
                                        <UIcon :name="tab.icon" class="w-4 h-4" />
                                        {{ tab.label }}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab Content -->
                <div v-if="activeTab === 'all'">
                    <SocialCreatePost v-if="isAdmin" class="mb-6" @click="openCreatePostModal" />
                </div>
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 min-h-[400px]">
                    <!-- All Tab -->
                    <div v-if="activeTab === 'all'">
                        <div class="space-y-6">
                            <SocialPostItem v-for="post in posts" :key="post.id" :post="post" @postDeleted="reload++" />

                            <div v-if="posts.length === 0" class="text-center py-12">
                                <UIcon name="i-heroicons-document-text"
                                    class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <p class="text-gray-500">{{ $t('No posts yet') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- About Tab -->
                    <div v-else-if="activeTab === 'about'">
                        <div class="min-h-[500px]">
                            <div class="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                                <!-- Left Sidebar menu -->
                                <div
                                    class="md:col-span-3 border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900/50">
                                    <div class="p-4 border-b border-gray-200 dark:border-gray-700 mb-2">
                                        <h3 class="font-bold text-xl text-gray-900 dark:text-white">{{ $t('About') }}
                                        </h3>
                                    </div>
                                    <div class="p-4">
                                        <UVerticalNavigation :links="aboutMenu" :ui="{
                                            padding: ' py-3',
                                            size: 'text-base font-medium',
                                            icon: { base: 'w-5 h-5' },
                                            base: 'gap-3'
                                        }" class="space-y-2" />
                                    </div>
                                </div>

                                <!-- Right Content -->
                                <div class="md:col-span-9 p-6">
                                    <!-- Overview Section -->
                                    <div v-if="aboutSection === 'overview'" class="space-y-8">
                                        <div>
                                            <div class="flex justify-between items-start mb-4">
                                                <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{
                                                    $t('Biography') }}</h4>
                                                <!-- <UButton v-if="isAdmin" icon="i-heroicons-pencil" size="xs" color="gray"
                                                    variant="ghost" /> -->
                                            </div>

                                            <div class=" grid grid-cols-1 gap-4 w-full text-gray-600 dark:text-gray-300">
                                                
                                                <SocialCompanyDetailItem label="Slogan" icon="ph:quotes-fill"
                                                    v-model="companyGroup.slogan" :is-admin="isAdmin" type="textarea"
                                                    :placeholder="$t('Slogan')"
                                                    @save="saveCompanyInfo('slogan', $event)" />
                                                <SocialCompanyDetailItem label="Biography" icon="flat-color-icons:about"
                                                    v-model="companyGroup.biography" :is-admin="isAdmin" type="textarea"
                                                    :placeholder="$t('Biography')"
                                                    @save="saveCompanyInfo('biography', $event)" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Information (Contact) Section -->
                                    <div v-else-if="aboutSection === 'info'" class="space-y-6">
                                        <div class="flex justify-between items-start mb-6">
                                            <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('Company Information') }}</h4>

                                        </div>

                                        <div class="grid grid-cols-1 space-y-4 gap-4">
                                            <!-- Name -->
                                            <SocialCompanyDetailItem label="Name" icon="i-heroicons-building-office-2"
                                                v-model="companyGroup.name" :is-admin="isAdmin" type="text"
                                                :placeholder="$t('Name')"
                                                @save="saveCompanyInfo('name', $event)" />
                                            <!-- Address -->
                                            <SocialCompanyDetailItem label="Address" icon="i-heroicons-map-pin"
                                                v-model="companyGroup.address" :is-admin="isAdmin"
                                                :placeholder="$t('Address')"
                                                @save="(val) => saveCompanyInfo('address', val)" />

                                            <!-- Phone -->
                                            <SocialCompanyDetailItem label="Phone" icon="i-heroicons-phone"
                                                v-model="companyGroup.phone" :is-admin="isAdmin"
                                                :placeholder="$t('Phone')"
                                                @save="(val) => saveCompanyInfo('phone', val)" />

                                            <!-- Email -->
                                            <SocialCompanyDetailItem label="Email" icon="i-heroicons-envelope"
                                                v-model="companyGroup.email" :is-admin="isAdmin"
                                                :placeholder="$t('Email')"
                                                @save="(val) => saveCompanyInfo('email', val)" />

                                            <!-- Website -->
                                            <SocialCompanyDetailItem label="Website" icon="i-heroicons-globe-alt"
                                                v-model="companyGroup.website" :is-admin="isAdmin"
                                                :placeholder="$t('Website')"
                                                @save="(val) => saveCompanyInfo('website', val)" />

                                            <!-- Established -->
                                            <SocialCompanyDetailItem label="Established date"
                                                icon="i-heroicons-calendar" v-model="companyGroup.established_date"
                                                :is-admin="isAdmin" type="date"
                                                @save="(val) => saveCompanyInfo('established_date', val)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Members Tab -->
                    <div v-else-if="activeTab === 'members'">
                        <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-4">{{ $t('Members') }}</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="member in members" :key="member.id"
                                class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                                @click="navigateTo(`/social/wall/${member.user.id}`)">
                                <UAvatar :src="member.user.avatar" :alt="member.user.display_name" />
                                <div>
                                    <p class="font-medium text-sm">{{ member.user.display_name }}</p>
                                    <p class="text-xs text-gray-500">{{ member.role === 1 ? 'Admin' : 'Member' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalCreatePost @postCreated="reload++" />
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Company Page',
    layout: 'default'
})
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modal'

const { t } = useI18n()
const router = useRouter()
const { data: userInfo } = useAuth()
const modalStore = useModalStore()
const { setSocialCreatePostModal } = modalStore
const toast = useToast()
const api = useAPI()

const loading = ref(true)
const creating = ref(false)
const companyGroup = ref(null)
const activeTab = ref('all')
const reload = ref(0)
const coverContainer = ref(null)
const previewMode = ref(false)
const previewImageUrl = ref('')
const selectedFile = ref(null)
const imagePosition = ref({ x: 0, y: 0 })
const imageDimensions = ref({ width: 0, height: 0, scale: 1 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isUploadingCover = ref(false)
const aboutSection = ref('overview')

// User permissions
const isAdmin = computed(() => {
    if (!companyGroup.value || !userInfo.value) return false

    // Check if user is the creator
    if (companyGroup.value.creator && companyGroup.value.creator.id === userInfo.value.id) return true

    // Check if user is an admin member (role === 1)
    // We need to check the members list which is loaded async
    if (members.value && members.value.length > 0) {
        const member = members.value.find(m => m.user.id === userInfo.value.id)
        if (member && member.role === 1) return true
    }

    return false
})

const saveCompanyInfo = async (field, value) => {
    if (!companyGroup.value) return

    try {
        const payload = { [field]: value }
        const { error } = await api.patch(`social/groups/${companyGroup.value.id}/`, payload)

        if (error.value) throw error.value

        toast.add({ title: t('Success'), description: t('Information updated'), color: 'green' })
    } catch (e) {
        console.error('Error updating company info:', e)
        toast.add({ title: t('Error'), description: t('Failed to update information'), color: 'red' })
        // Revert change in local state if possible, or just warn
        // Since v-model updated it, we might want to fetch again to revert, but that's expensive.
        // For now, alert is enough.
    }
}

const tabs = computed(() => [
    { key: 'all', label: t('All'), icon: 'i-heroicons-rss' },
    { key: 'about', label: t('About'), icon: 'i-heroicons-information-circle' },
    { key: 'members', label: t('Members'), icon: 'i-heroicons-users' }
])

const aboutMenu = computed(() => [
    {
        label: t('Overview'),
        icon: 'i-heroicons-document-text',
        click: () => aboutSection.value = 'overview',
        active: aboutSection.value === 'overview'
    },
    {
        label: t('Information'),
        icon: 'i-heroicons-information-circle',
        click: () => aboutSection.value = 'info',
        active: aboutSection.value === 'info'
    }
])

const fetchCompanyPage = async () => {
    loading.value = true
    try {
        const data = await api.$get('social/groups/', {
            is_company: true,
            page_size: 1
        })

        if (data && data.results && data.results.length > 0) {
            companyGroup.value = data.results[0]
        } else {
            companyGroup.value = null
        }
    } catch (error) {
        console.error('Error fetching company page:', error)
    } finally {
        loading.value = false
    }
}

// Fetch posts
const posts = computedAsync(async () => {
    const _ = reload.value
    if (!companyGroup.value) return []
    const { data } = await api.get(`social/groups/${companyGroup.value.id}/posts/`)
    return data.value || []
})

// Fetch members
const members = computedAsync(async () => {
    const _ = reload.value
    if (!companyGroup.value) return []
    const { data } = await api.get(`social/groups/${companyGroup.value.id}/members/`)
    return data.value || []
})


const createCompanyPage = async () => {
    if (creating.value) return
    creating.value = true

    try {
        const { data, error } = await api.post('social/groups/', {
            name: `${userInfo.value?.profile_hr?.company_name || 'My Company'}`,
            description: t('Official internal communication channel.'),
            is_public: false,
            is_company: true
        })

        if (error.value) throw error.value

        if (data.value) {
            toast.add({ title: t('Success'), description: t('Company page created successfully'), color: 'green' })
            companyGroup.value = data.value
            reload.value++
        }
    } catch (err) {
        console.error('Error creating company page:', err)
        toast.add({ title: t('Error'), description: t('Failed to create company page'), color: 'red' })
    } finally {
        creating.value = false
    }
}

const openCreatePostModal = () => {
    if (companyGroup.value) {
        setSocialCreatePostModal(true, 1, companyGroup.value.id)
    }
}

const handleCoverSelection = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.add({ title: t('Error'), description: t('Please select an image file'), color: 'red' })
        return
    }

    selectedFile.value = file
    const imageUrl = URL.createObjectURL(file)
    previewImageUrl.value = imageUrl

    const img = new Image()
    img.onload = () => {
        if (!coverContainer.value) return

        const containerWidth = coverContainer.value.offsetWidth
        const containerHeight = coverContainer.value.offsetHeight

        const scaleX = containerWidth / img.width
        const scaleY = containerHeight / img.height
        const scale = Math.max(scaleX, scaleY)

        const renderedWidth = img.width * scale
        const renderedHeight = img.height * scale

        imageDimensions.value = {
            width: renderedWidth,
            height: renderedHeight,
            scale: scale
        }

        // Center by default
        imagePosition.value = {
            x: (containerWidth - renderedWidth) / 2,
            y: (containerHeight - renderedHeight) / 2
        }

        previewMode.value = true
    }
    img.src = imageUrl
    event.target.value = ''
}

const startDrag = (event) => {
    isDragging.value = true
    dragStart.value = {
        x: event.clientX - imagePosition.value.x,
        y: event.clientY - imagePosition.value.y
    }
}

const onDrag = (event) => {
    if (!isDragging.value || !coverContainer.value) return
    event.preventDefault()

    const newX = event.clientX - dragStart.value.x
    const newY = event.clientY - dragStart.value.y

    const containerWidth = coverContainer.value.offsetWidth
    const containerHeight = coverContainer.value.offsetHeight
    const imageWidth = imageDimensions.value.width
    const imageHeight = imageDimensions.value.height

    const minX = containerWidth - imageWidth
    const minY = containerHeight - imageHeight
    const maxX = 0
    const maxY = 0

    imagePosition.value = {
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY))
    }
}

const stopDrag = () => {
    isDragging.value = false
}

const cancelCoverUpload = () => {
    if (previewImageUrl.value) URL.revokeObjectURL(previewImageUrl.value)
    previewMode.value = false
    previewImageUrl.value = ''
    selectedFile.value = null
}

const confirmCoverUpload = async () => {
    if (!selectedFile.value || !coverContainer.value) return
    isUploadingCover.value = true

    try {
        const img = new Image()
        await new Promise((resolve) => {
            img.onload = resolve
            img.src = previewImageUrl.value
        })

        const containerWidth = coverContainer.value.offsetWidth
        const containerHeight = coverContainer.value.offsetHeight

        const canvas = document.createElement('canvas')
        canvas.width = containerWidth
        canvas.height = containerHeight
        const ctx = canvas.getContext('2d')

        const scale = imageDimensions.value.scale
        const sourceX = -imagePosition.value.x / scale
        const sourceY = -imagePosition.value.y / scale
        const sourceWidth = containerWidth / scale
        const sourceHeight = containerHeight / scale

        ctx.drawImage(
            img,
            sourceX, sourceY,
            sourceWidth, sourceHeight,
            0, 0,
            containerWidth, containerHeight
        )

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
        const formData = new FormData()
        formData.append('cover', new File([blob], selectedFile.value.name, { type: 'image/jpeg' }))

        const { data, error } = await api.patch(`social/groups/${companyGroup.value.id}/`, formData)

        if (error.value) throw error.value

        toast.add({ title: t('Success'), description: t('Cover updated'), color: 'green' })

        if (data.value) {
            companyGroup.value = data.value
        }

        cancelCoverUpload()
    } catch (e) {
        console.error(e)
        toast.add({ title: t('Error'), description: t('Failed to update cover'), color: 'red' })
    } finally {
        isUploadingCover.value = false
    }
}

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file || !companyGroup.value) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
        const { data, error } = await api.patch(`social/groups/${companyGroup.value.id}/`, formData)

        if (error.value) throw error.value

        toast.add({ title: t('Success'), description: t('Logo updated'), color: 'green' })
        if (data.value) {
            // Force avatar refresh using a timestamp or similar if needed, but data.value usually works
            companyGroup.value = data.value
        }
    } catch (e) {
        toast.add({ title: t('Error'), description: t('Failed to update logo'), color: 'red' })
    }
}

onMounted(() => {
    fetchCompanyPage()
})
</script>
