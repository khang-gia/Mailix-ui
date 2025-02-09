<template>
    <div class="space-y-2 p-2">
        <div> 
            <ScpMomentumAffect />
        </div>
        <div class="w-full">
            <ScpSentimentCard />
        </div>
        <div v-if="isAuthenticated">
            <ScpSentimentHistoryCard />
        </div>
    </div>
    
</template>

<script setup>
    const { status } = useAuth()
    
    definePageMeta({
        title: 'Diễn biến thị trường'
    })

    const isAuthenticated = computed(() => status.value === 'authenticated')

</script>