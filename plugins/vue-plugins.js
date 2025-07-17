
import VueTailwindDatepicker from "vue-tailwind-datepicker"
import VueDragscroll from "vue-dragscroll"
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { VueDraggableNext } from 'vue-draggable-next'
import { createVfm } from 'vue-final-modal'
import {createI18n} from 'vue-i18n'
import en from '~/locales/en.json'
import vi from '~/locales/vi.json'
import { useI18n } from "vue-i18n";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('vue-tailwind-datepicker', VueTailwindDatepicker)
    nuxtApp.vueApp.use(VueDragscroll)
    nuxtApp.vueApp.component('VCalendar', Calendar)
    nuxtApp.vueApp.component('VDatePicker', DatePicker)
    nuxtApp.vueApp.component('draggable', VueDraggableNext);
    const vfm = createVfm()
    nuxtApp.vueApp.use(vfm)  
    const i18n = createI18n({
        locale: 'vi',
        fallbackLocale: 'vi',
        messages: {
            en,
            vi
        },
    })
    nuxtApp.vueApp.use(i18n)
})