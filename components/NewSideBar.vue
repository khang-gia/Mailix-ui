<template>
    <div class="z-10">
      
      <div
          id="sidebar"
          ref="sidebar"
          class="flex flex-col z-50 left-0 top-0 static h-screen overflow-y-scroll no-scrollbar w-full shrink-0 bg-[#FFFFFF] 
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
  
        <div class="pt-3 hidden lg:inline-flex mt-auto text-slate-400 hover:text-slate-300 -translate-y-6">
          <!-- <div class="px-4 py-2">
            <button @click.prevent="toggleSidebar">
              <span class="sr-only">Expand / collapse sidebar</span>
              <UIcon name="mynaui:sidebar-solid" class="w-6 h-6">
  
              </UIcon>
            </button>
          </div> -->
        </div>
        <!-- <Footer v-show="sidebarOpen"></Footer> -->
      </div>
    </div>
  </template>
  
  <script setup>
    const { status, data } = useAuth()
   
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
  