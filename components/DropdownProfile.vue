<template>
  <div class="relative inline-flex">
    <UDropdown :items="items" :popper="{ placement: 'bottom-end', offsetDistance: 10 }">
      <button
        class="inline-flex justify-center items-center group transition-transform duration-200 active:scale-95"
        aria-haspopup="true"
        aria-label="profile"
      >
        <UAvatar
          :src="userInfo?.avatar"
          :alt="userInfo?.display_name"
          size="sm"
          class="ring-2 ring-white dark:ring-gray-800 shadow-sm transition-shadow group-hover:shadow-md"
        />
      </button>

      <!-- Custom header slot -->
      <template #header>
        <div class="px-4 py-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="userInfo?.avatar"
              :alt="userInfo?.display_name"
              size="lg"
              class="ring-2 ring-primary-500/20"
              :ui="{ rounded: 'rounded-md' }"
            />
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ userInfo?.display_name }}</span>
              <span v-if="userInfo?.profile_hr?.department?.name" class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {{ userInfo.profile_hr.department.name }}
              </span>
              <span v-if="userInfo?.profile_hr?.position?.name" class="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                {{ userInfo.profile_hr.position.name }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- Languages item: uses UPopover as a flyout submenu -->
      <template #languages-item="{ item }">
        <UPopover
          :popper="{ placement: 'left-start', offsetDistance: 4 }"
          mode="hover"
          class="w-full"
          :ui="{ trigger: 'w-full' }"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-language" class="w-4 h-4 flex-shrink-0" />
              <span>{{ item.label }}</span>
            </div>
            <div class="flex items-center gap-1.5 ml-auto">
              <span class="text-[10px] font-bold text-gray-400 uppercase">{{ locale }}</span>
              <UIcon name="i-heroicons-chevron-right" class="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <template #panel="{ close }">
            <div class="py-1 min-w-[160px]">
              <button
                v-for="lang in languages"
                :key="lang.key"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="locale === lang.key ? 'text-primary-500 font-medium' : 'text-gray-700 dark:text-gray-300'"
                @click="updateLanguage(lang.key); close()"
              >
                <UIcon :name="lang.icon" class="w-4 h-4 flex-shrink-0" />
                <span>{{ lang.label }}</span>
                <UIcon v-if="locale === lang.key" name="i-heroicons-check" class="w-4 h-4 ml-auto text-primary-500" />
              </button>
            </div>
          </template>
        </UPopover>
      </template>
    </UDropdown>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'

const modalStore = useModalStore()
const { setFeedbackModal } = modalStore
const { t, locale } = useI18n()
const api = useAPI()
const userStore = useUserStore()
const route = useRoute()

const { signOut: signOutFunc, data: userInfo } = useAuth()

const languages = [
  { label: 'Tiếng Việt', key: 'vi', icon: 'i-circle-flags:vn' },
  { label: 'English', key: 'en', icon: 'i-circle-flags:us' },
]

const updateLanguage = async (langCode) => {
  locale.value = langCode
  // Persist immediately so F5 reload restores the correct locale before API resolves
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('app_locale', langCode)
  }

  if (userInfo.value?.profile_hr?.id) {
    try {
      await api.patch(`core/profile_hrs/${userInfo.value.profile_hr.id}/`, {
        locale: langCode
      })
    } catch (e) {
      console.error('Failed to save language preference:', e)
    }
  }
}

const items = computed(() => [
  [
    {
      label: t('Account'),
      icon: 'i-heroicons-user',
      click: () => useRouter().push('/me')
    },
  ],
  [
    {
      label: t('Languages'),
      slot: 'languages-item',
    },
  ],
  [
    {
      label: t('Logout'),
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => signOut()
    }
  ]
])

const signOut = async () => {
  try {
    await $fetch('/api/v1/auth/logout/', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.apiBase
    })
  } catch (error) {
    console.error('Logout error:', error)
  }

  signOutFunc({ callbackUrl: route.name })
  reloadNuxtApp()
}
</script>