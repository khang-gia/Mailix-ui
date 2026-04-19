<template>
  <div class="relative inline-flex hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-900 rounded-lg">
    <UPopover v-model:open="isOpen">
      <UChip :show="hasNewUserNoti">
        <UButton variant="link" color="gray" icon="i-heroicons-bell" aria-label="notification" />
      </UChip>
      <template #panel>
        <div
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-1.5 rounded overflow-hidden w-80">
          <div
            class="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-2 flex justify-between border-b border-slate-200 dark:border-slate-600">
            <div class="flex">
              <UChip :show="hasNewContactNoti">
                <a href="#" class="col-1" :class="{ 'text-primary-500': active == 2 }" @click.stop="showNotiWithType(2)"
                  :title="$t('Contact')">
                  <UIcon name="bxs:contact" class="w-4 h-4" />
                </a>
              </UChip>
              <hr class="w-px h-4 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 mx-2" />
              <UChip :show="hasNewCustomerNoti">
                <a href="#" class="col-1" :class="{ 'text-primary-500': active == 3 }" @click.stop="showNotiWithType(3)"
                  :title="$t('Customer')">
                  <UIcon name="ix:customer" class="w-4 h-4" />
                </a>
              </UChip>
              <hr class="w-px h-4 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 mx-2" />
              <UChip :show="hasNewWorkNoti">
                <a href="#" class="col-1" :class="{ 'text-primary-500': active == 1 }" @click.stop="showNotiWithType(1)"
                  :title="$t('Work')">
                  <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                </a>
              </UChip>
            </div>
            <div>
              <a href="#" class="font-normal" @click.stop="markAllRead">
                <Icon name="tabler:checks"></Icon>{{ $t('Read') }}</a>
            </div>
          </div>

          <div class="p-2 overflow-y-auto" style="max-height: calc(100svh - 150px);">
            <!-- List Items -->
            <div v-if="!filteredNotifications?.length">{{ $t('No notifications yet!') }}</div>
            <div v-else>
              <div v-for="noti in filteredNotifications" :key="noti.id"
                class="group border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0 p-1.5 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative"
                :class="{ 'bg-primary-50 dark:bg-primary-900/10': !noti.is_read }" @click="markAsReadAndNavigate(noti)">
                <div class="font-bold flex items-start gap-1 pr-6">
                  <UIcon name="i-heroicons-bell-alert" class="mt-1 flex-shrink-0 text-primary-500"
                    v-if="!noti.is_read" />
                  {{ noti.title }}
                </div>
                <span class="block text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ noti.message }}</span>

                <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:calendar-16-solid" class="w-3 h-3"></Icon>
                    {{ new Date(noti.created_at).toLocaleDateString() }}
                  </div>

                  <UButton v-if="!noti.is_read" icon="i-heroicons-check-circle" size="2xs" color="primary"
                    variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="toggleRead(noti)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup>
import _ from 'lodash'

const toast = useToast()
const router = useRouter()

const active = ref(1) // Default to Work
const isOpen = ref(false)

const { data: userNotifications, refresh: refreshUser } = await useAPI().get('/core/user_notifications/')

// Filtered notifications based on active tab
const filteredNotifications = computed(() => {
  return _.filter(userNotifications.value?.results, (noti) => noti.notification_type === active.value)
})

// WebSocket Setup
let socket = null
const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const token = useCookie('auth:token').value

  const isDev = process.dev || window.location.port === '3001' || window.location.hostname === 'localhost'
  const path = isDev ? ':8000/ws/notifications/' : '/hrm/ws/notifications/'
  const host = window.location.hostname

  const wsUrl = `${protocol}//${host}${path}?token=${token}`

  socket = new WebSocket(wsUrl)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('WS Notification:', data)

    // Refresh the notifications
    refreshUser()

    // Show a toast for the new notification if it's not silent and haven't toasted it 
    // recently in any tab (session-based de-duplication)
    const toastKey = `noti_toasted_${data.id}`
    const isAlreadyToasted = localStorage.getItem(toastKey)

    if (data.should_toast !== false && !isAlreadyToasted) {
      // Mark as toasted for 30 seconds across all tabs
      localStorage.setItem(toastKey, 'true')
      setTimeout(() => localStorage.removeItem(toastKey), 30000)

      toast.add({
        title: data.title || 'Thông báo mới',
        description: data.message,
        icon: 'i-heroicons-bell-alert',
        timeout: 10000,
        click: () => {
          if (data.link_to) router.push(data.link_to)
        }
      })
    }
  }

  socket.onclose = (e) => {
    console.log('WS closed. Reconnecting in 5s...', e.reason)
    setTimeout(connectWebSocket, 5000)
  }

  socket.onerror = (err) => {
    console.error('WS Error:', err)
    socket.close()
  }
}

const hasNewUserNoti = computed(() => {
  return _.some(userNotifications.value?.results, (item) => !item.is_read)
})

const hasNewWorkNoti = computed(() => {
  return _.some(userNotifications.value?.results, (item) => !item.is_read && item.notification_type === 1)
})

const hasNewContactNoti = computed(() => {
  return _.some(userNotifications.value?.results, (item) => !item.is_read && item.notification_type === 2)
})

const hasNewCustomerNoti = computed(() => {
  return _.some(userNotifications.value?.results, (item) => !item.is_read && item.notification_type === 3)
})

const showNotiWithType = (val) => {
  active.value = val
}

const markAllRead = async () => {
  await useAPI().post(`/core/user_notifications/mark_all_read/?notification_type=${active.value}`)
  refreshUser()
}

const toggleRead = async (noti) => {
  await useAPI().put(`/core/user_notifications/${noti.id}/`, { ...noti, is_read: !noti.is_read })
  refreshUser()
}

const markAsReadAndNavigate = async (noti) => {
  if (!noti.is_read) {
    await useAPI().put(`/core/user_notifications/${noti.id}/`, { ...noti, is_read: true })
    refreshUser()
  }
  isOpen.value = false
  if (noti.link_to) {
    router.push(noti.link_to)
  }
}

onMounted(() => {
  connectWebSocket()
})

onBeforeUnmount(() => {
  if (socket) socket.close()
})
</script>