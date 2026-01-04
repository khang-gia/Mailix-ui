<template>
    <UCard v-if="loading || birthdays.length > 0"
        class="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 border-pink-200 dark:border-pink-800 relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 dark:bg-pink-500/10 rounded-full -mr-16 -mt-16">
        </div>
        <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 dark:bg-purple-500/10 rounded-full -ml-12 -mb-12">
        </div>

        <!-- Confetti particles -->
        <div v-for="i in 15" :key="i" class="confetti" :style="confettiStyle(i)"></div>

        <div class="relative z-10">
            <div class="flex items-center justify-center mb-4">
                <div class="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold">
                    <UIcon name="i-heroicons-cake" class="w-6 h-6 animate-bounce" />
                    <span class="text-base">{{ t('Upcoming Birthdays') }}</span>
                </div>
                <!-- <UButton icon="i-heroicons-chevron-right" color="pink" variant="ghost" size="xs"
                    class="hover:translate-x-1 transition-transform" /> -->
            </div>

            <div v-if="loading" class="text-center py-4">
                <div class="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto">
                </div>
            </div>

            <div v-else class="text-center py-4">
                <!-- Avatar list -->
                <div class="flex justify-center items-center gap-2 mb-4">
                    <!-- First 2 avatars -->
                    <div v-for="(birthday, index) in displayedBirthdays" :key="birthday.id"
                        class="relative group/avatar cursor-pointer" @mouseenter="showConfetti = birthday.id"
                        @mouseleave="showConfetti = null">
                        <UAvatar :src="birthday.avatar" size="lg" :alt="birthday.name"
                            class="ring-2 ring-pink-300 dark:ring-pink-700 hover:ring-4 transition-all duration-300 hover:scale-110" />
                        <!-- Confetti on hover -->
                        <div v-if="showConfetti === birthday.id" class="absolute inset-0 pointer-events-none">
                            <div v-for="j in 8" :key="j" class="confetti-hover" :style="confettiHoverStyle(j)"></div>
                        </div>
                    </div>

                    <!-- Remaining count avatar with popover -->
                    <UPopover v-if="remainingCount > 0" mode="hover" :popper="{ placement: 'bottom' }">
                        <div
                            class="relative group/avatar cursor-pointer w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 ring-2 ring-pink-300 dark:ring-pink-700 hover:ring-4 transition-all duration-300 hover:scale-110 flex items-center justify-center">
                            <span class="text-white font-bold text-sm">+{{ remainingCount }}</span>
                        </div>
                        <template #panel>
                            <div class="p-2 w-64">
                                <!-- <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{{ t('Other Birthdays') }}</h4> -->
                                <div class="space-y-1 max-h-48 overflow-y-auto">
                                    <div v-for="birthday in remainingBirthdays" :key="birthday.id"
                                        class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <UAvatar :src="birthday.avatar" :alt="birthday.name" size="sm" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {{ birthday.name }}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ formatDate(birthday.date) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UPopover>
                </div>

                <!-- Birthday message -->
                <p class="text-sm text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
                    {{ t('Coming up is the birthday of') }} <br>
                    <span
                        class="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">{{
                            highlightName }}</span>
                    <span v-if="remainingCount > 0" class="block mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ t('and {count} others', { count: remainingCount }) }}
                    </span>
                </p>

                <!-- Countdown timer -->
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full mb-4 backdrop-blur-sm">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 text-pink-500" />
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {{ countdown }}
                    </span>
                </div>

                <!-- Send wishes button - Hidden for now, will implement later -->
                <!-- <UButton color="pink" variant="solid" size="sm"
                    class="w-full group/btn hover:shadow-lg transition-all duration-300" @click="sendWishes">
                    <template #leading>
                        <UIcon name="i-heroicons-gift" class="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    </template>
                    {{ t('Send Wishes') }}
                    <template #trailing>
                        <UIcon name="i-heroicons-heart"
                            class="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                    </template>
                </UButton> -->
            </div>
        </div>
    </UCard>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useAPI()

const birthdays = ref([])
const loading = ref(true)
const showConfetti = ref(null)
const currentTime = ref(new Date())

// Fetch birthdays from API
const fetchBirthdays = async () => {
    try {
        const response = await api.$get('core/profile_hrs/upcoming_birthdays')
        birthdays.value = response || []
        console.log(birthdays.value)
    } catch (error) {
        console.error('Failed to fetch birthdays:', error)
        birthdays.value = []
    } finally {
        loading.value = false
    }
}

// Display only first 2 birthdays
const displayedBirthdays = computed(() => birthdays.value.slice(0, 2))

// Remaining birthdays for popover (starting from 3rd person)
const remainingBirthdays = computed(() => birthdays.value.slice(2))

const remainingCount = computed(() => remainingBirthdays.value.length)

const highlightName = computed(() => {
    if (birthdays.value.length === 0) return ''
    return birthdays.value[0].name
})

// Countdown to next birthday
const countdown = computed(() => {
    if (birthdays.value.length === 0) return ''

    const birthdayDate = new Date(birthdays.value[0].date)
    const now = currentTime.value
    const diff = birthdayDate - now

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
        return t('{days} days {hours} hours left', { days, hours })
    } else if (hours > 0) {
        return t('{hours} hours left', { hours })
    } else {
        return t('Today!')
    }
})

// Format date for display
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Confetti animation styles
const confettiStyle = (index) => {
    const colors = ['#ec4899', '#8b5cf6', '#f472b6', '#a855f7']
    return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        backgroundColor: colors[index % colors.length]
    }
}

const confettiHoverStyle = (index) => {
    const angle = (index / 8) * 360
    return {
        transform: `rotate(${angle}deg) translateY(-40px)`,
        animationDelay: `${index * 0.05}s`
    }
}

// Update time every minute
let timeInterval
onMounted(async () => {
    await fetchBirthdays()

    timeInterval = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
})

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.6;
    animation: fall 3s linear infinite;
}

@keyframes fall {
    to {
        transform: translateY(400px) rotate(360deg);
        opacity: 0;
    }
}

.confetti-hover {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ec4899;
    top: 50%;
    left: 50%;
    animation: burst 0.6s ease-out forwards;
}

@keyframes burst {
    to {
        transform: rotate(var(--angle, 0deg)) translateY(-60px);
        opacity: 0;
    }
}
</style>
