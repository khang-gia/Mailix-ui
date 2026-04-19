<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, watch, onMounted } from 'vue'
import { useI18n } from "vue-i18n";

const userStore = useUserStore()
const { company } = storeToRefs(userStore)

const { locale } = useI18n()
const { status, data: userData } = useAuth()
const api = useAPI()

const syncLocale = () => {
  if (userData.value?.profile_hr?.locale) {
    const lang = userData.value.profile_hr.locale
    locale.value = lang
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('app_locale', lang)
    }
  }
}

const fetchCompany = async () => {
  if (status.value !== 'authenticated') return
  try {
    const data = await api.$get('/system/company/', { limit: 1 })
    if (data && data.results && data.results.length > 0) {
      userStore.setCompany(data.results[0])
    }
  } catch (e) {
    console.error('Failed to fetch company setup', e)
  }
}

onMounted(() => {
  if (status.value === 'authenticated') {
    fetchCompany()
    syncLocale()
  }
})

watch(status, (newStatus) => {
  if (newStatus === 'authenticated') {
    fetchCompany()
    syncLocale()
  }
})

watch(userData, () => {
  if (status.value === 'authenticated') {
    syncLocale()
  }
}, { deep: true })

const faviconLink = computed(() => {
  if (!company.value?.favicon) return '/favicon.png'
  const cacheBuster = company.value.updated_at ? new Date(company.value.updated_at).getTime() : new Date().getTime()
  const sep = company.value.favicon.includes('?') ? '&' : '?'
  return `${company.value.favicon}${sep}v=${cacheBuster}`
})

useHead({
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      href: faviconLink.value
    }
  ]
})

watch(faviconLink, (newFav) => {
  if (process.client) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = newFav;
  }
}, { immediate: true })
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <NuxtPwaManifest />
    <NuxtSnackbar />
  </NuxtLayout>
</template>