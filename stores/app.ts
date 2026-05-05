import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    sidebarExpanded: false,
    sidebarAutoClose: false,
    appTitle: '',
    systemConfig: {} as Record<string, any>
  }),
  getters: {
    isLoading: (state) => state.loading,
    isSidebarExpanded: (state) => state.sidebarExpanded,
    isSidebarAutoClose: (state) => state.sidebarAutoClose,
    
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    setSidebarExpanded(expanded: boolean, autoClose: boolean = false) {
      this.sidebarExpanded = expanded
      if (expanded && autoClose) {
        this.sidebarAutoClose = true
      } else {
        this.sidebarAutoClose = false
      }
    },
    toggleSidebar() {
      this.setSidebarExpanded(!this.sidebarExpanded)
    },
    setAppTitle (_newTitle: string) {
      this.appTitle = _newTitle
    },
    setSystemConfig(config: Record<string, any>) {
      this.systemConfig = config
    }

  },
})