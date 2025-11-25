<template>
    <UCard :ui="{ rounded: 'rounded-xl', divide: '', body: { padding: 'py-0' }, footer: { padding: 'px-0' }, header: { padding: 'pb-0' } }" class="w-full h-full">
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-center space-x-2">
                    <span class="rounded-full w-10 h-10 justify-center flex items-center bg-slate-100">
                        <UIcon name="akar-icons:schedule" class="w-5 h-5 text-black inline-block shrink-0" />
                    </span>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {{ $t('Today Tasks') }}
                    </h2>
                </div>

                <UButton v-if="todayTasks.length !== 0" :ui="{ rounded: 'rounded-full' }" :to="'/works'" color="white"
                    variant="soft" size="sm" class="text-slate-700 ring-1 ring-slate-400"
                    icon="material-symbols:more-up-rounded" trailing>
                    <!-- {{ $t('See All') }} -->
                </UButton>
            </div>
        </template>
        <div class="grid grid-cols-2 gap-4">
            <div v-if="limitedTasks.length > 0" v-for="task in limitedTasks" :key="task.id"
                class="p-4 rounded-lg cursor-pointer bg-slate-100">
                <div class="">
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.code }}</p>
                    <h3 class="text-md font-medium text-gray-900 dark:text-gray-100">{{ task.name }}</h3>
                    <div class="pt-2 bg-slate-100">
                        <UAvatarGroup size="xs" :max="3" v-if="task.assigned_to && task.assigned_to.length"
                            :ui="{ ring: '' }">
                            <div v-for="user in task.assigned_to" :key="user.id">
                                <NuxtLink v-if="user.profile_hr"
                                    :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                                    <UAvatar :src="user.avatar" :alt="user.display_name" />
                                </NuxtLink>
                            </div>
                        </UAvatarGroup>
                    </div>
                    <UProgress :value="task.progress" indicator :ui="{
                        progress: { track: '[&::-webkit-progress-bar]:bg-white [&::-webkit-progress-bar]:dark:bg-gray-700 [@supports(selector(&::-moz-progress-bar))]:bg-white [@supports(selector(&::-moz-progress-bar))]:dark:bg-gray-700' }
                    }" />

                </div>
            </div>
        </div>
        <template #footer>
            <div v-if="limitedTasks.length > 0 && !isDismissTodayTask"
                class="rounded-full w-full bg-black flex justify-between items-center py-1 animate-bounce">
                <div class="flex justify-start items-center w-full">
                    <UIcon name="fluent-color:chat-20" class="w-7 h-7 inline-block shrink-0 ml-4 mr-2 my-2" />
                    <span class="text-white font-medium">{{ $t('You have') }} {{ todayTasks.length }} {{ $t('task today. Keep it up!') }}</span>
                    <UIcon name="noto:flexed-biceps" class="w-5 h-5 inline-block shrink-0 mx-1 my-2" />
                </div>
                <UButton :ui="{ rounded: 'rounded-full' }" icon="i-heroicons-x-mark" size="md" color="none"
                    variant="soft" class="mx-2 text-white bg-gray-600 hover:bg-gray-700" @click="closeNotification" />
            </div>
            <div v-else-if="limitedTasks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
                {{ $t('There is no task today') }}
            </div>
        </template>
    </UCard>
</template>
<style scoped>
@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-bounce {
    animation: bounce 1.0s infinite;
}
</style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import dayjs from "dayjs";
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isDismissTodayTask } = storeToRefs(userStore)
const props = defineProps({
    todayTasks: {
        type: Array,
        required: true,
        default: () => []
    }
})

// Check and reset dismissed task state on component mount
onMounted(() => {
    userStore.checkAndResetDismissedTask()
})

const closeNotification = () => {
    userStore.setDissmissTodayTask(true)
}
const limitedTasks = computed(() => {
    if (props.todayTasks.length === 0) {
        return []; // No tasks
    }
    return props.todayTasks.slice(0, 2); // Display only the first 2 tasks
});
</script>