<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Cover Photo Section -->
        <div class="relative overflow-visible">
            <div class="relative h-[460px] bg-[linear-gradient(to_bottom_right,#1e40af,#3b82f6)]" ref="coverContainer">
                <!-- Existing/Preview Cover Photo -->
                <img v-if="!previewMode && profile?.cover_photo" :src="profile.cover_photo" alt="Cover Photo"
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

                <!-- Gradient overlay at bottom -->
                <div
                    class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                </div>

                <!-- Edit Cover Photo Button (show only when not in preview mode) -->
                <UButton v-if="isOwnProfile && !previewMode" icon="i-heroicons-camera" color="white" variant="solid"
                    class="absolute bottom-4 right-4 z-10" @click="openCoverPhotoUpload">
                    {{ $t('Edit Cover Photo') }}
                </UButton>

                <!-- Confirm/Cancel Buttons (show only in preview mode) -->
                <div v-if="previewMode" class="absolute bottom-4 right-4 z-10 flex gap-2">
                    <UButton icon="i-heroicons-x-mark" color="red" variant="solid" @click="cancelCoverPhoto">
                        {{ $t('Cancel') }}
                    </UButton>
                    <UButton icon="i-heroicons-check" color="green" variant="solid" @click="confirmCoverPhoto"
                        :loading="isUploadingCoverPhoto">
                        {{ $t('Confirm') }}
                    </UButton>
                </div>
            </div>

            <!-- Profile Info - Overlapping cover -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="relative" style="margin-top: -80px;">
                    <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <!-- Profile Picture -->
                        <div class="relative flex-shrink-0">
                            <div
                                class="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-900">
                                <img :src="profile?.avatar || profile?.user?.avatar || '/images/default-user-img.png'"
                                    :alt="profile?.user?.display_name" class="w-full h-full object-cover" />
                            </div>
                            <UButton v-if="isOwnProfile" icon="i-heroicons-camera" color="gray" variant="solid"
                                size="sm" class="absolute bottom-2 right-2 rounded-full"
                                @click="openProfilePhotoUpload" />
                        </div>

                        <!-- User Info - Next to avatar -->
                        <div class="flex-1 pb-4">
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                                {{ profile?.user?.display_name }}
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                {{ profile?.post_count || 0 }} {{ $t('posts') }}
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <!-- <div class="flex gap-2 pb-4">
                            <UButton v-if="isOwnProfile" icon="i-heroicons-pencil" color="gray"
                                @click="openEditProfile">
                                {{ $t('Edit Profile') }}
                            </UButton>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs and Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <UTabs :items="tabs" class="border-b border-gray-200 dark:border-gray-700">
                    <template #item="{ item }">
                        <div class="p-6">
                            <!-- Posts Tab -->
                            <div v-if="item.key === 'posts'" class="space-y-4">
                                <SocialPostItem v-for="post in userPosts" :key="post.id" :post="post" />
                                <div v-if="userPosts.length === 0" class="text-center py-12 text-gray-500">
                                    {{ $t('No posts yet') }}
                                </div>
                            </div>

                            <!-- About Tab -->
                            <div v-else-if="item.key === 'about'" class="max-w-2xl">
                                <div class="space-y-4">
                                    <div v-if="profile?.bio" class="pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('Bio') }}
                                        </h3>
                                        <p class="text-gray-600 dark:text-gray-400">{{ profile.bio }}</p>
                                    </div>
                                    <div v-if="profile?.location">
                                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                                            <span>{{ profile.location }}</span>
                                        </div>
                                    </div>
                                    <div v-if="profile?.education">
                                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
                                            <span>{{ profile.education }}</span>
                                        </div>
                                    </div>
                                    <div v-if="profile?.website">
                                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <UIcon name="i-heroicons-link" class="w-5 h-5" />
                                            <a :href="profile.website" target="_blank"
                                                class="text-blue-600 hover:underline">
                                                {{ profile.website }}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UTabs>
            </div>
        </div>

        <!-- Hidden File Input for Cover Photo -->
        <input ref="coverPhotoInput" type="file" accept="image/*" class="hidden" @change="handleCoverPhotoSelection" />

        <!-- Hidden File Input for Avatar -->
        <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarSelection" />

        <!-- Avatar Upload Modal -->
        <UModal v-model="showAvatarModal" :ui="{ width: 'sm:max-w-md' }">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">{{ $t('Edit Profile Photo') }}</h3>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" size="sm"
                            @click="cancelAvatarUpload" />
                    </div>
                </template>

                <div class="flex justify-center p-4">
                    <div v-if="avatarPreviewMode"
                        class="relative w-80 h-80 bg-black rounded-full overflow-hidden cursor-move"
                        @mousedown="startAvatarDrag" @mousemove="onAvatarDrag" @mouseup="stopAvatarDrag"
                        @mouseleave="stopAvatarDrag">
                        <img :src="avatarPreviewUrl" alt="Avatar Preview" :style="{
                            position: 'absolute',
                            left: avatarPosition.x + 'px',
                            top: avatarPosition.y + 'px',
                            width: avatarDimensions.width + 'px',
                            height: avatarDimensions.height + 'px',
                            objectFit: 'cover',
                            userSelect: 'none'
                        }" draggable="false" />
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <UButton color="gray" variant="ghost" @click="cancelAvatarUpload" :disabled="isUploadingAvatar">
                            {{ $t('Cancel') }}
                        </UButton>
                        <UButton color="primary" @click="confirmAvatarUpload" :loading="isUploadingAvatar"
                            :disabled="!avatarPreviewMode">
                            {{ $t('Upload') }}
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup>
const route = useRoute()
const { data: userInfo } = useAuth()
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const toast = useToast()

