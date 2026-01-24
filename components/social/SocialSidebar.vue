<template>
    <div class="space-y-6">
        <!-- User Profile Summary -->
        <NuxtLink :to="`/social/wall/${user?.id}`"
            class="flex items-center gap-3 hover:opacity-80 hover:bg-gray-100 transition-opacity cursor-pointer rounded-md p-2">
            <UAvatar :src="socialAvatar" :alt="user?.display_name" size="lg" />
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white">{{ user?.display_name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.job_title || 'Thành viên' }}</p>
            </div>
        </NuxtLink>

        <!-- Navigation Menu -->
        <div class="space-y-4">
            <div v-for="item in menuItems" :key="item.label">
                <UButton :icon="item.icon" :label="item.label" variant="ghost" color="gray" block
                    class="justify-start text-base text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    :class="{ 'text-primary-500 bg-primary-50 dark:bg-primary-900/10': isActive(item) }"
                    v-if="!item.restricted" @click="item.click" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const props = defineProps({
    user: {
        type: Object,
        default: () => ({})
    },
    currentPage: {
        type: String,
        default: 'news'
    }
})
const emit = defineEmits(['update:page'])
const userRole = props.user?.profile_hr?.role

const menuItems = computed(() => [
    {
        label: t('News'),
        icon: 'i-heroicons-newspaper',
        page: 'news',
        click: () => {
            navigateTo('/social')
        }
    },
    {
        label: t('Pending posts'),
        icon: 'i-heroicons-clock',
        page: 'pending',
        restricted: userRole !== 'A',
        click: () => navigateTo('/social/pending')
    },
    {
        label: t('Company Page'),
        icon: 'i-heroicons-building-office',
        page: 'company',
        restricted: userRole !== 'A'
    },
    // { label: t('Personal Page'), icon: 'i-heroicons-user' },
    {
        label: t('Groups Social'),
        icon: 'i-heroicons-users',
        page: 'groups',
        click: () => {
            navigateTo('/social/groups')
        }
    },
    {
        label: t('Events'),
        icon: 'carbon:event',
        page: 'events',
        click: () => { console.log('Events') }
    },
    // { label: t('Progress Page'), icon: 'i-heroicons-chart-bar' },
    // { label: t('Organization Map'), icon: 'i-heroicons-user-group' },
    // { label: t('Process Page'), icon: 'i-heroicons-flag' },
])

const route = useRoute()

const isActive = (item) => {
    // For groups, check if we're on the /social/groups route
    if (item.page === 'groups') {
        return route.path.startsWith('/social/groups')
    }
    return item.page === props.currentPage
}

// Fetch social profile to get avatar
const { data: socialProfile } = await useAPI().get(`social/profiles/${props.user?.id}/`)

// Computed property for avatar with priority: social avatar -> user avatar -> default
const socialAvatar = computed(() => {
    // Priority 1: Social profile avatar
    if (socialProfile.value?.avatar) {
        return socialProfile.value.avatar
    }
    // Priority 2: User avatar (from backend which checks social then HR)
    if (props.user?.avatar) {
        return props.user.avatar
    }
    // Priority 3: Default
    return '/images/default-user-img.png'
})
</script>
