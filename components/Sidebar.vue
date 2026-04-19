<template>
  <div class="z-10">
    
    <div
        id="sidebar"
        ref="sidebar"
        class="flex flex-col z-50 left-0 top-0 static h-screen overflow-y-scroll no-scrollbar w-full shrink-0 bg-[#FFFFFF] 
        dark:bg-titaca-sb-dark-bg py-4 transition-all duration-200 ease-in-out border-r dark:border-slate-700 dark:text-titaca-sb-dark-text"
      >
  
      <div class="flex justify-between mb-2 pr-3 sm:px-2">
        <NuxtLink class="block" to="/">
          <img v-if="sidebarOpen"  class="block max-h-12 h-auto" src="/images/tttmailserver-wide.webp" alt="Logo" />
          <img v-else class="block max-h-12 h-auto" src="/images/logo/positive/logo.png" alt="Logo Small" />
        </NuxtLink>
      </div>

      <div v-if="!blank" class="space-y-4 ml-0">
        <div>
          <ul>
            <!-- <SidebarLink link="/dashboard" icon="mage:dashboard-chart" activeIcon="mage:dashboard-chart-fill" text="Dashboard" /> -->
            <SidebarLink link="/me" icon="weui:me-outlined" activeIcon="weui:me-filled" text="Me" />

            <SidebarLink link="/hr" icon="heroicons:users" activeIcon="heroicons-solid:users" text="Nhân sự"/>
            <SidebarLink link="/customers" icon="ix:customer" activeIcon="ix:customer-filled" :text="$t('Customer')"/>
            <SidebarLink link="/contacts" icon="heroicons:phone" activeIcon="heroicons-solid:phone" :text="$t('Contact')"/>
            <SidebarLink link="/works" icon="heroicons:briefcase" activeIcon="heroicons-solid:briefcase" :text="$t('Work')"/>
            <!-- <SidebarLink link="/projects" icon="heroicons:folder" activeIcon="heroicons-solid:folder" text="Dự án"/> -->

            <!-- <SidebarLink link="/hr-insurance" icon="healthicons:insurance-card-outline" activeIcon="healthicons:insurance-card" text="Bảo hiểm"/> -->
            <!-- <SidebarLink link="/hr-contract" icon="material-symbols:contract-outline-rounded" activeIcon="material-symbols:contract-rounded" text="Hợp đồng"/> -->
            <!-- <SidebarLink link="/hr-decision" icon="mdi:approval" activeIcon="mdi:approval" text="Quyết định"/> -->
            <!-- <SidebarLink link="/timekeeping" icon="healthicons:i-schedule-school-date-time-outline" activeIcon="healthicons:i-schedule-school-date-time" text="Chấm công" /> -->
            
            <SidebarLink link="https://abcd" icon="heroicons:envelope" activeIcon="heroicons-solid:envelope" text="Email" target="_blank"/>
          </ul>
        </div>
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