definePageMeta({
    title: 'Social'
})
const userId = computed(() => route.params.id)
const isOwnProfile = computed(() => userInfo.value?.id === parseInt(userId.value))

// Fetch user profile
const { data: profile, refresh: refreshProfile } = await useAPI().get(`social/profiles/${userId.value}/`)

// Fetch user posts
const { data: userPosts, refresh: refreshPosts } = await useAPI().get(`social/profiles/${userId.value}/posts/`)

const tabs = computed(() => [
    { key: 'posts', label: t('Posts'), icon: 'i-heroicons-document-text' },
    { key: 'about', label: t('About'), icon: 'i-heroicons-information-circle' }
])

// Cover photo upload state
const coverPhotoInput = ref(null)
const coverContainer = ref(null)
const isUploadingCoverPhoto = ref(false)
const previewMode = ref(false)
const previewImageUrl = ref('')
const selectedFile = ref(null)
const imagePosition = ref({ x: 0, y: 0 })
const imageDimensions = ref({ width: 0, height: 0, scale: 1 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Avatar upload state
const avatarInput = ref(null)
const showAvatarModal = ref(false)
const isUploadingAvatar = ref(false)
const avatarPreviewMode = ref(false)
const avatarPreviewUrl = ref('')
const selectedAvatarFile = ref(null)
const avatarPosition = ref({ x: 0, y: 0 })
const avatarDimensions = ref({ width: 0, height: 0, scale: 1 })
const isAvatarDragging = ref(false)
const avatarDragStart = ref({ x: 0, y: 0 })

const openEditProfile = () => {
    // TODO: Open edit profile modal
    console.log('Edit profile')
}

const openCoverPhotoUpload = () => {
    // Trigger file input click
    coverPhotoInput.value?.click()
}

const handleCoverPhotoSelection = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
        toast.add({
            title: t('Error'),
            description: t('Please select an image file'),
            color: 'red'
        })
        // Reset file input
        event.target.value = ''
        return
    }

    // Store file and create preview
    selectedFile.value = file
    const imageUrl = URL.createObjectURL(file)
    previewImageUrl.value = imageUrl

    // Load image to get dimensions and center it
    const img = new Image()
    img.onload = () => {
        if (!coverContainer.value) return

        const containerWidth = coverContainer.value.offsetWidth
        const containerHeight = 460

        // Calculate scale to cover the container
        const scaleX = containerWidth / img.width
        const scaleY = containerHeight / img.height
        const scale = Math.max(scaleX, scaleY)

        // Calculate rendered dimensions
        const renderedWidth = img.width * scale
        const renderedHeight = img.height * scale

        // Store dimensions for cropping
        imageDimensions.value = {
            width: renderedWidth,
            height: renderedHeight,
            scale: scale
        }

        // Center the image
        const x = (containerWidth - renderedWidth) / 2
        const y = (containerHeight - renderedHeight) / 2

        imagePosition.value = { x, y }
        previewMode.value = true
    }
    img.src = imageUrl

    // Reset file input for future selections
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

    // Calculate new position
    const newX = event.clientX - dragStart.value.x
    const newY = event.clientY - dragStart.value.y

    // Calculate boundaries to prevent showing black background
    const containerWidth = coverContainer.value.offsetWidth
    const containerHeight = 460
    const imageWidth = imageDimensions.value.width
    const imageHeight = imageDimensions.value.height

    // Max position is 0 (image left/top edge aligned with container)
    // Min position is when image right/bottom edge aligned with container
    const minX = containerWidth - imageWidth
    const minY = containerHeight - imageHeight
    const maxX = 0
    const maxY = 0

    // Clamp position within boundaries
    imagePosition.value = {
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY))
    }
}

