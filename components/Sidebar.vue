<template>
  <div class="drop-shadow-xl z-10">
    <div class="fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200" :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" aria-hidden="true"></div>
    
    <div
        id="sidebar"
        ref="sidebar"
        class="flex flex-col absolute z-50 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-16 lg:sidebar-expanded:!w-64 shrink-0 bg-white dark:bg-slate-800 py-4 transition-all duration-200 ease-in-out border-r dark:border-slate-700"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-64'"
      >
  
      <div class="flex justify-between mb-10 pr-3 sm:px-2">
        <button
            ref="trigger"
            class="lg:hidden text-slate-500 hover:text-slate-400"
            @click.stop="$emit('close-sidebar')"
            aria-controls="sidebar"
            :aria-expanded="sidebarOpen"
          >
            <span class="sr-only">Close sidebar</span>
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        <NuxtLink class="block" to="/">
          <img v-if="sidebarOpen"  class="block max-h-12 h-12 h-auto" src="/images/tttmailserver-wide.webp" alt="Logo" />
          <img v-else class="block max-h-12 h-auto" src="/images/tttmailserver.webp" alt="Logo Small" />
          
        </NuxtLink>
      </div>

      <div v-if="!blank" class="space-y-8">
        <div>
          <ul>
            <SidebarLink link="/dashboard" icon="octicon:apps-16" text="Trang chủ" :sidebarExpanded="sidebarOpen" />
            <!-- <SidebarLink link="/dien-bien-thi-truong" icon="tabler:gauge" text="Diễn biến thị trường" :sidebarExpanded="sidebarOpen"/>
            <SidebarLink link="/thong-ke-nganh" icon="mdi:finance" text="Thống kê ngành" :sidebarExpanded="sidebarOpen"/>
            <SidebarLink link="/danh-muc" icon="mdi:format-list-bulleted-triangle" text="Danh mục" :sidebarExpanded="sidebarOpen"/> -->
            <SidebarLink link="/nhan-su" icon="heroicons:users" text="Nhân sự" :sidebarExpanded="sidebarOpen"/>
            <SidebarLink link="/bai-viet" icon="heroicons:newspaper" text="Bài viết" :sidebarExpanded="sidebarOpen"/>
            <!-- <SidebarLink link="/mo-tkck" icon="heroicons:identification" text="Mở TK" :sidebarExpanded="sidebarOpen" iconColor="text-orange-500 hover:text-orange-400"/> -->
            <SidebarLink link="https://abcd" icon="bi:book" text="Diễn đàn 123" :sidebarExpanded="sidebarOpen" target="_blank"/>
            
          </ul>
        </div>
      </div>

      <div class="pt-3 hidden lg:inline-flex justify-end mt-auto text-slate-400 hover:text-slate-300 -translate-y-6">
        <div class="px-4 py-2">
          <button @click.prevent="toggleSidebar">
            <span class="sr-only">Expand / collapse sidebar</span>
            <svg class="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
              <path class="" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
              <path class="" d="M3 23H1V1h2z" />
            </svg>
          </button>
        </div>
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
