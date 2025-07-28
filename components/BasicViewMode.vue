<template>
    <USlideover v-model="isOpen" >
      <UCard class="flex flex-col flex-1 font-averta" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ $t('Additional Filters') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>
        </UCard>
    </USlideover>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const colorMode = useColorMode()
const isOpen = ref(false)
</script>