<template>
  <div class="flex flex-col">
    <span class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {{ $t(label) }}
      </span>
    <div v-if="listUserLabel.includes(label)">
      <UAvatarGroup size="xs" :max="4" v-if="value && value.length">
          <div v-for="user in value" :key="user.id">
              <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                  <UTooltip :text="user.display_name">
                      <UAvatar :src="user.avatar" :alt="user.display_name" />
                  </UTooltip>
              </NuxtLink>
            </div>
      </UAvatarGroup>
      <div v-else>
          <span class="text-sm italic text-slate-400 dark:text-gray-500">--</span>
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
const listUserLabel = ['Assigned by', 'Assigned to', 'Work manage by']
const translate_keys = ['Status', 'Priority']
</script>