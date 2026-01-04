<template>
    <UCard
        class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-200 dark:border-blue-800 relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-12 -mt-12">
        </div>

        <div v-if="!isLoading && currentWidget" class="relative z-10">
            <!-- Icon and title -->
            <div class="flex items-center gap-2 mb-3">
                <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <UIcon :name="currentWidget.icon" class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{{ currentWidget.title }}</h3>
            </div>

            <!-- Content -->
            <div class="mb-4">
                <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed italic">
                    "{{ currentWidget.content }}"
                </p>
                <p v-if="currentWidget.author" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    — {{ currentWidget.author }}
                </p>
            </div>

            <!-- Navigation dots -->
            <div class="flex items-center justify-center gap-1.5">
                <button v-for="(widget, index) in widgets" :key="index" @click="currentIndex = index" :class="[
                    'w-1.5 h-1.5 rounded-full transition-all',
                    currentIndex === index
                        ? 'bg-blue-500 w-4'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-300'
                ]"></button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-else class="relative z-10 text-center py-4">
            <div class="animate-pulse">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
        </div>
    </UCard>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentIndex = ref(0)
const quotes = ref([])
const isLoading = ref(true)

// Get quotes and mental health tips from packages
const fetchQuotes = async () => {
    try {
        // Dynamic imports to avoid SSR issues
        const { getQuote } = await import('inspirational-quotes')

        // Mental health tips from mental-support package
        const mentalHealthTips = [
            "Take regular breaks to clear your mind.",
            "Practice mindfulness or meditation.",
            "Stay connected with friends and family.",
            "Exercise regularly to boost your mood.",
            "Maintain a healthy and balanced diet.",
            "Stay hydrated by drinking plenty of water.",
            "Get enough sleep to restore your energy.",
            "Set realistic and achievable goals.",
            "Organize your workspace to reduce stress.",
            "Learn to say no to avoid overcommitment.",
            "Take deep breaths to calm yourself.",
            "Listen to music that makes you happy.",
            "Spend time in nature to relax.",
            "Pursue hobbies that you enjoy.",
            "Practice gratitude by keeping a journal.",
            "Limit your exposure to negative news.",
            "Take short walks during the day.",
            "Engage in creative activities like drawing or painting.",
            "Avoid excessive use of social media.",
            "Practice positive self-talk.",
            "Surround yourself with positive influences.",
            "Do something kind for someone else.",
            "Set aside time for relaxation.",
            "Accept that it's okay to make mistakes.",
            "Seek professional help if you need it.",
            "Celebrate small wins.",
            "Stay curious and keep learning.",
            "Keep a clean and tidy environment.",
            "Laugh often and find humor in everyday situations.",
            "Practice deep stretching or yoga."
        ]

        // Get random mental health tip
        const getRandomTip = () => mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)]

        // Get 1 random quote and 1 random tip
        const quote1 = getQuote()
        const tip1 = getRandomTip()
        console.log('quote1', quote1)
        console.log('tip1', tip1)
        quotes.value = [
            {
                type: 'quote',
                title: t('Inspirational Quote'),
                icon: 'i-heroicons-light-bulb',
                content: quote1.text,
                author: quote1.author
            },
            {
                type: 'wellness',
                title: t('Health Tip'),
                icon: 'i-heroicons-heart',
                content: tip1,
                author: null
            }
        ]
    } catch (error) {
        console.error('Failed to load quotes/tips:', error)
        // Fallback to static content if packages fail
        quotes.value = [
            {
                type: 'quote',
                title: t('Inspirational Quote'),
                icon: 'i-heroicons-light-bulb',
                content: 'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.',
                author: 'Albert Schweitzer'
            },
            {
                type: 'wellness',
                title: t('Health Tip'),
                icon: 'i-heroicons-heart',
                content: 'Take regular breaks to clear your mind and stay hydrated.',
                author: null
            }
        ]
    } finally {
        isLoading.value = false
    }
}

// Use quotes directly (now includes both quotes and wellness tips from packages)
const widgets = computed(() => {
    if (quotes.value.length === 0) return []
    return quotes.value
})

const currentWidget = computed(() => {
    if (widgets.value.length === 0) return null
    return widgets.value[currentIndex.value]
})

// Auto-rotate every 10 seconds
let rotateInterval
onMounted(async () => {
    await fetchQuotes()

    rotateInterval = setInterval(() => {
        if (widgets.value.length > 0) {
            currentIndex.value = (currentIndex.value + 1) % widgets.value.length
        }
    }, 10000)
})

onUnmounted(() => {
    if (rotateInterval) clearInterval(rotateInterval)
})
</script>
