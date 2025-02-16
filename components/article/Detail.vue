<template>
    <div class="mx-auto flex flex-col lg:flex-row space-x-0 md:space-x-4">
        <div class="flex-1">
            <div class="mb-6">
                <!-- <NuxtLink class="btn-sm px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" to="/bai-viet"> -->

                <UButton variant="variant" class="px-3 bg-white dark:bg-slate-800  hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" @click.prevent="goBack">
                    <svg class="fill-current text-slate-400 dark:text-slate-500 mr-2" width="7" height="12" viewBox="0 0 7 12">
                        <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
                    </svg>
                    <span>Trở lại</span>
                </UButton>
            </div>
            <div class="text-sm font-semibold text-indigo-500 uppercase mb-2">{{ formatDate(new Date(item.published_at), "DD/MM/YYYY HH:mm") }}</div>
            <header class="mb-4">
                <h3 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-2">{{ item.title }}</h3>
            </header>

              
            <div v-if="item.content">
                <div @click.right.prevent @keydown="keydown" @copy.prevent @paste.prevent v-html="item.content" />
                <hr class="h-px w-full bg-slate-200 dark:bg-slate-600 block mt-1 border-transparent" />
                <div class="mt-2 flex items-end justify-end space-x-2">
                    <div class="place-self-center">Chia sẻ</div>
                    <button v-if="isSupported" @click.stop="copyLink" title="Sao chép đường dẫn" class="leading-none px-2 py-1 rounded bg-indigo-500 hover:bg-indigo-400 text-white border-1 border border-indigo-400">
                        <Icon name="heroicons:link" class="social-share-button__icon"></Icon>
                    </button>
                    <SocialShare @click="shareVia('facebook')" title="Chia sẻ lên Facebook" network="facebook" :style="true" :label="false" class="px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white border-1 border border-blue-400"/>
                    <SocialShare @click="shareVia('twitter')" title="Chia sẻ lên X" network="twitter" :style="true" :label="false" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white border-1 border border-slate-700" />
                    <SocialShare @click="shareVia('linkedin')" title="Chia sẻ lên LinkedIn" network="linkedin" :style="true" :label="false" class="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white border-1 border border-blue-500" />
                    <SocialShare @click="shareVia('telegram')" title="Chia sẻ lên Telegram" network="telegram" :style="true" :label="false" class="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white border-1 border border-sky-500" />
                </div>
            </div>  
            <div v-else>
                <div @click.right.prevent @keydown="keydown" @copy.prevent @paste.prevent v-html="item.message" />
                <div class="mt-4 border rounded-lg p-4 min-h-20 text-center">
                    <div v-if="!isAuthenticated">
                        Bài viết do đội ngũ TITACA biên soạn, chỉ dành cho thành viên. <br/>
                        Vui lòng<UButton variant="link" @click.stop="openAuthModal">đăng nhập</UButton>để xem đầy đủ.
                    </div>
                    <div v-else>
                        Bài viết do đội ngũ TITACA biên soạn dành riêng cho thành viên đã mở tài khoản.<br/>
                        Các bạn có thể ủng hộ team theo thông tin tại trang ...
                        <!-- <NuxtLink class="text-blue-500" to="/mo-tkck"> mở tài khoản</NuxtLink>. -->
                    </div>
                </div>
            </div>
            

            <div v-if="item.source_name" class="mt-2 pb-4">
                Nguồn: <a :href="item.source_link" target="_blank" class="text-blue-500">{{ item.source_name }}</a>
            </div>
        </div>
        <div>
            <div class="lg:w-72 xl:w-80 space-y-4 sticky top-[-15em] xl:top-[-16em]">
                <div class="hidden lg:block bg-white dark:bg-slate-800 p-4 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                    <div class="flex items-center sm:mr-4">
                        <Avatar :size="32" variant="beam" :name="item.created_by.email" />
                        <div class="ml-2 text-sm whitespace-nowrap">{{ item.created_by.public_name }}</div>
                    </div>
                    <div class="text-center m-4">
                        <img :src="TelegramQR" class="w-3/4 inline-block rounded">
                    </div>
                    <div class="text-center">
                        <a 
                            href="https://t.me/+pU3YBdP7MRhlMDI1"
                            class="px-5 py-2.5 w-full text-white bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                            target="_blank"
                            @click.stop="onOpenTelegram">
                            <Icon name="tabler:brand-telegram"></Icon>
                            Tham gia
                        </a>
                    </div>
                </div>
                <ArticleDisclaimer />    
            </div>
            
        </div>
    </div>
</template>

<script setup>
import Avatar from "vue-boring-avatars"
import { formatDate } from '@vueuse/core'
import { useModalStore } from '@/stores/modal'

import TelegramQR from '/images/TTTMAILSERVER_OFFICIAL.png'

const modalStore = useModalStore()
const { setAuthModal } = modalStore

const { status, data } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')
const router = useRouter()
const goBack = () => {
    router.go(-1)
}
const props = defineProps({
    item: Object
})

const openAuthModal = () => {
    setAuthModal(true)
}
const { text, copy, copied, isSupported } = useClipboard()
const toast = useToast()
const gtm = useGtm()

const copyLink = () => {
    copy(location.href)
    toast.add({ 
        title: 'Đã sao chép',
        icon: 'i-heroicons-document-duplicate',
        timeout: 2000
    })
    
    gtm.trackEvent({
      event: `article_share_copy`,
      category: 'article',
    })
}

const shareVia = (network) => {
    gtm.trackEvent({
      event: `article_share_${network}`,
      category: 'article',
    })
}

</script>
<style scoped>
:deep(.social-share-button__icon) {
    height: 0.8em;
}
</style>