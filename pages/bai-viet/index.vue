<template>
    <div>
        <div class="p-3 w-full max-w-9xl mx-auto">
            <div class="sm:flex sm:justify-between sm:items-center mb-5">
                <ul class="flex flex-wrap -m-1">
                    <li v-for="item in articleTypes.results" class="m-1">
                        <button 
                            :class="{'bg-indigo-500 text-white': typeFilter==item.id, 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400': typeFilter!==item.id}" 
                            class="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out"
                            @click.stop="setTypeFilter(item.id)">
                            {{ item.label }}
                        </button>
                    </li>
                </ul>
                <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <!-- <form class="relative">
                        <label for="action-search" class="sr-only">Search</label>
                        <input id="action-search" class="form-input !pl-8 bg-white dark:bg-slate-800" type="search" placeholder="Tìm kiếm" />
                        <button class="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                            <svg class="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                            </svg>
                        </button>
                    </form> -->
                </div>
            </div>
            
            <!-- Content -->
            <!-- <ClientOnly> -->
                <ArticleList v-if="articles" :articles="articles.results" />
            <!-- </ClientOnly> -->
            
            <!-- Pagination -->
            <div v-if="articleCount>20" class="my-4">
                <BaseBackNextPagination :hasNext="hasNext" :hasPrev="hasPrev" @goNext="changePage(1)" @goPrevious="changePage(-1)" />
            </div>
            
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        title: 'Bài viết ✨'
    })

    const { data: articleTypes } = await useAPI().get('/consult/article_types/') 
    const { data: articles } = await useAPI().get('/consult/articles/')
       
    const typeFilter = ref(null)

    const setTypeFilter = (type) => {
        if (typeFilter.value == type) {
            typeFilter.value = null
        } else {
            typeFilter.value = type
        }
        getArticles()
    }
    // const articles = ref([])
    const articleCount = ref(0)
    const hasNext = ref(false)
    const hasPrev = ref(false)
    const currentPage = ref(1)
    const PAGE_SIZE = 20
    const getArticles = (query={}) => {
        if (typeFilter.value) {
            query.article_type = typeFilter.value
        }
        query.page = currentPage.value
        useAPI().get('/consult/articles/', query)
            .then(({data}) => {
                if (data.value) {
                    articles.value = data.value
                    articleCount.value = data.value.count
                    hasNext.value = data.value.next !== null
                    hasPrev.value = data.value.previous !== null
                }
            })
    }
    const changePage = (value) => {
        const tmp =  currentPage.value + value
        if (tmp>=1 && tmp<= Math.ceil(articleCount.value / PAGE_SIZE)) {
            currentPage.value = tmp
            getArticles()
        }
    }
    
    getArticles()

    
    useSeoMeta({
        title: 'Bài viết ✨',
        ogTitle: 'Bài viết ✨',
        description: 'Các bài biết mới nhất từ team TTT',
        ogDescription: 'Các bài biết mới nhất từ team TTT',
    })

</script>