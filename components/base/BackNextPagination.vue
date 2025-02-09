<template>
    <div class="flex" :class="`justify-${alignment}`">
      <nav class="flex" role="navigation" aria-label="Navigation">
        <div class="mr-2">
            <button
                class="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out disabled:border-slate-200 disabled:dark:border-slate-700 disabled:text-slate-400 disabled:dark:text-slate-500"
                :disabled="!hasPrev"
                @click.stop="emit('goPrevious')">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 16 16">
                    <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
                </svg>
                Trang trước
            </button>
          <!-- <span class="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600">
            <span class="sr-only">Previous</span><wbr />
            <svg class="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
            </svg>
            Trang trước
          </span> -->
        </div>
        
        <div class="ml-2">
            <button
                class="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out disabled:border-slate-200 disabled:dark:border-slate-700 disabled:text-slate-400 disabled:dark:text-slate-500"
                :disabled="!hasNext"
                @click.stop="emit('goNext')">
                Trang sau
                <svg class="h-4 w-4 fill-current" viewBox="0 0 16 16">
                    <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
                </svg>
            </button>
          
        </div>
      </nav>
    </div>
</template>
  
<script setup>
    const props = defineProps({
        alignment: {
            type: String,
            validator(value, props) {
                return ['start', 'end', 'center'].includes(value)
            },
            default: 'end'
        },
        hasNext: {
            type: Boolean,
            default: false
        },
        hasPrev: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['goNext', 'goPrevious'])
</script>