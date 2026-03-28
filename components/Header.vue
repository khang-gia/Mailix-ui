<template>
    <header class="sticky top-0 bg-white border-b border-slate-100 z-30 text-[#222222] dark:bg-[#1E1E2E] dark:text-[#E0E0E0] dark:border-slate-700">
        <div class="px-2 sm:px-3 lg:px-4">
            <div class="flex items-center justify-between h-16 -mb-px">
                <div class="flex h-16 my-auto pt-5">
                    <UButton v-if="routeCreate.includes(route.name) " icon="i-heroicons-plus" variant="outline" color="" size="xs" class="mr-2 w-7 h-7 bounce-animation text-[#147FE0] dark:text-[#7FC1FC] hover:bg-[#e3eef8] dark:hover:bg-[#1B1B29]" @click.stop="onPageAction"/>
                    <span v-if="!route.meta.hideTitle" class="text-lg font-semibold font-averta lg:flex mr-3">{{ appTitle || route.meta.header|| $t(route.meta.title)}}</span>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- <a v-if="isLive && !draggableModal" href="#" class="text-orange-600 text-sm" @click="setDraggableModal(true)">
                        <Icon name="streamline:live-video" size="20" class="animate-pulse" />
                        Livestream
                    </a> -->
                    <NuxtLink 
                        v-if="hotEvent" 
                        :to="hotEvent.url"
                        class="text-sm text-purple-600 dark:text-purple-300" 
                        :class="hotEvent.css_classes"
                        :id="hotEvent.html_id"
                        :target="hotEvent.target">
                        <Icon name="carbon:flash" size="20" />
                        <span class="hidden sm:inline">
                            {{ hotEvent.title }}
                        </span>
                    </NuxtLink>

                    <div>
                        <SearchInput v-if="routeSearch.includes(route.name) " v-model="search" />

                        <!-- <UTooltip text="Tìm kiếm" :shortcuts="[metaSymbol, 'K']">
                            <span class="sm:hidden">
                                <UButton variant="link" color="gray" @click.stop="openSearchModal" class="p-[6px]">
                                    <Icon name="heroicons:magnifying-glass-20-solid" size="20" />
                                </UButton>
                            </span>
                            <button
                                class="hidden sm:flex px-2 h-8 items-center justify-center dark:hover:bg-slate-900 hover:bg-slate-100 dark:hover:text-white transition duration-150 rounded-lg ml-3"
                                :class="{ 'bg-slate-200': searchModal }" @click.stop="openSearchModal"
                                aria-controls="search-modal">
                                
                                <svg class="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path class="fill-current text-slate-500"
                                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                    <path class="fill-current text-slate-400"
                                        d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                                </svg>
                            </button>
                        </UTooltip> -->
                        
                    </div>
                    <!-- <hr class="w-px h-6 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600" /> -->
                    <!-- <Notifications /> -->
                    <!-- <DropdownNotifications /> -->
                    <!-- <DropdownHelp align="right" /> -->

                    <!-- <BaseLightDarkMode /> -->
                    <UTooltip :text="$t('Mail')">
                        <UButton icon="heroicons:envelope" color="gray" variant="ghost" size="sm"
                            to="/mail/" external target="_blank"
                            class="hover:bg-slate-100 dark:hover:bg-slate-800" />
                    </UTooltip>
                    <hr class="w-px h-6 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 ml-2" />
                    <DropdownProfile v-if="isAuthenticated" />
                    <div v-else>
                        <!-- <button @click.stop="openAuthModal('signin')"
                            class="px-2 py-1 rounded text-primary-500 hover:underline mr-2">{{$t('Sign in')}}</button> -->
                        <UButton @click.stop="openAuthModal('signin')" color="blue" size="sm" variant="solid" trailing-icon="i-heroicons-arrow-left-start-on-rectangle" :label="$t('Sign in')">

                        </UButton>
                        <!-- <button @click.stop="openAuthModal('signup')"
                            class="px-2 py-1 rounded text-white bg-primary-500 hover:bg-primary-600 hidden md:inline-block">{{ $t('Sign up') }}</button> -->
                    </div>
                    
                </div>

            </div>
        </div>
        
    </header>
</template>
<style scoped>
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.bounce-animation:hover {
  animation: bounce 2s infinite;
}
</style>
<script setup>
import { useModal } from 'vue-final-modal'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useAppStore } from '@/stores/app'
const modalStore = useModalStore()
import { useSearchStore } from '@/stores/search';
// import { useI18n } from "vue-i18n";
// const { t } = useI18n();
const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);
const { setAuthModal, setSearchModal } = modalStore
const { isLive, draggableModal } = storeToRefs(modalStore)
const appStore = useAppStore()

const { appTitle } = storeToRefs(appStore)


const route = useRoute()
const router = useRouter()
const emit = defineEmits(['open-sidebar'])
const routeCreate = [
    'hr',
    'contacts',
    'works',
    'customers',
    'system',
    "departments",
    "groups",
]
const routeSearch = [
    'hr',
    'contacts',
    'works',
    'customers',
    'system',
    "departments",
    "groups",
    // "dashboard-hrm"
]
const props = defineProps({
    sidebarOpen: {
        type: Boolean,
        default: false
    }
})

const { status, data } = useAuth()

const { metaSymbol } = useShortcuts()

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
        openSearchModal()
    }
  }
})

const isAuthenticated = computed(() => status.value === 'authenticated')
const openAuthModal = (mode) => {
    setAuthModal(true, mode)
}


const onPageAction = () => {
    if (routeCreate.includes(route.name)) {
        router.push({ name: `${route.name}-create` })
    }
}
const openSearchModal = () => {
    setSearchModal(true)
}

const {data:hotEvents} = await useAPI().get('/core/hot_events/')
const hotEvent = ref(null)
if (hotEvents.value && hotEvents.value.results.length) {
    hotEvent.value = hotEvents.value.results[0]
}


watchEffect(() => {
    if (draggableModal.value && isLive.value) {
        open()
    }
})
</script>
