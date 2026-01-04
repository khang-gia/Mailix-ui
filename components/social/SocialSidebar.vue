<template>
    <div class="space-y-6">
        <!-- User Profile Summary -->
        <div class="flex items-center gap-3">
            <UAvatar :src="user?.avatar" :alt="user?.display_name" size="lg" />
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white">{{ user?.display_name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.job_title || 'Thành viên' }}</p>
            </div>
        </div>

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
            emit('update:page', 'news')
        }
    },
    {
        label: t('Pending posts'),
        icon: 'i-heroicons-clock',
        page: 'pending',
        restricted: userRole !== 'A'
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
            emit('update:page', 'groups')
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

const isActive = (item) => {
    return item.page === props.currentPage
}
</script>
