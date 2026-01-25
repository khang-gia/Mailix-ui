<template>
    <UModal v-model="isOpen" :ui="{ width: 'max-w-lg' }">
        <UCard class="font-averta">
            <template #header>
                <div class="flex items-center gap-3">
                    <!-- <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="lg" class="-my-1"
                        @click="isOpen = false" /> -->
                    <h3 class="text-lg font-semibold">{{ $t('Poll details') }}</h3>
                    <div class="flex-1"></div>
                    <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="lg" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <!-- Poll Options List -->
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="(option, index) in localPollOptions" :key="option.id" class="bg-white dark:bg-gray-800">
                    <!-- Option Header (Clickable to expand/collapse) -->
                    <div class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        @click="toggleOption(index)">
                        <div class="flex-1">
                            <p class="font-semibold text-gray-900 dark:text-white">
                                {{ option.option }} ({{ option.votes_count || 0 }})
                            </p>
                        </div>
                        <UIcon :name="expandedOptions[index] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                            class="w-5 h-5 text-gray-500" />
                    </div>

                    <!-- Voters List (Expandable) -->
                    <div v-if="expandedOptions[index]" class="px-4 pb-4">
                        <!-- Grid layout for 2 columns -->
                        <div class="grid grid-cols-2 gap-2">
                            <div v-for="(voter, voterIndex) in getVisibleVoters(option, index)" :key="voter.id"
                                class="flex items-center gap-2 py-2 rounded-lg cursor-pointer"
                                @click="navigateToUserProfile(voter.user?.id)">
                                <UAvatar :src="voter.user?.avatar" :alt="voter.user?.display_name" size="md" />
                                <p class="text-sm font-normal text-gray-900 dark:text-white truncate">
                                    {{ voter.user?.display_name }}
                                </p>
                            </div>
                        </div>

                        <!-- See More Button -->
                        <UButton v-if="option.votes_count > 6 && !showAllVoters[index]" :label="$t('See more')"
                            variant="ghost" color="gray" block class="mt-2" @click.stop="showAllVoters[index] = true" />
                    </div>
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n"
// import { useModalStore } from '@/stores/modal'
// import { storeToRefs } from 'pinia'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    postId: {
        type: [String, Number],
        default: null
    },
    pollOptions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
// const modalStore = useModalStore()
// const { pollVotersModal, pollVotersData } = storeToRefs(modalStore)

const expandedOptions = ref([])
const showAllVoters = ref([])
const localPollOptions = ref([])

// Computed property to handle local v-model
const isOpen = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

// Watch for modal open to initialize data
watch(isOpen, async (newVal) => {
    if (newVal) {
        // Use props instead of store data
        // Initialize with passed pollOptions if available, but fetch fresh data
        if (props.pollOptions && props.pollOptions.length > 0) {
            localPollOptions.value = props.pollOptions
        }

        // Initialize UI state
        expandedOptions.value = (localPollOptions.value || []).map(() => true)
        showAllVoters.value = (localPollOptions.value || []).map(() => false)

        // Fetch detailed voter data for each option
        if (props.postId) {
            await fetchVotersForAllOptions()
        }
    }
}, { immediate: true })

// Fetch voters for all poll options
const fetchVotersForAllOptions = async () => {
    const postId = props.postId
    if (!postId) return

    try {
        // Fetch poll options with votes from voters endpoint
        const { data: response } = await useAPI().get(`social/posts/${postId}/voters/`)
        console.log(response.value)
        if (response.value) {
            localPollOptions.value = response.value
            // Re-initialize UI state to match new data length if needed
            if (expandedOptions.value.length !== localPollOptions.value.length) {
                expandedOptions.value = localPollOptions.value.map(() => true)
                showAllVoters.value = localPollOptions.value.map(() => false)
            }
        }
    } catch (error) {
        console.error('Error fetching poll voters:', error)
    }
}

// Toggle option expansion
const toggleOption = (index) => {
    expandedOptions.value[index] = !expandedOptions.value[index]
}

// Get visible voters (first 6 or all if expanded)
const getVisibleVoters = (option, index) => {
    if (!option.poll_votes) return []

    if (showAllVoters.value[index]) {
        return option.poll_votes
    }

    return option.poll_votes.slice(0, 6)
}

// Navigate to user profile
const navigateToUserProfile = (userId) => {
    if (userId) {
        isOpen.value = false
        navigateTo(`/social/wall/${userId}`)
    }
}
</script>
