/**
 * usePermission composable
 *
 * Provides a unified interface for both Layer 1 (sidebar view lock) and
 * Layer 2 (RBAC action permissions) checks in any component.
 *
 * Usage:
 *   const { can, canAny, canSeeCategory, isLoaded } = usePermission()
 *
 *   // Layer 2 — RBAC action check
 *   can('/api/v1/core/employees/', 'create')        // show Create button?
 *   canAny('/api/v1/core/employees/', ['update', 'destroy'])
 *
 *   // Layer 1 — sidebar category visibility check
 *   canSeeCategory('hrm')     // is HRM category visible to this user?
 *   canSeeCategory('crm')
 */
export const usePermission = () => {
  const store = usePermissionsStore()
  const { data: userInfo } = useAuth()

  /**
   * Layer 1: Does the current user's department allow seeing this sidebar category?
   *
   * Checks department.resources codes (e.g. 'hrm', 'crm', 'workspace').
   * Returns true for superusers regardless of department resources.
   *
   * @param categoryCode - SystemResource code (e.g. 'hrm', 'crm', 'workspace', 'guide_mail')
   */
  function canSeeCategory(categoryCode: string): boolean {
    const user = userInfo.value
    if (!user) return false
    if (user.is_superuser) return true

    const resources: Array<{ code: string }> =
      user.profile_hr?.department?.resources ||
      user.profile_hr?.department?.group?.resources ||
      []

    return resources.some(r => r.code === categoryCode)
  }

  return {
    /** RBAC: check a single action */
    can: store.can,

    /** RBAC: check if any of the given actions are allowed */
    canAny: store.canAny,

    /** RBAC: check if all of the given actions are allowed */
    canAll: store.canAll,

    /** Layer 1: check sidebar category visibility */
    canSeeCategory,

    /** True once permissions have been loaded from the backend */
    isLoaded: computed(() => store.isLoaded),

    /** Trigger a (re)load of permissions — call after login */
    load: store.load,
  }
}
