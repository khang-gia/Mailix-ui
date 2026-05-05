<template>
  <!-- System Config Editor: full viewport, no outer app header -->
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-[#111827]">

    <!-- Top Bar -->
    <header
      class="flex items-center justify-between px-5 py-3 bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 shrink-0 shadow-sm z-10">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-primary-500" />
        <div>
          <h1 class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{{ $t('System Configuration') }}</h1>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ company?.name || '—' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UBadge v-if="hasChanges" color="amber" variant="soft" size="xs" class="animate-pulse">{{ $t('Unsaved changes') }}</UBadge>
        <UButton color="gray" variant="ghost" size="sm" @click="resetChanges" :disabled="!hasChanges || loading">
          {{ $t('Discard') }}
        </UButton>
        <UButton color="primary" size="sm" :loading="loading" @click="saveConfig" :disabled="!hasChanges">
          <UIcon name="i-heroicons-cloud-arrow-up" class="w-4 h-4 mr-1" />
          {{ $t('Save') }}
        </UButton>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-auto bg-gray-100 dark:bg-[#111827] justify-center p-6">
      <div class="max-w-3xl w-full">
        <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('Global Settings') }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('Manage system-wide configuration variables.') }}</p>
            </div>
        </div>

        <div v-if="loading && !configs.length" class="space-y-4">
            <USkeleton class="h-20 w-full" v-for="i in 4" :key="i" />
        </div>
        
        <div v-else class="space-y-4">
            <div v-for="config in configs" :key="config.key" class="bg-white dark:bg-[#1f2937] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{{ config.key }}</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ config.help_text || $t('No description provided.') }}</p>
                        
                        <div v-if="typeof config.default === 'boolean'">
                             <UToggle v-model="editedValues[config.key]" />
                        </div>
                        <div v-else>
                             <UInput v-model="editedValues[config.key]" class="w-full" :placeholder="String(config.default)" />
                        </div>
                    </div>
                    
                    <div class="shrink-0 text-right sm:w-32 flex flex-col justify-center h-full pt-6">
                        <span class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{{ $t('Default') }}</span>
                        <span class="text-xs font-mono text-gray-600 dark:text-gray-300 truncate" :title="String(config.default)">{{ String(config.default) || '—' }}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
const userStore = useUserStore()
const appStore = useAppStore()
const { company } = storeToRefs(userStore)
const toast = useToast()
const api = useAPI()

definePageMeta({
  title: 'System Configuration',
  layout: 'editor'
})

useHead({
  title: t('System Configuration')
})

const loading = ref(false)
const configs = ref([])
const editedValues = ref({})

// Check if any edited value differs from original
const hasChanges = computed(() => {
    return configs.value.some(config => {
        return editedValues.value[config.key] !== config.value
    })
})

const fetchConfig = async () => {
    loading.value = true
    try {
        const {data: response} = await useAPI().get('/system/admin-config/')
        if (response.value) {
            configs.value = response.value
            
            // Initialize edited values
            const values = {}
            response.value.forEach(item => {
                values[item.key] = item.value
            })
            editedValues.value = values
        }
    } catch (err) {
        console.error('Failed to fetch system config:', err)
        toast.add({
            title: t('Error'),
            description: err?.data?.detail || err?.message || t('Failed to fetch configuration.'),
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

const resetChanges = () => {
    const values = {}
    configs.value.forEach(item => {
        values[item.key] = item.value
    })
    editedValues.value = values
}

const saveConfig = async () => {
    if (!hasChanges.value) return
    
    // Prepare data
    const changedItems = configs.value
        .filter(config => editedValues.value[config.key] !== config.value)
        .map(config => ({
            key: config.key,
            value: editedValues.value[config.key]
        }))
        
    if (changedItems.length === 0) return

    loading.value = true
    try {
        const {data: response} = await useAPI().post('/system/admin-config/', changedItems)
        
        toast.add({ title: t('Success'), description: t('Configuration updated successfully.'), color: 'green' })
        
        // Refresh values
        await fetchConfig()
        
        // Update appStore with the latest MAIL_SERVER_URL if it was changed
        const mailUrlChange = changedItems.find(item => item.key === 'MAIL_SERVER_URL')
        if (mailUrlChange) {
            appStore.setSystemConfig({
                ...appStore.systemConfig,
                MAIL_SERVER_URL: mailUrlChange.value
            })
        }
        
    } catch (err) {
        console.error('Failed to update system config:', err)
        toast.add({
            title: t('Error'),
            description: err?.data?.detail || err?.message || t('Failed to update configuration.'),
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

fetchConfig()
</script>