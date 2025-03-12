<template>
    <div class="p-3 w-full max-w-9xl mx-auto">
        <UContainer class="mt-24 bg-gray-50 dark:bg-gray-900 py-10 rounded-md dark:text-white text-slate-700" :ui="{ constrained: 'max-w-2xl' }">
            <p class="font-bold text-4xl">{{$t('TITACA WELCOME')}}</p>
            <p class="font-bold text-3xl">{{$t('Get started')}}</p>
            <div class="flex items-center space-x-2 mt-4">
                <UButton class="font-semibold text-2xl" variant="solid" :loading="loading" :disabled="loading" @click="emit('sign-in')" size="xl"
                icon="i-heroicons-outline-login" trailing>{{$t('Sign in')}}</UButton>
            </div>
        </UContainer>
        <!-- <div class="py-10">
            <UCarousel ref="carouselRef" v-slot="{ item }" :items="articles.results" :ui="{ 
                    item: 'basis-full md:basis-1/2 lg:basis-1/3 mx-3',
                    wrapper: 'h-80'
                }" 
                indicators 
                arrows
                class="rounded-lg overflow-hidden">
                <NuxtLink :to="`/bai-viet/${item.slug}/${item.id}`">
                    <img :src="item.thumb" class="w-full h-full rounded-lg" draggable="false">
                </NuxtLink>
                
            </UCarousel>
        </div>
        <div class="py-10">
            <LandingArticleList v-if="articles" :articles="articles.results" />
        </div> -->
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(['sign-in'])

const { data: articles } = await useAPI().get('/consult/articles/')
const articleCount = ref(0)
// const hasNext = ref(false)
// const hasPrev = ref(false)
// const currentPage = ref(1)
const getArticles = (query={}) => {
        query.latest_landing_article = true
        // query.page = currentPage.value
        query.page_size = 6
        useAPI().get('/consult/articles/', query)
            .then(({data}) => {
                if (data.value) {
                    articles.value = data.value
                    articleCount.value = data.value.count
                    // hasNext.value = data.value.next !== null
                    // hasPrev.value = data.value.previous !== null
                    
                }
            })
    }
// const items = [
//     'https://picsum.photos/600/600?random=1',
//     'https://picsum.photos/600/600?random=2',
//     'https://picsum.photos/600/600?random=3',
//     'https://picsum.photos/600/600?random=4',
//     'https://picsum.photos/600/600?random=5',
//     'https://picsum.photos/600/600?random=6'
// ]
const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 3000)
})
getArticles()
</script>