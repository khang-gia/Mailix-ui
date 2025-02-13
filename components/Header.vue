<template>
    <header class="sticky top-0 bg-white border-b border-slate-200 z-30 dark:bg-[#182235] dark:border-slate-700">
        <div class="px-2 sm:px-3 lg:px-4">
            <div class="flex items-center justify-between h-16 -mb-px">
                <div class="flex h-16 my-auto py-4">
                    <button 
                        class="text-slate-500 hover:text-slate-600 lg:hidden"
                        @click.stop="openSidebar"
                        aria-controls="sidebar"
                        :aria-expanded="sidebarOpen"
                        aria-label="Open Sidebar">
                        <span class="sr-only">Open sidebar</span>
                        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="5" width="16" height="2" />
                            <rect x="4" y="11" width="16" height="2" />
                            <rect x="4" y="17" width="16" height="2" />
                        </svg>
                    </button>
                    <span class="text-xl font-semibold hidden lg:flex dark:text-slate-400 mr-3">{{ appTitle || route.meta.title }}</span>
                </div>

                <div class="flex items-center space-x-2">
                    <a v-if="isLive && !draggableModal" href="#" class="text-orange-600 text-sm" @click="setDraggableModal(true)">
                        <Icon name="streamline:live-video" size="20" class="animate-pulse" />
                        Livestream
                    </a>
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
                        <UTooltip text="Tìm nhanh cổ phiếu" :shortcuts="[metaSymbol, 'K']">
                            <span class="sm:hidden">
                                <UButton variant="link" color="gray" @click.stop="openSearchModal" class="p-[6px]">
                                    <Icon name="heroicons:magnifying-glass-20-solid" size="20" />
                                </UButton>
                            </span>
                            <button
                                class="hidden sm:flex px-2 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:text-white transition duration-150 rounded-full ml-3"
                                :class="{ 'bg-slate-200': searchModal }" @click.stop="openSearchModal"
                                aria-controls="search-modal">
                                
                                <svg class="w-3 h-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path class="fill-current text-slate-500"
                                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                    <path class="fill-current text-slate-400"
                                        d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                                </svg>
                                <span class="text-xs ml-1 flex items-center gap-0.5">
                                    <span class="w-2"></span>
                                    <span>{{ metaSymbol }} + K</span>
                                </span>
                            </button>
                        </UTooltip>
                        
                    </div>
                    <!-- <hr class="w-px h-6 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600" /> -->
                    <!-- <Notifications /> -->
                    <DropdownNotifications />
                    <!-- <DropdownHelp align="right" /> -->

                    <BaseLightDarkMode />
                    <hr class="w-px h-6 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 ml-2" />
                    <DropdownProfile v-if="isAuthenticated" />
                    <div v-else>
                        <button @click.stop="openAuthModal('signin')"
                            class="px-2 py-1 rounded text-primary-500 hover:underline mr-2">{{$t('Sign in')}}</button>
                        <button @click.stop="openAuthModal('signup')"
                            class="px-2 py-1 rounded text-white bg-primary-500 hover:bg-primary-600 hidden md:inline-block">{{ $t('Sign up') }}</button>
                    </div>
                    
                </div>

            </div>
        </div>
        
    </header>
</template>

<script setup>
import { useModal } from 'vue-final-modal'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useAppStore } from '@/stores/app'
const modalStore = useModalStore()
const { setAuthModal, setSearchModal, setDraggableModal, setDraggableModalInfo } = modalStore
const { searchModal, isLive, draggableModal } = storeToRefs(modalStore)
const appStore = useAppStore()

const { appTitle } = storeToRefs(appStore)


const route = useRoute()
const emit = defineEmits(['open-sidebar'])
const props = defineProps({
    sidebarOpen: {
        type: Boolean,
        default: false
    }
})

const { status, data } = useAuth()

const searchModalRef = ref(null)
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


const openSidebar = () => {
    emit('open-sidebar', true)
}
const openSearchModal = () => {
    setSearchModal(true)
}

const {data:hotEvents} = await useAPI().get('/core/hot_events/')
const hotEvent = ref(null)
if (hotEvents.value && hotEvents.value.results.length) {
    hotEvent.value = hotEvents.value.results[0]
}

// const { open, destroy } = useModal({
//     keepAlive: true,
//     component: defineAsyncComponent(() => import('@/components/DraggableModal2.vue')),
// })

onBeforeUnmount(() => {
    destroy()
})

// const {data:happeningEvents} = await useAPI().get('/core/happening_events/')
// const happeningEvent = ref(null)
// if (happeningEvents.value && happeningEvents.value.results.length) {
//     happeningEvent.value = happeningEvents.value.results[0]
//     setDraggableModalInfo(happeningEvent.value)
//     setDraggableModal(true)
// }

watchEffect(() => {
    if (draggableModal.value && isLive.value) {
        open()
    }
})
</script>
