<template>
  <div>
    <div v-if="articles.length>0" class="grid lg:grid-cols-2 gap-3">
        <article v-for="item in articles" class="flex bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <UTooltip text="Bài viết dành riêng" v-if="item.privacy==2" class="absolute right-0 top-0 z-2">
                <Icon name="twemoji:sports-medal" size="32"></Icon>
            </UTooltip>
            <NuxtLink class="relative block w-24 sm:w-56 xl:sidebar-expanded:w-40 2xl:sidebar-expanded:w-56 shrink-0" :to="`/bai-viet/${item.slug}/${item.id}`">
                <img v-if="item.thumb" class="absolute object-cover object-center w-full h-full" :src="item.thumb" width="220" height="236" :alt="item.slug" />
            </NuxtLink>
            
            <div class="grow p-5 flex flex-col">
                <div class="grow">
                
                <NuxtLink class="inline-flex mb-2" :to="`/bai-viet/${item.slug}/${item.id}`">
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        <span v-if="item.privacy==2" class="text-green-500">
                            <Icon name="solar:medal-ribbons-star-bold-duotone" size="24"></Icon>
                        </span>
                        {{ item.title }}
                    </h3>
                </NuxtLink>
                <div class="text-sm" @click.right.prevent @keydown="keydown" @copy.prevent @paste.prevent>{{ item.message }}</div>
                </div>
                <!-- Footer -->
                <div class="flex justify-between mt-3">
                    <ul class="flex flex-wrap -m-1">
                        <li v-for="s in item.symbols" class="m-1">
                            <button 
                                class="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out"
                                >
                                {{ s }}
                            </button>
                        </li>
                    </ul>
                    <div class="text-sm pt-1">{{ formatDate(new Date(item.published_at), "DD/MM/YYYY HH:mm") }}</div>
                
                </div>
            </div>
        </article>
    </div>
    <div v-else>
        Hiện tại chưa có bài viết !
    </div>
  </div>
</template>

<script setup>
    import { formatDate } from '@vueuse/core'

    const props = defineProps({
        articles: Array,
        default: () => {
            return []
        }
    })
    // const articles = ref([])
    // const articleCount = ref(0)

    // onMounted (() => {
    //     useAPI().get('/consult/articles')
    //         .then(({data}) => {
    //             articles.value = data.value.results
    //             articleCount.value = data.value.count
    //         })
    // })
    
</script>
