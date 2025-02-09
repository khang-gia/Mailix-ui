<template>
    
    <button 
        v-for="p in maxPage"
        :key="p"
        :disabled="p===currentPage"
        class="w-8 h-10 p-1.5 shrink-0 rounded bg-white border border-slate-200 hover:border-slate-300 shadow-sm ml-2 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        
        @click="$emit('change', p)">
            {{ p }}
    </button>
    
</template>

<script setup>
    const props = defineProps({
        maxPage: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 1
        }
    })
    defineEmits(["change"])

</script>