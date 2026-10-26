import { defineStore } from 'pinia'

/**
 * RBAC Permissions Store
 *
 * Loads and caches all permissions granted to the current user's groups.
 * Call `load()` once after login (after user info is fetched).
 *
 * The store builds a flat lookup map keyed by "url:action" for O(1) checks.
 *
 * Example:
 *   permissionsStore.can('/api/v1/core/employees/', 'list')   // true / false
 *   permissionsStore.canAny('/api/v1/core/employees/', ['create', 'update'])
 */
export const usePermissionsStore = defineStore('permissions', () => {
  // Internal lookup map: "url:action" → true
  const _map = ref<Record<string, boolean>>({})
  const isLoaded = ref(false)
  const isLoading = ref(false)

  /**
   * Load permissions from the backend.
   * Fetches GET /system/permissions/my-permissions/ and builds the lookup map.
   * Idempotent: skips if already loaded.
   */
  async function load(forceReload = false) {
    if (isLoaded.value && !forceReload) return
    if (isLoading.value) return

    isLoading.value = true

    try {
      const { $get } = useAPI()
      const data = await $get('/system/permissions/my-permissions/') as Array<{
        url: string
        action: string
        category: string | null
      }>

      const map: Record<string, boolean> = {}
      for (const perm of data) {
        if (perm.url && perm.action) {
          map[`${perm.url}:${perm.action}`] = true
        }
      }

      _map.value = map
      isLoaded.value = true
    } catch (err) {
      console.warn('[PermissionsStore] Failed to load permissions:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if the user has a specific permission.
   * @param url     - API URL prefix (e.g. '/api/v1/core/employees/')
   * @param action  - DRF action (e.g. 'list', 'create', 'update', 'destroy', 'retrieve')
   */
  function can(url: string, action: string): boolean {
    return _map.value[`${url}:${action}`] === true
  }

  /**
   * Check if the user has ANY of the given actions for a URL.
   */
  function canAny(url: string, actions: string[]): boolean {
    return actions.some(a => can(url, a))
  }

  /**
   * Check if the user has ALL of the given actions for a URL.
   */
  function canAll(url: string, actions: string[]): boolean {
    return actions.every(a => can(url, a))
  }

  /**
   * Clear all cached permissions (call on logout).
   */
  function clear() {
    _map.value = {}
    isLoaded.value = false
    isLoading.value = false
  }

  return {
    isLoaded,
    isLoading,
    load,
    can,
    canAny,
    canAll,
    clear,
  }
})
