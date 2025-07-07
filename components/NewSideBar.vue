<template>
    <div class="z-10">
      
      <div
          id="sidebar"
          ref="sidebar"
          :class="isSidebarOpen ? 'w-full' : 'w-14'"
          class="flex flex-col z-50 left-0 top-0 static h-screen overflow-y-scroll no-scrollbar shrink-0 bg-[#FFFFFF] 
          dark:bg-titaca-sb-dark-bg py-4 transition-all duration-200 ease-in-out border-r dark:border-slate-700 dark:text-titaca-sb-dark-text"
        >
    
        <div class="flex justify-center mb-2 pr-3 sm:px-2">
          <NuxtLink class="block" to="/">
            <img v-if="sidebarOpen"  class="block max-h-12 h-auto" src="/images/tttmailserver-wide.webp" alt="Logo" />
            <img v-else class="block max-h-12 h-auto" src="/images/logo/positive/logo.png" alt="Logo Small" />
          </NuxtLink>
        </div>
  
        <div v-if="!blank" class="space-y-4 ml-0">
            <NewSidebarLink/>
        </div>
  
        <div class="flex justify-end pt-3 mt-auto text-slate-400 hover:text-slate-300 -translate-y-6">
          <div class="py-2">
            <UButton color="gray" variant="soft" @click.prevent="setSidebar">
              <UIcon :name="isSidebarOpen ? 'heroicons:chevron-left': 'heroicons:chevron-right'" >
  
              </UIcon>
            </UButton>
          </div>
        </div>
        <!-- <Footer v-show="sidebarOpen"></Footer> -->
      </div>
    </div>
  </template>
  
  <script setup>
    const { status, data } = useAuth()
    import {useUserStore } from '@/stores/user'
    const userStore = useUserStore()
    const {setSidebar} = userStore
    import { storeToRefs } from 'pinia'
    const { isSidebarOpen } = storeToRefs(userStore)

    const trigger = ref(null)
    const sidebar = ref(null)
    const props = defineProps({
      sidebarOpen: {
        type: Boolean,
        default: false,
      },
      blank: {
        type: Boolean,
        default: false,
      }
    })
    const emit = defineEmits(['close-sidebar', 'toggle-sidebar'])
    
    const isAuthenticated = computed( () => {
      return status.value === 'authenticated'
    }) 
    
    
    // close on click outside
    const clickHandler = ({ target }) => {
      if (!sidebar.value || !trigger.value) return
      if (
        !props.sidebarOpen ||
        sidebar.value.contains(target) ||
        trigger.value.contains(target)
      ) return
      closeSidebar(true)
    }
  
    // close if the esc key is pressed
    const keyHandler = ({ keyCode }) => {
      if (!props.sidebarOpen || keyCode !== 27) return
      closeSidebar(true)
    }
  
    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }
  
    const closeSidebar = (clickOut=false) => {
      emit('close-sidebar', clickOut)
    }
  
    onMounted(() => {
      document.addEventListener('click', clickHandler)
      document.addEventListener('keydown', keyHandler)
    })
  
    onUnmounted(() => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('keydown', keyHandler)
    })
  
    watch(
      () => props.sidebarOpen,
      (n) => {
        if (n === true) {
          document.querySelector('body').classList.add('sidebar-expanded')
        } else {
          document.querySelector('body').classList.remove('sidebar-expanded')
        }
      }
    )
  
  </script>
  