<template>
  <div class="relative inline-flex hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-900 rounded-lg">
    <UPopover v-model:open="isOpen">
      <UChip :show="hasNewNotification || hasNewSysNotification || hasNewUserNoti">
        <UButton variant="link" color="gray" icon="i-heroicons-bell" aria-label="notification" />
      </UChip>
      <template #panel>
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-1.5 rounded overflow-hidden w-80">
          <div class="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-2 flex justify-between border-b border-slate-200 dark:border-slate-600">
            <div class="flex">
              <UChip :show="hasNewNotification">
                <a href="#" class="col-1" :class="{'text-primary-500': active==1}" @click.stop="showNotiWithType(1)" title="Bài viết">
                  <UIcon name="i-heroicons-newspaper-16-solid" class="w-4 h-4" />
                </a>
              </UChip>
              <hr class="w-px h-4 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 mx-2" />
              <UChip :show="hasNewSysNotification">
                <a href="#" class="col-1" :class="{'text-primary-500': active==2}" @click.stop="showNotiWithType(2)" title="Hệ thống">
                   <UIcon name="i-heroicons-cpu-chip-16-solid" class="w-4 h-4" />
                </a> 
              </UChip>
              <hr class="w-px h-4 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 mx-2" />
              <UChip :show="hasNewUserNoti">
                <a href="#" class="col-1" :class="{'text-primary-500': active==3}" @click.stop="showNotiWithType(3)" title="Công việc">
                   <UIcon name="i-heroicons-briefcase-16-solid" class="w-4 h-4" />
                </a> 
              </UChip>
            </div>
            <div>
              <a href="#" class="font-normal" @click.stop="markAllRead">
                <Icon name="tabler:checks"></Icon>
                Đã đọc
              </a>
            </div>
          </div>

          <div class="p-2 overflow-y-auto" style="max-height: calc(100svh - 150px);">
            <!-- Articles Tab -->
            <div v-if="active===1">
              <div v-if="!notifications?.results?.length">
                Hiện tại chưa có thông báo nào!
              </div>
              <div v-else>
                <div v-for="noti in notifications.results" :key="noti.id" class="border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0">
                  <div class="font-bold">{{noti.title}}</div>
                  <span class="block text-sm">{{noti.message}}</span>
                  <div class="flex justify-between text-xs mt-1">
                    <div>
                      <Icon name="heroicons:calendar-16-solid"></Icon>
                      {{new Date(noti.created_at).toLocaleDateString()}}
                    </div>
                    <NuxtLink v-if="noti.link_to" :to="`/bai-viet${noti.link_to}`" class="text-primary-500" @click="isOpen=false">
                      <Icon name="heroicons:eye"></Icon>
                      Xem
                    </NuxtLink>
                  </div> 
                </div>
              </div>
            </div>

            <!-- System Tab -->
            <div v-if="active===2">
              <div v-if="!sysNotifications?.results?.length">
                Hiện tại chưa có thông báo mới!
              </div>
              <div v-else>
                <div v-for="noti in sysNotifications.results" :key="noti.id" class="border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0">
                  <div class="font-bold">📣 {{noti.title}}</div>
                  <span class="block text-sm" v-html="noti.message"></span>
                  <div class="flex justify-between text-xs mt-1">
                    <div>
                      <Icon name="heroicons:calendar-16-solid"></Icon>
                      {{new Date(noti.created_at).toLocaleDateString()}}
                    </div>
                    <NuxtLink v-if="noti.link_to" :to="noti.link_to" class="text-primary-500" @click="isOpen=false">
                      <Icon name="heroicons:link-16-solid"></Icon>
                      Thử ngay
                    </NuxtLink>
                  </div> 
                </div>
              </div>
            </div>

            <!-- Tasks Tab -->
            <div v-if="active===3">
              <div v-if="!userNotifications?.results?.length">
                Hiện tại chưa có thông báo nào!
              </div>
              <div v-else>
                <div v-for="noti in userNotifications.results" :key="noti.id" 
                  class="group border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0 p-1.5 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative"
                  :class="{'bg-primary-50 dark:bg-primary-900/10': !noti.is_read}"
                  @click="markAsReadAndNavigate(noti)"
                >
                  <div class="font-bold flex items-start gap-1 pr-6">
                    <UIcon name="i-heroicons-bell-alert" class="mt-1 flex-shrink-0 text-primary-500" v-if="!noti.is_read" />
                    {{noti.title}}
                  </div>
                  <span class="block text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{noti.message}}</span>
                  
                  <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <div class="flex items-center gap-1">
                      <Icon name="heroicons:calendar-16-solid" class="w-3 h-3"></Icon>
                      {{new Date(noti.created_at).toLocaleDateString()}}
                    </div>
                    
                    <UButton
                      v-if="!noti.is_read"
                      icon="i-heroicons-check-circle"
                      size="2xs"
                      color="primary"
                      variant="ghost"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      @click.stop="toggleRead(noti)"
                    />
                  </div>
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
import { useViewStore } from '@/stores/view'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

