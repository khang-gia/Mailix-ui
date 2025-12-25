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
            <span class="mb-3 truncate"  v-html="post.content"></span>

            <img v-if="post.image" :src="post.image" class="w-full rounded-lg mb-3 object-cover max-h-96" />

            <!-- Poll -->
            <div v-if="post.post_type === 2 && post.poll_options" class="space-y-2">
                <div v-for="option in post.poll_options" :key="option.id"
                    class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <div class="flex items-center gap-3">
                        <UCheckbox :model-value="option.poll_vote_users?.includes(userInfo.id)" color="green"
                            @click="handleVote(option.id)" :disabled="isPollEnded"/>
                        <span class="font-medium">{{ option.option }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <UProgress :value="calculatePercent(option.votes_count, post.poll_options)" color="green"
                            class="w-24" />
                        <span class="text-xs text-gray-500">{{ option.votes_count }} {{ $t('votes') }}</span>
                    </div>
                </div>
                <p v-if="!isPollEnded"  class="text-xs text-gray-500 mt-2">{{ $t('This poll will end on') }} {{ formatDate(post.end_poll) }}</p>
                <UAlert v-else icon="pajamas:expire" color="yellow" variant="solid" :title="$t('This poll has ended. You can no longer vote.')">
                </UAlert>
            </div>
        </div>
        <!-- Reactions Count & Comments Count -->
        <div class="flex items-center justify-between pb-1">
            <div v-if="post.interactions_count" class="text-sm items-center flex justify-center gap-1 text-mailix-primary">
                <p>{{ post.interactions_count }}</p>
                <UIcon name="i-heroicons-hand-thumb-up-solid" class="w-4 h-4"/>
            </div>
            <div v-else></div>
            <div v-if="post.comments_count" class="text-sm text-gray-500 cursor-pointer hover:underline" @click="setSocialCommentModal(true, post)">
                {{ post.comments_count }} {{ $t('comments') }}
            </div>
        </div>
        <!-- Actions -->
        <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 gap-2">
            <div class="w-full">
                <!-- <UButton icon="i-heroicons-hand-thumb-up" :label="$t('Like')" color="gray" variant="ghost" block="true" @click="interactPost(1)" /> -->
                 <UPopover :popper="{ placement: 'top' }" mode="hover">
                    <UButton icon="i-heroicons-hand-thumb-up" :label="$t('Like')"
                        :color="post.is_liked_by_you ? 'primary' : 'gray'"
                        :variant="post.is_liked_by_you ? 'soft' : 'ghost'" block @click="interactPost(post.is_liked_by_you ? 0 : 1)" />

                    <template #panel>
                        <div class="p-2 flex gap-2">
                            <UButton v-for="interaction in interactionOptions" :key="interaction.id"
                                :icon="interaction.icon" :title="interaction.label" color="gray" variant="ghost"
                                size="sm" @click="interactPost(interaction.id)" />
                            <!-- <UButton v-if="post.is_liked_by_you" icon="i-heroicons-x-mark" title="Remove interaction"
                                color="gray" variant="ghost" size="sm" @click="interactPost(0)" /> -->
                        </div>
                    </template>
                </UPopover>
            </div>
            <div class="w-full">
                <UButton icon="i-heroicons-chat-bubble-left" :label="$t('Comment')" color="gray" variant="ghost" block="true" @click="setSocialCommentModal(true, post)"/>
            </div>
            <!-- <div class="w-full">
                <UButton icon="i-heroicons-arrow-uturn-up" label="Chia sẻ" color="gray" variant="ghost" block="true"/>
            </div> -->
        </div>
        <div v-if="openPostModal" class="pt-2">
            <CommentsSection comment-type="social" :id="post.id" placeholder="Write a comment..." @onAddComment="post.comments_count++"/>
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
  { id: 1, label: t('Like'), icon: 'i-heroicons-hand-thumb-up' },
  { id: 2, label: t('Dislike'), icon: 'i-heroicons-hand-thumb-down' },
  { id: 3, label: t('Heart'), icon: 'i-heroicons-heart' },
  { id: 4, label: t('Haha'), icon: 'i-heroicons-face-smile' },
  { id: 5, label: t('Wow'), icon: 'i-heroicons-star' },
  { id: 6, label: t('Sad'), icon: 'i-heroicons-face-frown' },
  { id: 7, label: t('Angry'), icon: 'i-heroicons-exclamation-triangle' },
]);
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
        const { data: response, error } = await useAPI().post(`/social/posts/${props.post.id}/vote/`, {
            poll_option_id: optionId
        })
        if (response.value && response.value.id) {
            const option = props.post.poll_options.find(o => o.id === optionId)
            const previousOption = props.post.poll_options.find(o => o.poll_vote_users.includes(userInfo.value.id))
            if (option) {
                if (!option.poll_vote_users) option.poll_vote_users = []
                const userId = userInfo.value.id
                const index = option.poll_vote_users.indexOf(userId)
                if (index === -1) {
                    option.poll_vote_users.push(userId)
                    option.votes_count = (option.votes_count || 0) + 1
                } else {
                    option.poll_vote_users.splice(index, 1)
                    option.votes_count = (option.votes_count || 0) - 1
                }
            }
            if (previousOption) {
                const userId = userInfo.value.id
                const index = previousOption.poll_vote_users.indexOf(userId)
                if (index !== -1) {
                    previousOption.poll_vote_users.splice(index, 1)
                    previousOption.votes_count = (previousOption.votes_count || 0) - 1
                }
            }
            return true;
        } else {
            if (error.value) {
                useToast().add({
                    title: t('Failed to vote'),
                    description: error.value?.data?.detail || t('An error occurred while voting. Please try again.'),
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
            title: t('Failed to vote'),
            description: error.value?.data?.detail || t('An error occurred while voting. Please try again.'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
            duration: 5000,
            position: 'top-right',
        });
        return false
    }
}
const removeInteraction = async () => {
    try {
        const { status, error} = await useAPI().post(`/social/posts/${props.post.id}/remove_interaction/`);
        console.log('remove interaction status', status.value)
        if (status.value === 'success') {
            props.post.is_liked_by_you = false;
            props.post.interactions_count = Math.max(0, props.post.interactions_count - 1);
            return true;
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
    if (interactionType === 0 && !props.post.is_liked_by_you) {
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
            const wasLiked = props.post.is_liked_by_you;
            props.post.is_liked_by_you = true;
            
            // Only increment count if it wasn't already liked
            if (!wasLiked) {
                props.post.interactions_count += 1;
            }
            return true;
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
