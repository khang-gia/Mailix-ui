<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="inline-flex justify-center items-center group"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <slot name="button"></slot>
    </button>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="dropdownOpen" class="origin-top-right z-10 absolute min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        :class="`${horizontal === 'right' ? 'right-0' : 'left-0'} ${vertical === 'top' ? ' top-full mt-1' : 'bottom-full mb-1'}`">
        <ul ref="dropdown" @click="dropdownOpen=false">
          <slot name="items"></slot>
        </ul>
      </div> 
    </transition>
  </div>
</template>
<script setup>
  const props = defineProps(['horizontal', 'vertical'])
  const dropdownOpen = ref(false)
  const trigger = ref(null)
  const dropdown = ref(null)
  
  // close on click outside
  const clickHandler = ({ target }) => {
    if (!dropdownOpen.value || dropdown.value.contains(target) || trigger.value.contains(target)) return
    dropdownOpen.value = false
  }

  // close if the esc key is pressed
  const keyHandler = ({ keyCode }) => {
    if (!dropdownOpen.value || keyCode !== 27) return
    dropdownOpen.value = false
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
