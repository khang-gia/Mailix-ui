<template>
    <div class="p-3">
        <div>
            <ArticleDetail v-if="article" :item="article"></ArticleDetail>
            <div v-else>
                <ArticleNotFound />
            </div>
        </div>
    </div>
</template>
<script setup>
    definePageMeta({
        title: 'Bài viết ✨'
    })
    const route = useRoute()
    const {data: article} = await useAPI().get(`/consult/articles/${route.params.id}/`)
    
    if (article.value) {
        const seoObj = {
            title: article.value.title,
            ogTitle: article.value.title,
            description: article.value.message,
            ogDescription: article.value.message
        }
        if (article.value.thumb) {
            seoObj.ogImage = article.value.thumb
            seoObj.twitterCard = article.value.thumb
        }

        useSeoMeta(seoObj)
    }
    
    

    
    
</script>
