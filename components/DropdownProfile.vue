<template>
  <div class="relative inline-flex">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <button
        class="inline-flex justify-center items-center group"
        aria-haspopup="true"
        aria-label="profile"
      >
        <Avatar :size="32" variant="beam" :name="userInfo.email || userInfo.username" />
        <!-- <div class="flex items-center truncate">
          <span class="truncate ml-2 text-sm font-medium sm:max-w-12 md:max-w-20">
            {{ userInfo.display_name }}
          </span>
          <svg class="w-3 h-3 shrink-0 ml-1 fill-current" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div> -->
        <!-- <div class="flex items-center truncate" :class="vipColor">
          <span class="truncate ml-2 text-sm font-medium sm:max-w-12 md:max-w-20">
            <Icon  v-if="userInfo.profile.vip_level>0" name="solar:medal-ribbons-star-bold-duotone" size="20"></Icon>
            {{ userInfo.name }}
          </span>
          <svg class="w-3 h-3 shrink-0 ml-1 fill-current" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div> -->
      </button>
    </UDropdown>
    
  </div>
</template>

<script setup>
  import Avatar from "vue-boring-avatars"
  import { useModalStore } from '@/stores/modal'
  const modalStore = useModalStore()
  const { setFeedbackModal } = modalStore

  const route = useRoute()

  const { signOut: signOutFunc, data: userInfo } = useAuth()
  const items = ref([
    [{
      label: userInfo.value.display_name,
    }], [{
      label: 'Góp ý',
      icon: 'i-heroicons-hand-thumb-up',
      click: () => {
        setFeedbackModal(true)
      }
    }], [{
      label: 'Đăng xuất',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => {
        signOut()
      }
    }]
  ])

  const signOut = () => {
    signOutFunc({
      callbackUrl: route.name
    })
    reloadNuxtApp()
  }

  // const vipColor = computed(() => {
  //   switch (userInfo.value.profile.vip_level) {
  //     case 1: //silver
  //       return 'text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300'
  //     case 2: //gold
  //       return 'text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
  //     case 3: //diamond
  //       return 'text-green-500 group-hover:text-green-600 dark:group-hover:text-green-400' 
  //     case 4: // platinum
  //       return 'text-indigo-500 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-300'
      
  //   }
  //   return 'text-slate-800 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
  // })

  onMounted(() => {
    
  })
</script>