<template>
    <div class="space-y-4 h-full overflow-x-auto mb-4">
        <div v-for="comment in comments" :key="comment.id" class="h-full">

            <div class="flex w-full">
                <NuxtLink v-if="comment.user.profile_hr"
                    :to="{ name: 'hr-id', params: { id: comment.user.profile_hr.id } }">
                    <UAvatar :src="comment.user.avatar" :alt='comment.user.display_name' />
                </NuxtLink>
                <UAvatar v-else :src="comment.user.avatar" :alt='comment.user.display_name' />
                <div class="pl-1">
                    <div class="bg-slate-200 rounded-lg py-1 px-2">
                        <NuxtLink v-if="comment.user.profile_hr"
                            :to="{ name: 'hr-id', params: { id: comment.user.profile_hr.id } }">
                            <p class="font-semibold text-sm">{{ comment.user.display_name }}</p>
                        </NuxtLink>
                        <p v-else class="font-semibold text-sm">{{ comment.user.display_name }}</p>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                            {{ comment.text }}
                        </p>
                    </div>
                    <div class="flex justify-between items-center gap-x-4 mt-1 pl-2 text-xs w-fit">
                        <span class=" text-gray-500">{{ dayjs(comment.created_at).fromNow() }}</span>
                        <span class="cursor-pointer hover:underline"
                            :class="{ 'text-mailix-primary font-semibold': comment.is_liked_by_you }"
                            @click.prevent="interactComment(comment)">{{ $t('Like') }}</span>
                        <span class="cursor-pointer hover:underline">{{ $t('Reply') }}</span>
                        <div v-if="comment.likes && comment.like_count > 0">
                            <UButton icon="i-heroicons-hand-thumb-up-solid" color="primary" size="xs" variant="ghost" square
                                trailing :label="comment.like_count"></UButton>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </div>

    <div class="mt-2">
        <UInput v-model="newComment" type="text" :placeholder="$t('Write a discussion...')" @keyup.enter="writeComment"
            size="md" 
            class="w-full"
            :ui="{
                color: {
                    white: {
                        outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-1 focus:ring-inset focus:ring-gray-300 dark:focus:ring-gray-700'
                    },
                },

                icon: {
                    trailing: {
                        pointer: ''
                    },
                    leading: {
                        wrapper: 'flex items-center justify-center',
                        pointer: ''
                    }
                }
            }">
            <template #trailing>
                <UButton :padded="false" :disabled="!newComment" color="blue" variant="link"
                    icon="i-heroicons-paper-airplane-20-solid" @click="writeComment"/>
            </template>
        </UInput>
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { data: userInfo } = useAuth()

const { t } = useI18n();
const dayjs = useDayjs()
const props = defineProps({
    commentType: {
        type: String,
        required: true,
        default: 'works',
    },
    id: {
        type: String,
        required: false,
    }
})
const apiUrl = computed(() => {
  const id = props.id || useRoute().params.id
  switch (props.commentType) {
    case 'works':
      return `core/works/${id}/comments/`
    case 'contacts':
      return `core/contacts/${id}/comments/`
    case 'customers':
      return `core/customers/${id}/comments/`
    default:
      console.warn(`Unknown commentType: ${props.commentType}`)
      return null
  }
})
const { data: comments, refresh } = await useAPI().get(apiUrl);
const newComment = ref('')
const typeMapping = {
    works: 'work_comments',
    customers: 'customer_comments',
};
const interactComment = async (comment) => {
    try {
        const apiPath = typeMapping[props.commentType];

        if (!apiPath) {
            console.error(`Invalid commentType: ${props.commentType}`);
            throw new Error(t('Invalid comment type'));
        }
        const endpoint = `core/${apiPath}/${comment.id}/interact/`;

        const response = await useAPI().post(endpoint);
        if (response && response.status.value === 'success') {
            comment.is_liked_by_you = !comment.is_liked_by_you
            if (comment.is_liked_by_you) {
                comment.likes.push({ ...userInfo.value });
                comment.like_count += 1;
            } else {
                comment.likes = comment.likes.filter(like => like.id !== userInfo.value.id);
                comment.like_count -= 1;
            }
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error deleting fee:', error);
        throw error;
    }
} 
const mappingForeignKey = {
    works: 'work',
    customers: 'customer',
}
const writeComment = async() => {
    try {
        const apiPath = typeMapping[props.commentType];
        if (!apiPath || !newComment.value) {
            console.error(`Invalid commentType: ${props.commentType}`);
            throw new Error(t('Invalid comment type'));
        }
        const endpoint = `core/${apiPath}/`;
        const payload = {
            text: newComment.value,
            user: userInfo.value.id,
            [mappingForeignKey[props.commentType]]: props.id || useRoute().params.id,
        };

        const response = await useAPI().post(endpoint, payload);

        if (response && response.status.value === 'success') {
            newComment.value = '';
            refresh()
            return true
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error deleting fee:', error);
        throw error;
    }
}
</script>