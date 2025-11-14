<template>
  <div class="flex flex-col">
    <span class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {{ $t(label) }}
      </span>
    <div v-if="label === 'Curators'">
      <UAvatarGroup size="xs" :max="4" v-if="value && value.length">
          <div v-for="curator in value" :key="curator.id">
              <NuxtLink v-if="curator.profile_hr" :to="{ name: 'hr-id', params: { id: curator.profile_hr.id } }">
                  <UTooltip :text="curator.display_name">
                      <UAvatar :src="curator.avatar" :alt="curator.display_name" />
                  </UTooltip>
              </NuxtLink>
          </div>
      </UAvatarGroup>
      <div v-else>
          <span class="text-sm italic text-slate-400 dark:text-gray-500">{{$t('No curators assigned')}}</span>
      </div>
    </div>
    <div v-else>
      <slot name="value">
        <span v-if="value" class="text-base font-semibold text-gray-800 dark:text-gray-200 break-words">
          {{ translate_keys.includes(label) ? $t(value) : value }}
        </span>
        <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
      </slot>
    </div>
    <!-- <div v-else>

      <span v-if="value" class="text-base font-semibold text-gray-800 dark:text-gray-200 break-words">
        {{ translate_keys.includes(label) ? $t(value) : value }}
      </span>
      <span v-else class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
    </div> -->
    
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: ''
  }
})
const translate_keys = ['Gender', 'Type of contact', 'Contact Source','Company Type', 'Line of business','Status', 'Stage']
</script>