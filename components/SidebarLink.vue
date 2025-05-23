<template>
  <NuxtLink :to="link" custom v-slot="{ href, navigate, isExactActive }">
    <li class="group rounded-md mb-0.5 last:mb-0 mx-1 my-3" :class="isExactActive ? 'bg-[#e3e5f5] ':'hover:bg-[#e3e5f5] hover:text-[#0313B0] hover:dark:bg-[#34344A]'" :title="sidebarExpanded ? '' : text">
      <a
        class="pt-2 block truncate rounded-md"
        :class="isExactActive ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] '" 
        :href="href"
        :target="target"
        :aria-label="text"
        @click="!target && navigate()">
        <div class="grid grid-rows-2 justify-items-center group-hover:text-[#0313B0] group-hover:dark:text-[#E0E0E0]">
          <div :class="{'hidden': isExactActive, 'group-hover:hidden': !isExactActive}">
            <Icon :name="icon" size="20" :class="iconColor"/>
          </div>
          <div :class="{'inline': isExactActive, 'hidden group-hover:inline ': !isExactActive}">
            <Icon :name="activeIcon" size="20" :class="iconColor"/>
          </div>
          <span class="text-[11px] font-medium duration-100 font-sans">
            {{text}}
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
  activeIcon:{
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