<template>
    <div class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 dark:bg-[#182235] dark:border-slate-700 flex justify-between px-4 py-px">    
        <nav class="pl-14 relative w-full flex items-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E2E]">
            <ul class="items-center grid grid-flow-col w-full">
                <li class="w-auto flex" v-for="(link, index) in links" :key="index">
                    <div class="w-fit">
                        <UButton color="none" variant="ghost"
                            class="transition-all items-center truncate outline-none group relative rounded-md px-3 font-medium text-sm
                                focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2
                              focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75 before:absolute
                                before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 text-gray-500 dark:text-gray-400"
                                :class="current >= index ? 'active' : 'inactive'" @click="current = index" :trailing-icon="link.icon" :label="link.label">
                            <!-- <span class="text-sm font-sans">{{ link.label }}</span> -->
                            <!-- <UIcon v-if="link.icon" :name="link.icon" class="icon" :class="current === index ? 'active' : 'inactive'" /> -->
                            <!-- <UBadge color="gray" variant="solid" size="xs" class="px-1 py-0" :ui="{ rounded: 'rounded' }">{{ useUserStore() }}</UBadge> -->
                        </UButton>
                    </div>
                    
                    <UDivider v-if="index < links.length -1 " class="w-full transition-all ease-in-out duration-500" :ui="{
                      border: {
                        base: current > index ? 'border-[#147FE0] dark:border-gray-200 transition-all ease-in-out duration-300' : 'transition-all ease-in-out duration-500 border-gray-200 dark:border-gray-800',
                      }
                    }"/>
                </li>
                
            </ul>
        </nav>
    </div>
</template>
  
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const current = defineModel({ default: 0 })
const links = [{
  label: t('Curriculum Vitae'),
  icon: 'i-heroicons-clock',
}, {
  label: t('Id Card'),
  icon: 'i-heroicons-clock',
},{
    label: t('Contact Info'),
    icon: 'i-heroicons-clock',

},{
  label: t('Insurance'),
  icon: 'i-heroicons-clock',

  // userCount: true
}, {
  label: t('Contract'),
  icon: 'i-heroicons-clock',

}]
</script>

<style scoped>
.active {
  @apply text-[#147FE0] dark:text-white  after:rounded-full
}

.active.icon {
  @apply text-[#147FE0] dark:text-gray-200
}

.inactive {
  @apply text-gray-500 dark:text-gray-400 hover:text-[#147FE0] dark:hover:text-white
}

.inactive.icon {
  @apply text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200
}

.icon {
  @apply flex-shrink-0 w-4 h-4 relative
}
</style>