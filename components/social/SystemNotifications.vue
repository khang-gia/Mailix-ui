<template>
    <div class="space-y-6">
        <!-- System Notifications -->
        <div>
            <h3 class="text-xs font-bold text-gray-500 uppercase mb-3">Thông báo hệ thống</h3>
            <div class="space-y-4">
                <div v-for="notif in systemNotifs" :key="notif.id" class="flex gap-3">
                    <div class="mt-1">
                        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ notif.title }}</p>
                        <div class="flex items-center gap-3 text-xs text-gray-500">
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                                {{ notif.time }}
                            </span>
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-information-circle" class="w-3 h-3" />
                                Thông báo
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Company Notifications -->
        <div>
            <h3 class="text-xs font-bold text-gray-500 uppercase mb-3">Thông báo công ty</h3>
            <div class="space-y-4">
                <div v-for="notif in companyNotifs" :key="notif.id" class="flex gap-3">
                    <UAvatar :src="notif.avatar" size="sm" />
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ notif.title }}</p>
                        <div class="flex items-center gap-1 text-xs text-gray-500">
                            <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                            {{ notif.time }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const systemNotifs = [
    {
        id: 1,
        title: '[1OFFICE] THÔNG BÁO ĐỊNH KỲ CÁC TÍNH NĂNG NÂNG CẤP - THÁNG 11/2025',
        time: '17:35 25/11/2025'
    },
    {
        id: 2,
        title: '[1OFFICE] THÔNG BÁO RA MẮT TÍNH NĂNG MỚI 1AI MEETING',
        time: '22:02 09/11/2025'
    }
]

const companyNotifs = [
    {
        id: 1,
        title: 'Tập san nội bộ số 24',
        time: '09:17 18/10/2024',
        avatar: 'https://i.pravatar.cc/150?u=company'
    },
    {
        id: 2,
        title: '[THÔNG BÁO - HR] CHÀO MỪNG NHÂN VIÊN MỚI',
        time: '08:30 15/10/2024',
        avatar: 'https://i.pravatar.cc/150?u=hr'
    }
]
</script>
