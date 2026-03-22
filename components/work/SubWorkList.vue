<template>
    <div class=" py-4 bg-gray-50 dark:bg-[#181825] border-x border-b border-gray-200 dark:border-gray-800 rounded-b-lg shadow-inner">
        <!-- <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <UIcon name="i-heroicons-rectangle-stack" class="w-4 h-4 text-mailix-primary" />
            {{ $t('Sub-works') }}
        </h4> -->
        
        <div v-if="subWorks.length === 0" class="text-sm italic text-gray-500 bg-white dark:bg-gray-900 p-4 rounded border dark:border-gray-700 text-center">
            {{ $t('No sub-works found in the current page.') }}
        </div>
        
        <div v-else class="border dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-[#1E1E2E] shadow">
            <WorkTable 
                :works="subWorks" 
                :page="dummyPage" 
                @update:page="val => dummyPage = val"
                :pageTotal="1"
                viewMode="default"
                :isSub="true"
            />
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
    },
    allWorks: {
        type: Array,
        required: true
    }
})

const subWorks = computed(() => {
    return props.allWorks.filter(w => w.related_work === props.parentId)
})

const dummyPage = ref(1)

</script>