const stopDrag = () => {
    isDragging.value = false
}

const cancelCoverPhoto = () => {
    // Clean up
    if (previewImageUrl.value) {
        URL.revokeObjectURL(previewImageUrl.value)
    }

    // Reset state
    previewMode.value = false
    previewImageUrl.value = ''
    selectedFile.value = null
    imagePosition.value = { x: 0, y: 0 }
}

const confirmCoverPhoto = async () => {
    if (!selectedFile.value || !coverContainer.value) return

    isUploadingCoverPhoto.value = true

    try {
        // Create an image element to load the selected file
        const img = new Image()
        const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
        })

        img.src = previewImageUrl.value
        await imageLoadPromise

        // Get container dimensions (the visible crop area)
        const containerWidth = coverContainer.value.offsetWidth
        const containerHeight = 460 // Fixed height

        // Create canvas for cropping
        const canvas = document.createElement('canvas')
        canvas.width = containerWidth
        canvas.height = containerHeight
        const ctx = canvas.getContext('2d')

        // Calculate the source coordinates for cropping
        // Convert screen position to source image coordinates
        const scale = imageDimensions.value.scale
        const sourceX = -imagePosition.value.x / scale
        const sourceY = -imagePosition.value.y / scale
        const sourceWidth = containerWidth / scale
        const sourceHeight = containerHeight / scale

        // Draw the cropped portion onto the canvas
        ctx.drawImage(
            img,
            sourceX, sourceY,           // Source X, Y (what part of image to start from)
            sourceWidth, sourceHeight,  // Source width, height (how much to crop from original)
            0, 0,                        // Destination X, Y (where to draw on canvas)
            containerWidth, containerHeight  // Destination width, height (canvas size)
        )

        // Convert canvas to blob
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95)
        })

        // Create FormData with cropped image
        const formData = new FormData()
        const croppedFile = new File([blob], selectedFile.value.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
        })
        formData.append('cover_photo', croppedFile)

        const response = await useAPI().patch(`social/profiles/${userId.value}/`, formData)

        if (response.status.value === 'success') {
            toast.add({
                title: t('Success'),
                description: t('Cover photo updated successfully'),
                color: 'green'
            })

            // Refresh profile to show new cover photo
            await refreshProfile()

            // Clean up and exit preview mode
            if (previewImageUrl.value) {
                URL.revokeObjectURL(previewImageUrl.value)
            }
            previewMode.value = false
            previewImageUrl.value = ''
            selectedFile.value = null
            imagePosition.value = { x: 0, y: 0 }
        } else {
            throw new Error('Upload failed')
        }
    } catch (error) {
        console.error('Error uploading cover photo:', error)
        toast.add({
            title: t('Error'),
            description: t('Failed to upload cover photo'),
            color: 'red'
        })
    } finally {
        isUploadingCoverPhoto.value = false
    }
}

const openProfilePhotoUpload = () => {
    avatarInput.value?.click()
}

