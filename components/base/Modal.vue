<template>
  <!-- Modal backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-out duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-show="modalOpen" class="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity" aria-hidden="true"></div>
  </transition>
  <!-- Modal dialog -->
  <transition
    enter-active-class="transition ease-in-out duration-200"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in-out duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div v-show="modalOpen" :id="id" class="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6" role="dialog" aria-modal="true">
      <div ref="modalContent" :class="[
        'bg-white dark:bg-slate-800 rounded shadow-lg overflow-auto max-h-full w-full',
        {
          'max-w-lg': props.size === 'sm',
          'max-w-xl': props.size === 'md',
          'max-w-5xl': props.size === 'lg',
          'max-w-6xl': props.size === 'xl',
          'max-w-7xl': props.size === '2xl',
          'max-w-8xl h-full': props.size === '3xl'
        }
      ]">
        <!-- Modal header -->
        <div v-if="!noHeader" class="px-5 pt-3 border-b border-slate-200 dark:border-slate-700" :class="{'pb-3': !includeTabs}">
          <div class="flex justify-between items-center">
            <div class="font-semibold text-slate-800 dark:text-white">
              <span>
                {{ title }}
                <span v-if="subTitle"> | </span>
                <span class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ subTitle }}</span>
              </span>
            </div>
            <button class="text-slate-400 hover:text-slate-500" @click.prevent.stop="$emit('close-modal')">
              <div class="sr-only">Close</div>
              <svg class="w-4 h-4 fill-current">
                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
              </svg>
            </button>
          </div>
          <div class="flex justify-between">
            <slot name="label">
              <div v-if="label.length !== 0" class="flex flex-row">
                <div v-for="item,index in label" :key="index" class="text-left">
                  <span class="text-xs font-medium mr-2 px-2 py-0.25 rounded uppercase bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" 
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </slot>
            <div></div>
            <slot name="tabs"></slot>
          </div>
        </div>
        <slot />       
      </div>
    </div>
  </transition>
</template>

<script setup>
  const props = defineProps({
    id: String,
    modalOpen: Boolean,
    title: String,
    subTitle: String,
    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    },
    size:{
      type: String,
      default: 'sm'
    },
    label:{
      type: Array,
      default: []
    },
    includeTabs:{
      type: Boolean,
      default: false
    },
    noHeader:{
      type: Boolean,
      default: false
    }
  })
  const labelColor = ['green', 'red', 'yellow', 'blue', 'gray', 'indigo', 'pink', 'purple']
  const emit = defineEmits(['close-modal'])
  
  const modalContent = ref(null)

  // close on click outside
  const clickHandler = ({ target }) => {
    if (!props.modalOpen || modalContent.value.contains(target)) return
    if (!props.closeOnClick) return
    emit('close-modal')
  }

  // close if the esc key is pressed
  const keyHandler = ({ keyCode }) => {
    if (!props.modalOpen || keyCode !== 27) return
    if (!props.closeOnEsc) return
    emit('close-modal')
  }
  const generateColorLabel = (index) => {
    if (index > labelColor.length) return labelColor[index % labelColor.length]
    return labelColor[index]
  }
  onMounted(() => {
    document.addEventListener('click', clickHandler)
    document.addEventListener('keydown', keyHandler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', clickHandler)
    document.removeEventListener('keydown', keyHandler)
  })
</script>
  