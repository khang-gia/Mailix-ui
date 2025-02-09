<template>
  <Icon v-if="app.isLoading" name="line-md:loading-twotone-loop" :size="size" :color="color" :class="class"/>
</template>

<script setup>
import { useAppStore } from '~/stores/app';

const app = useAppStore();

defineProps({
  icon: {
    type: String,
    default: 'line-md:loading-twotone-loop',
  },
  color: {
    type: String,
    default: 'white',
  },
  size: {
    type: String,
    default: "24",
  },
  class: {
    type: String,
    default: "",
  },
})
</script>