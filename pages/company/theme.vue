<template>
  <!-- Shopify-style Theme Editor: full viewport, no outer app header -->
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-[#111827]">

    <!-- Top Bar -->
    <header
      class="flex items-center justify-between px-5 py-3 bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 shrink-0 shadow-sm z-10">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-paint-brush" class="w-5 h-5 text-primary-500" />
        <div>
          <h1 class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{{ $t('Theme Editor') }}</h1>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ company?.name || '—' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UBadge v-if="hasChanges" color="amber" variant="soft" size="xs" class="animate-pulse">{{ $t('Unsaved changes')
          }}</UBadge>
        <UButton color="gray" variant="ghost" size="sm" @click="resetPreviews" :disabled="!hasChanges">
          {{ $t('Discard') }}
        </UButton>
        <UButton color="primary" size="sm" :loading="loading" @click="saveTheme" :disabled="!hasChanges">
          <UIcon name="i-heroicons-cloud-arrow-up" class="w-4 h-4 mr-1" />
          {{ $t('Save') }}
        </UButton>
      </div>
    </header>

    <!-- Main Content: Sidebar + Preview -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Left Settings Panel -->
      <aside
        class="w-80 shrink-0 bg-white dark:bg-[#1f2937] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <!-- Section List Header -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{{ $t('Settings')
            }}</p>
        </div>

        <!-- Logo Section -->
        <div>
          <button
            class="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-left text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-b border-gray-100 dark:border-gray-700/60"
            @click="activeSection = activeSection === 'logo' ? null : 'logo'">
            <div class="flex items-center gap-2.5">
              <div
                class="w-7 h-7 rounded-md bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-photo" class="w-4 h-4 text-primary-500" />
              </div>
              <span>{{ $t('Logo') }}</span>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="activeSection === 'logo' ? 'rotate-90' : ''" />
          </button>

          <div v-show="activeSection === 'logo'"
            class="px-4 py-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-700">
            <!-- Logo Upload -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{{
                $t('Logo image') }}</p>
              <div
                class="relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all"
                :class="isDraggingLogo
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-gray-800'"
                @dragover.prevent="isDraggingLogo = true" @dragleave="isDraggingLogo = false" @drop.prevent="onLogoDrop"
                @click="$refs.logoInput.click()">
                <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="onLogoChange" />
                <img v-if="logoPreview" :src="logoPreview" alt="Logo"
                  class="max-h-16 max-w-full object-contain mb-3 rounded" />
                <UIcon v-else name="i-heroicons-arrow-up-tray" class="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p class="text-xs text-center text-gray-500 dark:text-gray-400">
                  <span class="text-primary-500 font-medium">{{ $t('Click to upload') }}</span>
                  {{ $t('or drag and drop') }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, SVG, JPG — {{ $t('max 2MB') }}</p>
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{{ $t('Recommended: 200×50 px or wider.') }}
              </p>
            </div>

            <UDivider />

            <!-- Favicon Upload -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{{
                $t('Favicon') }}</p>
              <div
                class="relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all"
                :class="isDraggingFavicon
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-gray-800'"
                @dragover.prevent="isDraggingFavicon = true" @dragleave="isDraggingFavicon = false"
                @drop.prevent="onFaviconDrop" @click="$refs.faviconInput.click()">
                <input ref="faviconInput" type="file" accept="image/*" class="hidden" @change="onFaviconChange" />
                <img v-if="faviconPreview" :src="faviconPreview" alt="Favicon"
                  class="w-12 h-12 object-contain mb-3 rounded" />
                <UIcon v-else name="i-heroicons-globe-alt" class="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p class="text-xs text-center text-gray-500 dark:text-gray-400">
                  <span class="text-primary-500 font-medium">{{ $t('Click to upload') }}</span>
                  {{ $t('or drag and drop') }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, ICO, SVG — {{ $t('max 1MB') }}</p>
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{{ $t('Recommended: 32×32 px.') }}</p>
            </div>

            <!-- Remove buttons if files are set -->
            <div v-if="selectedLogo || selectedFavicon" class="flex flex-col gap-1.5 pt-1">
              <UButton v-if="selectedLogo" size="xs" color="red" variant="ghost" icon="i-heroicons-x-mark"
                @click="selectedLogo = null">
                {{ $t('Remove new logo') }}
              </UButton>
              <UButton v-if="selectedFavicon" size="xs" color="red" variant="ghost" icon="i-heroicons-x-mark"
                @click="selectedFavicon = null">
                {{ $t('Remove new favicon') }}
              </UButton>
            </div>
          </div>
        </div>

        <!-- Placeholder sections (coming soon) -->
        <div v-for="section in comingSoonSections" :key="section.key">
          <div
            class="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-left text-gray-400 dark:text-gray-600 border-b border-gray-100 dark:border-gray-700/60">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <UIcon :name="section.icon" class="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </div>
              <span>{{ $t(section.label) }}</span>
            </div>
            <UBadge size="xs" color="gray" variant="soft">{{ $t('Soon') }}</UBadge>
          </div>
        </div>
      </aside>

      <!-- Right Preview Pane -->
      <main class="flex-1 overflow-auto bg-gray-100 dark:bg-[#111827] p-6">
        <div class="mb-4 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          <span>{{ $t('Live preview') }}</span>
        </div>

        <!-- Simulated App Shell Preview -->
        <div
          class="bg-white dark:bg-[#1f2937] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto"
          style="min-height: 480px;">

          <!-- Mock top bar -->
          <div
            class="flex items-center h-10 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 gap-2">
            <div class="flex gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <!-- Fake URL bar -->
            <div
              class="flex items-center gap-1.5 flex-1 mx-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 px-2 py-1 max-w-xs">
              <img v-if="faviconPreview" :src="faviconPreview" class="w-3 h-3 object-contain rounded-sm" />
              <UIcon v-else name="i-heroicons-globe-alt" class="w-3 h-3 text-gray-400" />
              <span class="text-xs text-gray-400 dark:text-gray-500 truncate">app.mailix.vn</span>
            </div>
          </div>

          <!-- Mock app layout -->
          <div class="flex" style="height: 440px;">
            <!-- Mock sidebar -->
            <div
              class="w-16 shrink-0 bg-white dark:bg-[#1a1a2e] border-r border-gray-100 dark:border-gray-700 flex flex-col items-center pt-4 gap-3 py-4">
              <!-- Logo icon in mini sidebar -->
              <div
                class="w-9 h-9 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden mb-1">
                <img v-if="faviconPreview" :src="faviconPreview" class="w-7 h-7 object-contain" />
                <UIcon v-else name="i-heroicons-squares-2x2" class="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
              <!-- Mock nav dots -->
              <div v-for="i in 5" :key="i" class="w-8 h-8 rounded-md flex items-center justify-center"
                :class="i === 1 ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'">
                <div class="w-4 h-1 rounded-full" :class="i === 1 ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'">
                </div>
              </div>
            </div>

            <!-- Mock expanded sidebar -->
            <div
              class="w-44 shrink-0 bg-white dark:bg-[#1a1a2e] border-r border-gray-100 dark:border-gray-700 flex flex-col pt-4 px-3 gap-2">
              <!-- Logo wide in expanded sidebar -->
              <div class="flex items-center justify-center h-10 mb-2">
                <img v-if="logoPreview" :src="logoPreview" class="max-h-8 max-w-full object-contain" />
                <div v-else class="text-xs text-gray-300 dark:text-gray-600 font-semibold tracking-wide">YOUR LOGO</div>
              </div>
              <!-- Mock menu items -->
              <div v-for="(label, i) in ['Dashboard', 'HR', 'CRM', 'Workspace', 'Company']" :key="label"
                class="flex items-center gap-2 px-2 py-1.5 rounded-md"
                :class="i === 0 ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'">
                <div class="w-3 h-3 rounded-sm" :class="i === 0 ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'">
                </div>
                <div class="text-xs font-medium">{{ $t(label) }}</div>
              </div>
            </div>

            <!-- Mock main content -->
            <div class="flex-1 flex flex-col bg-gray-50 dark:bg-[#111827] p-4 overflow-hidden">
              <div class="flex items-center justify-between mb-4">
                <div class="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <!-- Mock content blocks -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div v-for="i in 3" :key="i"
                  class="bg-white dark:bg-[#1f2937] rounded-lg h-16 border border-gray-100 dark:border-gray-700"></div>
              </div>
              <div class="bg-white dark:bg-[#1f2937] rounded-lg flex-1 border border-gray-100 dark:border-gray-700">
              </div>
            </div>
          </div>
        </div>

        <!-- Preview label -->
        <div class="text-center mt-3 text-xs text-gray-400 dark:text-gray-600">
          {{ $t('This preview reflects how your branding appears in the application.') }}
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const { company } = storeToRefs(userStore)
const toast = useToast()
const api = useAPI()

definePageMeta({
  title: 'Theme',
  layout: 'editor'
})

const loading = ref(false)
const activeSection = ref('logo') // Start with logo section open

// Drag state
const isDraggingLogo = ref(false)
const isDraggingFavicon = ref(false)

// Files selected for upload
const selectedLogo = ref(null)
const selectedFavicon = ref(null)

const hasChanges = computed(() => !!selectedLogo.value || !!selectedFavicon.value)

// Coming soon placeholder sections
const comingSoonSections = [
  { key: 'colors', label: 'Colors', icon: 'i-heroicons-swatch' },
  { key: 'typography', label: 'Typography', icon: 'i-heroicons-document-text' },
]

const logoLink = computed(() => {
  if (!company.value?.logo) return '/images/logo/positive/logo_name.png'
  const cacheBuster = company.value.updated_at ? new Date(company.value.updated_at).getTime() : Date.now()
  const sep = company.value.logo.includes('?') ? '&' : '?'
  return `${company.value.logo}${sep}v=${cacheBuster}`
})

const faviconLogoLink = computed(() => {
  if (!company.value?.favicon) return '/images/logo/positive/logo.png'
  const cacheBuster = company.value.updated_at ? new Date(company.value.updated_at).getTime() : Date.now()
  const sep = company.value.favicon.includes('?') ? '&' : '?'
  return `${company.value.favicon}${sep}v=${cacheBuster}`
})

const logoPreview = computed(() => {
  if (selectedLogo.value) return URL.createObjectURL(selectedLogo.value)
  return logoLink.value
})

const faviconPreview = computed(() => {
  if (selectedFavicon.value) return URL.createObjectURL(selectedFavicon.value)
  return faviconLogoLink.value
})

// File handlers
const onLogoChange = (event) => {
  const files = event.target?.files
  if (files?.length) selectedLogo.value = files[0]
}

const onFaviconChange = (event) => {
  const files = event.target?.files
  if (files?.length) selectedFavicon.value = files[0]
}

const onLogoDrop = (event) => {
  isDraggingLogo.value = false
  const files = event.dataTransfer?.files
  if (files?.length && files[0].type.startsWith('image/')) {
    selectedLogo.value = files[0]
  }
}

const onFaviconDrop = (event) => {
  isDraggingFavicon.value = false
  const files = event.dataTransfer?.files
  if (files?.length && files[0].type.startsWith('image/')) {
    selectedFavicon.value = files[0]
  }
}

const resetPreviews = () => {
  selectedLogo.value = null
  selectedFavicon.value = null
}

const saveTheme = async () => {
  if (!company.value?.id) {
    toast.add({ title: t('Error'), description: t('Company not found.'), color: 'red' })
    return
  }
  if (!hasChanges.value) {
    toast.add({ title: t('Info'), description: t('No changes to save.'), color: 'blue' })
    return
  }

  loading.value = true
  const formData = new FormData()
  if (selectedLogo.value) formData.append('logo', selectedLogo.value)
  if (selectedFavicon.value) formData.append('favicon', selectedFavicon.value)

  try {
    const { data, error } = await api.patch(`system/company/${company?.value?.id}/`, formData)
    if (error.value) throw error.value
    if (data.value) {
      userStore.setCompany({
        ...company.value,
        logo: data.value.logo,
        favicon: data.value.favicon,
        updated_at: data.value.updated_at
      })
      resetPreviews()
      toast.add({ title: t('Success'), description: t('Theme updated successfully.'), color: 'green' })
    }
  } catch (err) {
    console.error('Failed to update theme:', err)
    toast.add({
      title: t('Error'),
      description: err?.data?.detail || err?.message || t('Failed to update theme.'),
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>
