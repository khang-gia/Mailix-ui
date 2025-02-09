<template>
    <div class="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out" :class="widthClass">
        <div class="overflow-hidden" :class="widthClass">
            <header v-if="!hideTitle" class="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <h2 class="font-semibold text-slate-800 dark:text-slate-100 text-center flex">
                    <div class="flex-auto">
                        <slot name="title">{{ title }}</slot>
                    </div>
                    <slot name="action"></slot>
                </h2>
            </header>
            <div :class="bodyClass"> 
                <div v-if="loginRequired && !isAuthenticated"> 
                    <slot name="fakeContent"></slot>
                    <div class="text-center mt-3">Vui lòng
                        <button class="rounded text-primary-500 hover:underline" @click.prevent.stop="emitLogin">đăng nhập</button> để xem {{ requiredLoginSuffix }}.
                    </div>
                </div>
                <div v-else>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>    
</template>

<script setup>
    import { useModalStore } from '@/stores/modal'
    
    defineProps({
        hideTitle: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default () {
                return ''
            }
        },
        widthClass: {
            type: String,
            default () {
                return ''
            }
        },
        bodyClass: {
            type: String,
            default() {
                return 'px-1 py-2'
            }
        },
        loginRequired: {
            type: Boolean,
            default: false
        },
        requiredLoginSuffix: {
            type: String,
            default: 'thông tin'
        }
    })
    
    const modalStore = useModalStore()
    const { setAuthModal } = modalStore

    
    const isAuthenticated = computed(() => status.value === 'authenticated')
    const { status, data: userInfo } = useAuth()
    const emitLogin = () => {
        setAuthModal(true, 'signin')
    }
</script>
