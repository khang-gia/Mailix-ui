<template>
    <nav class="px-2 relative w-full flex items-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E2E]">
      <div>
        <!-- <UDropdown :items="sortItemDropDown" :popper="{ placement: 'bottom-start' }"
        :ui="{
          height: 'h-64',
          container: 'relative z-20 group',
        }"
        >
          <UButton color="gray" variant="ghost" icon="i-heroicons-bars-4" />
          <template #item="{ item }">
            <span class="p-2">{{ item.label }}</span>
          </template>
          <template #action="{ item }">
            <span class="fixed bottom-0 left-0 p-6 bg-white w-full">{{ item.label }}</span>
          </template>
        </UDropdown> -->
      </div>
      <ul class="flex items-center min-w-0">
        <li class="min-w-0" v-for="(link, index) in links" :key="index">
          <UButton color="" variant="ghost"
            class="transition-all outline-none group relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm
             focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2
              focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75 before:absolute
               before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 text-gray-500 dark:text-gray-400"
               :class="current === index ? 'active' : 'inactive'" @click="current = index">
            <UIcon v-if="link.icon" :name="link.icon" class="icon" :class="current === index ? 'active' : 'inactive'" />
            <span class="text-sm font-averta">{{ link.label }}</span>
            <!-- <UBadge color="gray" variant="solid" size="xs" class="px-1 py-0" :ui="{ rounded: 'rounded' }">{{ useUserStore() }}</UBadge> -->
          </UButton>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { useI18n } from "vue-i18n";
  const { t } = useI18n();
  // import {useUserStore } from '@/stores/user'
  // const userStore = useUserStore()
  // const comCount = userStore.company
  // console.log('UserStore', useUserStore())
  const current = defineModel({ default: 0 })
  const links = [{
    label: t('Profile HR')
  }, 
  // {
  //   label: t('Insurance history'),
  //   // userCount: true
  // }, {
  //   label: t('HR ID Cards'),
  // },{
  //   label: t('Certification'),
  // }, {
  //   label: t('Avatar')
  // }
]
  
  const sortItemDropDown = ref([ 
    [{
        label: t('Working'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Wait for approval'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Temporary leave'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Resigned'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Providing service'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitment'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Pending for recruitments'),
        click: () => {
          console.log('hehe')
        }
      },{
        label: t('Customize'),
        icon: 'fluent:column-triple-edit-24-regular',
        slot: 'action',
        click: () => {
          console.log('hi')
        }
      }]
    ])
  </script>
  
  <style scoped>
  .active {
    @apply text-gray-900 dark:text-white after:bg-[#147FE0] dark:after:bg-[#147FE0] after:rounded-full
  }
  
  .active.icon {
    @apply text-gray-700 dark:text-gray-200
  }
  
  .inactive {
    @apply text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
  }
  
  .inactive.icon {
    @apply text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200
  }
  
  .icon {
    @apply flex-shrink-0 w-4 h-4 relative
  }
  </style>