const dayjs = useDayjs()
const toast = useToast()
const viewStore = useViewStore()
const { readTime } = storeToRefs(viewStore)
const router = useRouter()
const config = useRuntimeConfig()

const props = defineProps({})
  
const active = ref(3)
const isOpen = ref(false)

const {data: sysNotifications, refresh: refreshSys} = await useAPI().get('/core/system_notifications/')
const {data: notifications, refresh: refreshConsult} = await useAPI().get('/consult/notifications/')
const {data: userNotifications, refresh: refreshUser} = await useAPI().get('/core/user_notifications/')

// WebSocket Setup
let socket = null
const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const token = useCookie('auth:token').value
  
  // Use :8000 for local dev, or the domain + /hrm prefix for production
  const isDev = process.dev || window.location.port === '3001' || window.location.hostname === 'localhost'
  const path = isDev ? ':8000/ws/notifications/' : '/hrm/ws/notifications/'
  const host = window.location.hostname
  
  const wsUrl = `${protocol}//${host}${path}?token=${token}`
  
  socket = new WebSocket(wsUrl)
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('WS Notification:', data)
    
    // Refresh the task notifications
    refreshUser()
    
    // Show a toast for the new notification
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
  
  socket.onclose = (e) => {
    console.log('WS closed. Reconnecting in 5s...', e.reason)
    setTimeout(connectWebSocket, 5000)
  }
  
  socket.onerror = (err) => {
    console.error('WS Error:', err)
    socket.close()
  }
}

const hasNewNotification = computed(() => {
  const latest = notifications.value?.results?.[0]
  if (latest) {
    if (!readTime.value) return true  
    return new Date(readTime.value) < new Date(latest.created_at)
  }
  return false
})

const hasNewSysNotification = computed(() => {
  const latest = sysNotifications.value?.results?.[0]
  if (latest) {
    if (!readTime.value) return true  
    return new Date(readTime.value) < new Date(latest.created_at)
  }
  return false
})

const hasNewUserNoti = computed(() => {
  return _.some(userNotifications.value?.results, (item) => !item.is_read)
})
  
const showNotiWithType = (val) => {
  active.value = val
  markRead(val)
}

const markRead = async (val) => {
  if (val === 1) {
    const latest = notifications.value?.results?.[0]
    if (latest && (latest.created_at > readTime.value || !readTime.value)) {
      viewStore.setReadTime(latest.created_at)
    }
  } else if (val === 2) {
    const latest = sysNotifications.value?.results?.[0]
    if (latest && (latest.created_at > readTime.value || !readTime.value)) {
      viewStore.setReadTime(latest.created_at)
    }
  } else if (val === 3) {
    if (hasNewUserNoti.value) {
      await useAPI().post('/core/user_notifications/mark_all_read/')
      refreshUser()
    }
  }
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

const markAllRead = async () => {
  markRead(1)
  markRead(2)
  await markRead(3)
}

onMounted(() => {
  connectWebSocket()
})

onBeforeUnmount(() => {
  if (socket) socket.close()
})
</script>