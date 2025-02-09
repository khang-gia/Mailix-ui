import Numeral from 'numeral'

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            numeralFormat: (any) => {
                return Numeral(any)
            }
        }
    }
})