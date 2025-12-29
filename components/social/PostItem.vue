<template>
    <UCard :ui="{ body: { padding: 'p-4' } }">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
            <div class="flex gap-3">
                <UAvatar :src="post.author.avatar" :alt="post.author.display_name" />
                <div>
                    <div class="flex items-center gap-1">
                        <span class="font-bold text-gray-900 dark:text-white">{{ post.author.display_name }}</span>
                        <span v-if="post.social_group" class="text-gray-500 text-sm">đã chia sẻ trên</span>
                        <span v-if="post.social_group"
                            class="text-green-500 font-medium cursor-pointer hover:underline">{{ post.social_group.name
                            }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <span>{{ formatDate(post.created_at) }}</span>
                        <span>•</span>
                        <UIcon :name="privacyIcons[post.privacy]" class="w-3 h-3" />
                        <!-- <span>Đọc bài viết</span> -->
                    </div>
                </div>
            </div>
            <!-- <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" size="sm" /> -->
            <UDropdown :items="editPostDropdownItems" :popper="{ placement: 'bottom-end' }">
                <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-ellipsis-horizontal" />
                <!-- <template #item="{ item }">
                    <span class="truncate" :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }">{{
                        item.label }}
                    </span>
                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                        :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }" />
                </template> -->
            </UDropdown>
        </div>

        <!-- Content -->
        <div class="mb-4">
            <h3 class="text-lg font-bold mb-3">{{ post.title }}</h3>
            <!-- <p class="text-gray-700 dark:text-gray-300 mb-3">{{ post.content }}</p> -->
            <div class="mb-3 break-words overflow-wrap-anywhere" v-html="post.content"></div>

            <img v-if="post.image" :src="post.image" class="w-full rounded-lg mb-3 object-cover max-h-96" />

            <!-- Poll -->
            <div v-if="post.post_type === 2 && post.poll_options" class="space-y-2">
                <div v-for="option in post.poll_options" :key="option.id"
                    class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    @click="!isPollEnded && handleVote(option.id)">
                    <div class="flex items-center gap-3">
                        <UCheckbox :model-value="option.poll_vote_users?.includes(userInfo.id)" color="green"
                            :disabled="isPollEnded" @click.stop />
                        <span class="font-medium">{{ option.option }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <UProgress :value="calculatePercent(option.votes_count, post.poll_options)" color="green"
                            class="w-24" />
                        <span class="text-xs text-gray-500">{{ option.votes_count }} {{ $t('votes') }}</span>
                    </div>
                </div>
                <p v-if="!isPollEnded" class="text-xs text-gray-500 mt-2">{{ $t('This poll will end on') }} {{
                    formatDate(post.end_poll) }}</p>
                <UAlert v-else icon="pajamas:expire" color="yellow" variant="solid"
                    :title="$t('This poll has ended. You can no longer vote.')">
                </UAlert>
            </div>
        </div>
        <!-- Reactions Count & Comments Count -->
        <div class="flex items-center justify-between pb-1">
            <div v-if="post.top_interaction_types && post.top_interaction_types.length > 0"
                class="flex items-center gap-1">
                <!-- Display top 3 interaction types with icons -->
                <div class="flex items-center -space-x-1">
                    <div v-for="interaction in post.top_interaction_types.slice(0, 3)"
                        :key="interaction.interaction_type"
                        class="w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <UIcon :name="getInteractionIcon(interaction.interaction_type)" class="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div v-else></div>
            <div v-if="post.comments_count" class="text-sm text-gray-500 cursor-pointer hover:underline"
                @click="setSocialCommentModal(true, post)">
                {{ post.comments_count }} {{ $t('comments') }}
            </div>
        </div>
        <!-- Actions -->
        <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 gap-2">
            <div class="w-full">
                <!-- <UButton icon="i-heroicons-hand-thumb-up" :label="$t('Like')" color="gray" variant="ghost" block="true" @click="interactPost(1)" /> -->
                <UPopover :popper="{ placement: 'top' }" mode="hover">
                    <UButton
                        :icon="post.your_interaction ? getInteractionIcon(post.your_interaction) : 'streamline:like-1'"
                        :label="post.your_interaction ? getInteractionLabel(post.your_interaction) : $t('Like')"
                        :class="post.your_interaction ? getInteractionTextColor(post.your_interaction) : ''"
                        color="gray" variant="ghost" block @click="interactPost(post.your_interaction ? 0 : 1)" />

                    <template #panel>
                        <div class="p-2 flex gap-2">
                            <UButton v-for="interaction in interactionOptions" :key="interaction.id"
                                :icon="interaction.icon" :title="interaction.label" color="gray" variant="ghost"
                                size="sm" @click="interactPost(interaction.id)" />
                            <!-- <UButton v-if="post.your_interaction" icon="i-heroicons-x-mark" title="Remove interaction"
                                color="gray" variant="ghost" size="sm" @click="interactPost(0)" /> -->
                        </div>
                    </template>
                </UPopover>
            </div>
            <div class="w-full">
                <UButton icon="i-heroicons-chat-bubble-left" :label="$t('Comment')" color="gray" variant="ghost"
                    block="true" @click="setSocialCommentModal(true, post)" />
            </div>
            <!-- <div class="w-full">
                <UButton icon="i-heroicons-arrow-uturn-up" label="Chia sẻ" color="gray" variant="ghost" block="true"/>
            </div> -->
        </div>
        <div v-if="openPostModal" class="pt-2">
            <CommentsSection comment-type="social" :id="post.id" placeholder="Write a comment..."
                @onAddComment="post.comments_count++" />
        </div>
    </UCard>

</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const modalStore = useModalStore()
const { setSocialCommentModal, setAlertModal } = modalStore
const props = defineProps({
    post: {
        type: Object,
        required: true
    },
    openPostModal: {
        type: Boolean,
        default: false
    }
})
const { t } = useI18n()
const { data: userInfo } = useAuth()
const dayjs = useDayjs()
const formatDate = (date) => {
    if (!date) return ''
    return dayjs(date).format('HH:mm DD/MM/YYYY')
}
const privacyIcons = {
    1: 'i-heroicons-globe-alt', // Public
    2: 'i-heroicons-users', // Friends
    3: 'i-heroicons-lock-closed', // Only me
}
const interactionOptions = ref([
    { id: 1, label: t('Like'), icon: 'streamline-plump-color:like-1-flat' },
    { id: 2, label: t('Dislike'), icon: 'emojione-v1:broken-heart' },
    { id: 3, label: t('Heart'), icon: 'emojione-v1:red-heart' },
    { id: 4, label: t('Haha'), icon: 'twemoji:rolling-on-the-floor-laughing' },
    { id: 5, label: t('Wow'), icon: 'twemoji:star-struck' },
    { id: 6, label: t('Sad'), icon: 'twemoji:sad-but-relieved-face' },
    { id: 7, label: t('Angry'), icon: 'twemoji:angry-face' },
]);

const getInteractionIcon = (type) => {
    const interaction = interactionOptions.value.find(i => i.id === type)
    return interaction?.icon || 'streamline:like-1'
}

const getInteractionLabel = (type) => {
    const interaction = interactionOptions.value.find(i => i.id === type)
    return interaction?.label || t('Like')
}

const getInteractionTextColor = (type) => {
    const colorMap = {
        1: 'text-blue-600',      // Like - blue
        2: 'text-red-600',       // Dislike - red
        3: 'text-red-600',       // Heart - red
        4: 'text-yellow-600',    // Haha - yellow
        5: 'text-yellow-600',    // Wow - yellow
        6: 'text-yellow-600',    // Sad - yellow
        7: 'text-yellow-600',    // Angry - yellow
    }
    return colorMap[type] || ''
}
const calculatePercent = (votes, options) => {
    if (!votes || !options) return 0
    const total = options.reduce((acc, curr) => acc + (curr.votes_count || 0), 0)
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
}
const isPollEnded = computed(() => {
    if (!props.post.end_poll) return false
    return dayjs().isAfter(dayjs(props.post.end_poll))
})
const handleVote = async (optionId) => {
    try {
        const option = props.post.poll_options.find(o => o.id === optionId)
        const userId = userInfo.value.id
        const isCurrentVote = option?.poll_vote_users?.includes(userId)

        // If clicking on current vote, call remove_vote API
        if (isCurrentVote) {
            const { data: response, error } = await useAPI().post(`/social/posts/${props.post.id}/remove_vote/`)

            if (response.value || !error.value) {
                // Remove user from poll_vote_users and decrement count
                if (option) {
                    const index = option.poll_vote_users.indexOf(userId)
                    if (index !== -1) {
                        option.poll_vote_users.splice(index, 1)
                        option.votes_count = (option.votes_count || 0) - 1
                    }
                }
                return true
            } else {
                if (error.value) {
                    useToast().add({
                        title: t('Failed to remove vote'),
                        description: error.value?.data?.detail || t('An error occurred while removing vote. Please try again.'),
                        icon: 'i-heroicons-x-circle',
                        color: 'red',
                        duration: 5000,
                        position: 'top-right',
                    })
                }
                return false
            }
        }

        // Otherwise, vote for this option
        const { data: response, error } = await useAPI().post(`/social/posts/${props.post.id}/vote/`, {
            poll_option_id: optionId
        })

        if (response.value && response.value.id) {
            const previousOption = props.post.poll_options.find(o => o.poll_vote_users?.includes(userId))

            if (option) {
                if (!option.poll_vote_users) option.poll_vote_users = []
                const index = option.poll_vote_users.indexOf(userId)
                if (index === -1) {
                    option.poll_vote_users.push(userId)
                    option.votes_count = (option.votes_count || 0) + 1
                } else {
                    option.poll_vote_users.splice(index, 1)
                    option.votes_count = (option.votes_count || 0) - 1
                }
            }

            // Remove from previous option if switching votes
            if (previousOption && previousOption.id !== optionId) {
                const index = previousOption.poll_vote_users.indexOf(userId)
                if (index !== -1) {
                    previousOption.poll_vote_users.splice(index, 1)
                    previousOption.votes_count = (previousOption.votes_count || 0) - 1
                }
            }
            return true
        } else {
            if (error.value) {
                useToast().add({
                    title: t('Failed to vote'),
                    description: error.value?.data?.detail || t('An error occurred while voting. Please try again.'),
                    icon: 'i-heroicons-x-circle',
                    color: 'red',
                    duration: 5000,
                    position: 'top-right',
                })
            }
            return false
        }
    } catch (error) {
        useToast().add({
            title: t('Failed to vote'),
            description: error.value?.data?.detail || t('An error occurred while voting. Please try again.'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
            duration: 5000,
            position: 'top-right',
        })
        return false
    }
}
const removeInteraction = async () => {
    try {
        const { status, error } = await useAPI().post(`/social/posts/${props.post.id}/remove_interaction/`)
        console.log('remove interaction status', status.value)
        if (status.value === 'success') {
            const removedInteractionType = props.post.your_interaction
            props.post.your_interaction = null
            props.post.interactions_count = Math.max(0, props.post.interactions_count - 1)

            // Update top_interaction_types if the removed interaction is in the array
            if (props.post.top_interaction_types && removedInteractionType) {
                const interactionIndex = props.post.top_interaction_types.findIndex(
                    i => i.interaction_type === removedInteractionType
                )

                if (interactionIndex !== -1) {
                    // Decrement count
                    props.post.top_interaction_types[interactionIndex].count -= 1

                    // Remove if count reaches 0
                    if (props.post.top_interaction_types[interactionIndex].count <= 0) {
                        props.post.top_interaction_types.splice(interactionIndex, 1)
                    }
                }
            }

            return true
        } else {
            if (error.value) {
                useToast().add({
                    title: t('Failed to remove interaction'),
                    description: error.value?.data?.detail || t('An error occurred while removing the interaction. Please try again.'),
                    icon: 'i-heroicons-x-circle',
                    color: 'red',
                    duration: 5000,
                    position: 'top-right',
                });
            }
            return false;
        }
    } catch (error) {
        useToast().add({
            title: t('Failed to remove interaction'),
            description: error.value?.data?.detail || t('An error occurred while removing the interaction. Please try again.'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
            duration: 5000,
            position: 'top-right',
        });
        return false;
    }
};
const interactPost = async (interactionType) => {
    // Prevent removing interaction if there's no interaction to remove
    if (interactionType === 0 && !props.post.your_interaction) {
        return;
    }

    try {
        let endpoint = `/social/posts/${props.post.id}/interact/`;

        // Use remove_interaction endpoint for type 0
        if (interactionType === 0) {
            return await removeInteraction();
        }

        const { data: response, error } = await useAPI().post(endpoint, {
            interaction_type: interactionType
        });

        if (response.value && response.value.id) {
            // Add or update interaction
            const hadInteraction = props.post.your_interaction !== null
            const previousInteractionType = props.post.your_interaction
            props.post.your_interaction = interactionType

            // Only increment count if there wasn't already an interaction
            if (!hadInteraction) {
                props.post.interactions_count += 1
            }

            // Initialize top_interaction_types if it doesn't exist
            if (!props.post.top_interaction_types) {
                props.post.top_interaction_types = []
            }

            // Handle switching reactions - always update counts when user switches
            if (hadInteraction && previousInteractionType !== interactionType) {
                // Decrement the old interaction type
                const previousInteraction = props.post.top_interaction_types.find(
                    i => i.interaction_type === previousInteractionType
                )
                if (previousInteraction) {
                    previousInteraction.count -= 1
                    // Remove if count reaches 0
                    if (previousInteraction.count <= 0) {
                        props.post.top_interaction_types = props.post.top_interaction_types.filter(
                            i => i.interaction_type !== previousInteractionType
                        )
                    }
                }

                // Increment or add the new interaction type
                const newInteraction = props.post.top_interaction_types.find(
                    i => i.interaction_type === interactionType
                )

                if (newInteraction) {
                    // Increment existing interaction
                    newInteraction.count += 1
                } else if (props.post.top_interaction_types.length < 3) {
                    // Add new interaction only if less than 3 items
                    props.post.top_interaction_types.push({
                        interaction_type: interactionType,
                        count: 1
                    })
                }
            } else if (!hadInteraction && props.post.top_interaction_types.length < 3) {
                // New interaction (user didn't have one before) - only add if less than 3 items
                const existingInteraction = props.post.top_interaction_types.find(
                    i => i.interaction_type === interactionType
                )

                if (existingInteraction) {
                    existingInteraction.count += 1
                } else {
                    props.post.top_interaction_types.push({
                        interaction_type: interactionType,
                        count: 1
                    })
                }
            }

            // Sort by count descending
            props.post.top_interaction_types.sort((a, b) => b.count - a.count)

            return true
        } else {
            if (error.value) {
                useToast().add({
                    title: t('Failed to interact with post'),
                    description: error.value?.data?.detail || t('An error occurred while interacting with the post. Please try again.'),
                    icon: 'i-heroicons-x-circle',
                    color: 'red',
                    duration: 5000,
                    position: 'top-right',
                });
            }
            return false;
        }
    } catch (error) {
        useToast().add({
            title: t('Failed to interact with post'),
            description: error.value?.data?.detail || t('An error occurred while interacting with the post. Please try again.'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
            duration: 5000,
            position: 'top-right',
        });
        return false;
    }
};
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const emit = defineEmits(['postDeleted']);
const editPostDropdownItems = ref([
    [{
        label: t('Edit post'),
        icon: 'i-heroicons-pencil-square',
        click: () => {
            console.log('edit post')
        }
    },
    {
        label: t('Delete post'),
        icon: 'i-heroicons-trash',
        click: () => {
            setAlertModal(true, {
                message: t('Are you sure you want to delete this post?'),
                confirmButton: t('OK'),
                denyButton: t('No'),
            })
            const unwatch = watch(
                () => alertModal.value,
                async (newVal) => {
                    if (!newVal) {
                        if (alertConfirm.value) {
                            console.log('delete post')
                            const isDeleted = await deletePost();
                            if (isDeleted) {
                                useToast().add({
                                    title: t('Success'),
                                    description: t('Post was deleted successfully.'),
                                    icon: 'i-heroicons-check-circle',
                                    color: 'green',
                                });
                                emit('postDeleted', props.post.id);
                            } else {
                                useToast().add({
                                    title: t('Error'),
                                    description: t('An error occurred while deleting post, please try again later.'),
                                    icon: 'i-heroicons-x-circle',
                                    color: 'red',
                                });
                            }
                        }
                        unwatch();
                    }
                }
            )
        }
    }]
])
const deletePost = async () => {
    try {
        const response = await useAPI().del(`social/posts/${props.post.id}/`);
        console.log('response', response)
        if (response && response.status.value === 'success') {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}
</script>