const handleAvatarSelection = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.add({
            title: t('Error'),
            description: t('Please select an image file'),
            color: 'red'
        })
        event.target.value = ''
        return
    }

    selectedAvatarFile.value = file
    const imageUrl = URL.createObjectURL(file)
    avatarPreviewUrl.value = imageUrl

    // Load image and center it in circular container
    const img = new Image()
    img.onload = () => {
        const containerSize = 320 // 80 * 4 (w-80 = 320px)

        // Calculate scale to cover the container
        const scale = Math.max(containerSize / img.width, containerSize / img.height)

        // Calculate rendered dimensions
        const renderedWidth = img.width * scale
        const renderedHeight = img.height * scale

        // Store dimensions for cropping
        avatarDimensions.value = {
            width: renderedWidth,
            height: renderedHeight,
            scale: scale
        }

        // Center the image
        avatarPosition.value = {
            x: (containerSize - renderedWidth) / 2,
            y: (containerSize - renderedHeight) / 2
        }

        avatarPreviewMode.value = true
        showAvatarModal.value = true
    }
    img.src = imageUrl

    event.target.value = ''
}

const startAvatarDrag = (event) => {
    isAvatarDragging.value = true
    avatarDragStart.value = {
        x: event.clientX - avatarPosition.value.x,
        y: event.clientY - avatarPosition.value.y
    }
}

const onAvatarDrag = (event) => {
    if (!isAvatarDragging.value) return

    event.preventDefault()

    const newX = event.clientX - avatarDragStart.value.x
    const newY = event.clientY - avatarDragStart.value.y

    // Calculate boundaries
    const containerSize = 320
    const imageWidth = avatarDimensions.value.width
    const imageHeight = avatarDimensions.value.height

    const minX = containerSize - imageWidth
    const minY = containerSize - imageHeight
    const maxX = 0
    const maxY = 0

    // Clamp position
    avatarPosition.value = {
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY))
    }
}

const stopAvatarDrag = () => {
    isAvatarDragging.value = false
}

const cancelAvatarUpload = () => {
    if (avatarPreviewUrl.value) {
        URL.revokeObjectURL(avatarPreviewUrl.value)
    }

    showAvatarModal.value = false
    avatarPreviewMode.value = false
    avatarPreviewUrl.value = ''
    selectedAvatarFile.value = null
    avatarPosition.value = { x: 0, y: 0 }
}

const confirmAvatarUpload = async () => {
    if (!selectedAvatarFile.value) return

    isUploadingAvatar.value = true

    try {
        // Create image element
        const img = new Image()
        const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
        })

        img.src = avatarPreviewUrl.value
        await imageLoadPromise

        // Create 400x400 canvas for circular crop
        const outputSize = 400
        const canvas = document.createElement('canvas')
        canvas.width = outputSize
        canvas.height = outputSize
        const ctx = canvas.getContext('2d')

        // Calculate source coordinates
        const containerSize = 320
        const scale = avatarDimensions.value.scale
        const sourceX = -avatarPosition.value.x / scale
        const sourceY = -avatarPosition.value.y / scale
        const sourceSize = containerSize / scale

        // Draw circular clipped image
        ctx.beginPath()
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(
            img,
            sourceX, sourceY,
            sourceSize, sourceSize,
            0, 0,
            outputSize, outputSize
        )

        // Convert to blob
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95)
        })

        // Upload
        const formData = new FormData()
        const croppedFile = new File([blob], selectedAvatarFile.value.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
        })
        formData.append('avatar', croppedFile)

        const response = await useAPI().patch(`social/profiles/${userId.value}/`, formData)

        if (response.status.value === 'success') {
            toast.add({
                title: t('Success'),
                description: t('Profile photo updated successfully'),
                color: 'green'
            })

            await refreshProfile()

            if (avatarPreviewUrl.value) {
                URL.revokeObjectURL(avatarPreviewUrl.value)
            }
            showAvatarModal.value = false
            avatarPreviewMode.value = false
            avatarPreviewUrl.value = ''
            selectedAvatarFile.value = null
            avatarPosition.value = { x: 0, y: 0 }
        } else {
            throw new Error('Upload failed')
        }
    } catch (error) {
        console.error('Error uploading avatar:', error)
        toast.add({
            title: t('Error'),
            description: t('Failed to upload profile photo'),
            color: 'red'
        })
    } finally {
        isUploadingAvatar.value = false
    }
}
</script>
