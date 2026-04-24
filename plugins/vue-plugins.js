
import VueTailwindDatepicker from "vue-tailwind-datepicker"
import VueDragscroll from "vue-dragscroll"
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { VueDraggableNext } from 'vue-draggable-next'
import { createVfm } from 'vue-final-modal'
import {createI18n} from 'vue-i18n'
import en from '~/locales/en.json'
import vi from '~/locales/vi.json'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('vue-tailwind-datepicker', VueTailwindDatepicker)
    nuxtApp.vueApp.use(VueDragscroll)
    nuxtApp.vueApp.component('VCalendar', Calendar)
    nuxtApp.vueApp.component('VDatePicker', DatePicker)
    nuxtApp.vueApp.component('draggable', VueDraggableNext);
    const vfm = createVfm()
    nuxtApp.vueApp.use(vfm)

    // Restore saved locale from localStorage so it applies immediately on reload
    const savedLocale = (import.meta.client && localStorage.getItem('app_locale')) || 'vi'

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: savedLocale,
        fallbackLocale: 'vi',
        messages: {
            en,
            vi
        },
    })
    nuxtApp.vueApp.use(i18n)
    
    // Explicitly inject into global properties for SSR template access
    nuxtApp.vueApp.config.globalProperties.$t = i18n.global.t.bind(i18n.global)
    nuxtApp.vueApp.config.globalProperties.$i18n = i18n.global

    return {
        provide: {
            t: i18n.global.t.bind(i18n.global),
            tc: i18n.global.tc?.bind(i18n.global),
            n: i18n.global.n?.bind(i18n.global),
            d: i18n.global.d?.bind(i18n.global)
        }
    }
})