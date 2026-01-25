<template>
    <UModal v-model="isOpen" :ui="{ width: 'max-w-md' }">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">{{ $t('Reactions') }}</h3>

                    <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <UTabs v-model="selectedTab" :items="reactionTabs" class="mb-4">
            </UTabs>

            <!-- User List -->
            <div ref="userListContainer" class="space-y-3 max-h-96 overflow-y-auto" @scroll.passive="handleScroll">
                <div v-if="loading && reactions.length === 0" class="flex justify-center py-8">
                    <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
                </div>

                <div v-else-if="filteredReactions.length === 0" class="text-center py-8 text-gray-500">
                    {{ $t('No reactions yet') }}
                </div>

                <template v-else>
                    <div v-for="reaction in filteredReactions" :key="reaction.id"
                        class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                        @click="navigateToUserProfile(reaction.user?.id)">
                        <div class="flex items-center gap-3">
                            <!-- Avatar with reaction badge -->
                            <div class="relative">
                                <UAvatar :src="reaction.user?.avatar" :alt="reaction.user?.display_name" size="md" />
                                <div
                                    class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <UIcon :name="getInteractionIcon(reaction.interaction_type)" class="w-4 h-4" />
                                </div>
                            </div>

                            <!-- User info -->
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ reaction.user?.display_name }}
                                </p>
                                <!-- <p v-if="reaction.mutual_friends_count" class="text-xs text-gray-500">
                                    {{ reaction.mutual_friends_count }} {{ $t('mutual friends') }}
                                </p> -->
                            </div>
                        </div>

                        <!-- Message button -->
                        <!-- <UButton icon="i-heroicons-chat-bubble-left" :label="$t('Message')" color="gray" variant="soft"
                            size="sm" /> -->
                    </div>

                    <!-- Loading more spinner -->
                    <div v-if="loadingMore" class="flex justify-center py-4">
                        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                </template>
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    postId: {
        type: [String, Number],
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

// Computed property to handle local v-model
const isOpen = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const selectedTab = ref(0)
const reactions = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const hasMore = ref(true)
const userListContainer = ref(null)

const interactionOptions = [
    { id: 1, label: t('Like'), icon: 'streamline-plump-color:like-1-flat' },
    { id: 2, label: t('Dislike'), icon: 'emojione-v1:broken-heart' },
    { id: 3, label: t('Heart'), icon: 'emojione-v1:red-heart' },
    { id: 4, label: t('Haha'), icon: 'twemoji:rolling-on-the-floor-laughing' },
    { id: 5, label: t('Wow'), icon: 'twemoji:star-struck' },
    { id: 6, label: t('Sad'), icon: 'twemoji:sad-but-relieved-face' },
    { id: 7, label: t('Angry'), icon: 'twemoji:angry-face' },
]

const getInteractionIcon = (type) => {
    const interaction = interactionOptions.find(i => i.id === type)
    return interaction?.icon || 'streamline:like-1'
}

// Static tabs - built once when modal opens
const reactionTabs = ref([])

const buildReactionTabs = (postInteractions) => {
    const tabs = [
        {
            label: t('All'),
            value: 'all'
        }
    ]

    // Add tabs for each reaction type that has reactions
    interactionOptions.forEach(option => {
        const count = postInteractions.filter(r => r.interaction_type === option.id).length
        if (count > 0) {
            tabs.push({
                label: count,
                icon: option.icon,
                value: option.id
            })
        }
    })

    reactionTabs.value = tabs
}

// Fetch reactions when modal opens
watch(isOpen, async (newVal) => {
    if (newVal) {
        if (props.postId) {
            currentPage.value = 1
            hasMore.value = true
            reactions.value = []
            await fetchReactions()
            // Build tabs once after initial fetch
            buildReactionTabs(reactions.value)
        }
    }
}, { immediate: true })

// Fetch reactions from API
const fetchReactions = async (interactionType = null, page = 1) => {
    try {
        const isLoadingMore = page > 1
        if (isLoadingMore) {
            loadingMore.value = true
        } else {
            loading.value = true
        }

        const currentPostId = props.postId

        const params = {
            page: page,
            page_size: 10
        }
        if (interactionType) {
            params.interaction_type = interactionType
        }

        const { data: response } = await useAPI().get(`social/posts/${currentPostId}/interactions/`, params)


        if (response.value) {
            const newReactions = response.value.results || []

            if (isLoadingMore) {
                // Append to existing reactions
                reactions.value = [...reactions.value, ...newReactions]
            } else {
                // Replace reactions
                reactions.value = newReactions
                totalCount.value = response.value.count || 0
            }

            // Check if there are more pages
            hasMore.value = !!response.value.next
            currentPage.value = page
        }
    } catch (error) {
        console.error('Error fetching reactions:', error)
        if (page === 1) {
            reactions.value = []
        }
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

// Handle scroll for infinite loading
const handleScroll = (event) => {
    console.log('handleScroll')
    const container = event.target
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Check if scrolled to bottom (with 50px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (!loadingMore.value && hasMore.value) {
            loadMoreReactions()
        }
    }
}

// Load more reactions
const loadMoreReactions = async () => {
    const tab = reactionTabs.value[selectedTab.value]
    const interactionType = tab && tab.value !== 'all' ? tab.value : null
    await fetchReactions(interactionType, currentPage.value + 1)
}

// Filter reactions based on selected tab
const filteredReactions = computed(() => {
    return reactions.value
})

// Refetch when tab changes
watch(selectedTab, async (newTabIndex) => {
    const tab = reactionTabs.value[newTabIndex]
    currentPage.value = 1
    hasMore.value = true
    reactions.value = []

    if (tab && tab.value !== 'all') {
        // Fetch reactions for specific type
        await fetchReactions(tab.value, 1)
    } else {
        // Fetch all reactions
        await fetchReactions(null, 1)
    }
})

// Navigate to user profile
const navigateToUserProfile = (userId) => {
    if (userId) {
        isOpen.value = false
        // navigateTo(`/hr/${userId}`) 
        navigateTo(`/social/wall/${userId}`)
    }
}
</script>
