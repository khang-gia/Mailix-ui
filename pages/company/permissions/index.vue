<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Page Header -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 pb-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="py-8">
                    <h1 class="text-3xl font-bold text-white">Phân quyền hệ thống</h1>
                    <p class="mt-2 text-primary-100">Quản lý quyền truy cập cho các nhóm người dùng</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8 -mt-24">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Phân quyền hệ thống</h3>
                        <UButton v-if="!loading && resourceList.length > 0" icon="i-heroicons-arrow-path" size="sm"
                            variant="soft" @click="reload++">
                            Làm mới
                        </UButton>
                    </div>
                </template>

                <!-- Group Resource Tabs -->
                <div v-if="groupResources.length > 0" class="mb-6">
                    <!-- Custom Tab Bar with per-item toggle -->
                    <div class="flex flex-wrap items-center gap-1 border-b border-gray-200">
                        <template v-for="(tab, index) in groupResourceTabs" :key="tab.id">
                            <div class="group flex items-center gap-1 px-3 py-2 text-sm font-medium cursor-pointer border-b-2 transition-all -mb-px"
                                :class="[
                                    hiddenTabs.has(tab.id) ? 'border-transparent text-gray-300 opacity-50' : (
                                        currentTab === index
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )
                                ]" @click="onTabClick(tab.id, index)">
                                <span>{{ tab.label }}</span>
                                <button
                                    class="ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-gray-100"
                                    :title="hiddenTabs.has(tab.id) ? 'Hiện tab này' : 'Ẩn tab này'"
                                    @click.stop="toggleTabVisibility(tab.id)">
                                    <UIcon :name="hiddenTabs.has(tab.id) ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                        class="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Permission Table -->
                <div v-if="!loading && resourceList.length > 0">
                    <SystemPermissionTable :data="resourceList" :columns="groupList" @updated="onPermissionUpdate" />
                </div>

                <!-- Loading State -->
                <div v-else-if="loading" class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <UIcon name="i-heroicons-arrow-path"
                            class="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
                        <p class="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                    <UIcon name="i-heroicons-shield-exclamation" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
                    <p class="text-gray-500">Chưa có tài nguyên nào để phân quyền</p>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'

// Composables
const api = useAPI()
const toast = useToast()

// State
const currentTab = ref(0)
const HIDDEN_TABS_KEY = 'permissions_hidden_tabs'
const hiddenTabIds = ref<string[]>(JSON.parse(localStorage.getItem(HIDDEN_TABS_KEY) || '[]'))
const hiddenTabs = computed(() => new Set(hiddenTabIds.value))
const reload = ref(0)
const loading = ref(false)

// Computed
const params = computed(() => {
    const selectedGroup = groupResources.value[currentTab.value]
    return {
        page_size: 200,
        group_resource: selectedGroup?.group || 'hr'
    }
})

const groupResourceTabs = computed(() => {
    return groupResources.value.map((gr: any, index: number) => ({
        label: gr.name,
        value: index,
        id: String(gr.id)
    }))
})

// Fetch group resources using computedAsync
const groupResources = computedAsync(async () => {
    const _ = reload.value
    try {
        const data = await api.$get('/system/group_resources/') as any
        return data?.results || data || []
    } catch (error: any) {
        console.error('Error fetching group resources:', error)
        toast.add({
            title: 'Lỗi',
            description: 'Không thể tải danh sách nhóm tài nguyên',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle'
        })
        return []
    }
}, [])

// Fetch groups using computedAsync
const groupList = computedAsync(async () => {
    const _ = reload.value
    try {
        const data = await api.$get('/system/groups/', { page_size: 50, fixed_group: true }) as any
        return data?.results || data || []
    } catch (error: any) {
        console.error('Error fetching groups:', error)
        toast.add({
            title: 'Lỗi',
            description: 'Không thể tải danh sách nhóm người dùng',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle'
        })
        return []
    }
}, [])

// Fetch resources using computedAsync - reacts to params changes
const resourceList = computedAsync(async () => {
    const _ = reload.value
    const currentParams = params.value

    if (!currentParams.group_resource) return []

    loading.value = true
    try {
        const data = await api.$get('/system/api_resources/', currentParams) as any
        return data?.results || data || []
    } catch (error: any) {
        console.error('Error fetching resources:', error)
        toast.add({
            title: 'Lỗi',
            description: 'Không thể tải danh sách tài nguyên API',
            color: 'red',
            icon: 'i-heroicons-exclamation-circle'
        })
        return []
    } finally {
        loading.value = false
    }
}, [])

// Methods
const onPermissionUpdate = async (group_resource: any) => {
    reload.value++
}

const onTabChange = (index: number) => {
    currentTab.value = index
}

const onTabClick = (tabId: string, index: string | number) => {
    if (!hiddenTabs.value.has(tabId)) {
        currentTab.value = Number(index)
    }
}

const toggleTabVisibility = (tabId: string) => {
    const ids = [...hiddenTabIds.value]
    const idx = ids.indexOf(tabId)
    if (idx === -1) {
        ids.push(tabId)
        // If we just hid the active tab, switch to the first visible one
        const activeTabId = groupResourceTabs.value[currentTab.value]?.id
        if (activeTabId === tabId) {
            const firstVisible = groupResourceTabs.value.findIndex(
                (t: any) => !ids.includes(t.id)
            )
            if (firstVisible !== -1) currentTab.value = firstVisible
        }
    } else {
        ids.splice(idx, 1)
    }
    hiddenTabIds.value = ids
    localStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify(ids))
}

// Page Meta
definePageMeta({
    title: 'Phân quyền hệ thống',
    description: 'Quản lý quyền truy cập cho các nhóm người dùng'
})
</script>

<style scoped>
/* Remove custom styles - using Tailwind + NuxtUI */
</style>
