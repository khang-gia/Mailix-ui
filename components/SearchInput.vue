<template>
    <transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
      >
      <UButton v-if="!activeInput" size="sm" color="white" @click="activeInput = true" icon="i-heroicons-magnifying-glass-20-solid" />
      <UInput v-else size="sm" color="white" :placeholder="$t('Enter keyword') + '...'"
        v-model="search" @change="emit('search', search)" autocomplete="off"
        :ui="{ 
          icon: { 
            trailing: { 
              pointer: '' 
            },
            leading:{
              wrapper: 'flex items-center justify-center',
              pointer:''
            }
          } 
        }">
        <template #trailing>
          <UButton v-show="!!search" :padded="false" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
            @click="search = ''; emit('search', '')" />
        </template>
        <template #leading>
          <UButton class="-ml-2" size="sm" color="none" variant="ghost" @click="activeInput = false" icon="i-heroicons-magnifying-glass-20-solid" />
        </template>
      </UInput>
    </transition>
    
    
  </template>
  
  <script setup>
  import lodash from 'lodash'; 
  const { debounce } = lodash; 
  const props = defineProps({
    isCollapse: {
      type: Boolean,
      default: false
    },
    modelValue:{
      type:String,
      default:''
    }
  })
  const emit = defineEmits(['update:modelValue'])
  const activeInput = ref(false)
  const debouncedEmit = debounce((value) => {
    emit('update:modelValue', value);
  }, 300);
  
  const search = computed({
    get: () => props.modelValue,
    set: (searchValue) => {
      debouncedEmit(searchValue)
    }
  })
  
  </script>