<template>
    <div class="py-4 bg-gray-50 dark:bg-[#181825] border-x border-b border-gray-200 dark:border-gray-800 rounded-b-lg shadow-inner">
        <div v-if="loading" class="flex items-center justify-center p-4">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-mailix-primary" />
        </div>

        <div v-else-if="subWorks.length === 0" class="text-sm italic text-gray-500 bg-white dark:bg-gray-900 p-4 rounded border dark:border-gray-700 text-center">
            {{ $t('No sub-works found.') }}
        </div>
        
        <div v-else class="border dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-[#1E1E2E] shadow">
            <WorkTable 
                :works="subWorks" 
                :page="dummyPage" 
                @update:page="val => dummyPage = val"
                :pageTotal="totalSubWorks"
                viewMode="default"
                :isSub="true"
            />
        </div>

        <!-- Pagination for sub-works if there are many -->
        <div v-if="totalSubWorks > subPageSize" class="flex justify-end items-center gap-2 mt-3 px-2">
            <span class="text-xs text-gray-500">
                {{ $t('Showing') }} {{ (subPage - 1) * subPageSize + 1 }}–{{ Math.min(subPage * subPageSize, totalSubWorks) }} {{ $t('of') }} {{ totalSubWorks }}
            </span>
            <UPagination :max="3" :page-count="subPageSize" :total="totalSubWorks" v-model="subPage" size="xs" />
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    parentId: {
        type: [Number, String],
        required: true
    }
})

const subPage = ref(1)
const subPageSize = 10
const totalSubWorks = ref(0)
const dummyPage = ref(1)
const loading = ref(false)

const subWorks = ref([])

const fetchSubWorks = async () => {
    if (!props.parentId) return
    loading.value = true
    try {
        const data = await useAPI().$get('core/works/', {
            related_work: props.parentId,
            page: subPage.value,
            page_size: subPageSize,
        })
        subWorks.value = data.results
        totalSubWorks.value = data.count
    } catch (e) {
        console.error('Failed to fetch sub-works:', e)
    } finally {
        loading.value = false
    }
}

watch(subPage, fetchSubWorks)

onMounted(() => fetchSubWorks())
</script>
