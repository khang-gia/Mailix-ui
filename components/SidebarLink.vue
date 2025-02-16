<template>
  <NuxtLink :to="link" custom v-slot="{ href, navigate, isExactActive }">
    <li class="rounded-sm mb-0.5 last:mb-0" :class="isExactActive ? 'bg-primary-100 border-r-2 border-primary-500':'hover:bg-slate-100 hover:dark:bg-slate-700'" :title="sidebarExpanded ? '' : text">
      <a
        class="px-5 py-2 my-2 block truncate transition duration-150"
        :class="isExactActive ? 'text-primary-500' : 'text-slate-400 hover:text-slate-300'" 
        :href="href"
        :target="target"
        :aria-label="text"
        @click="!target && navigate()">
        <div class="flex items-center">
          <div>
            <Icon :name="icon" size="24" :class="iconColor"/>
          </div>
          <span v-if="sidebarExpanded" class="text-lg font-medium ml-3 duration-200 font-sans">
            {{text}}
            <Icon v-if="target" name="tabler:external-link" side="24" />
          </span>
          
        </div>
      </a>
    </li>
  </NuxtLink>
</template>

<script setup>
defineProps({
  link: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  sidebarExpanded: {
    type: Boolean,
    default: false
  },
  target: {
    type: String
  }
})
</script>