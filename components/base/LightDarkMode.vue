<template>
    <div>
        <UButton variant="link" color="gray" @click.stop="toggleDarkMode()" class="p-[6px] hover:bg-slate-100 dark:hover:bg-slate-900 dark:hover:text-white" :title="colorModeTitle">
            <Icon v-if="$colorMode.preference==='light'" name="iconamoon:mode-light" size="20" />
            <Icon v-else-if="$colorMode.preference==='dark'" name="heroicons:moon-16-solid" size="20" />
            <Icon v-else name="tabler:sun-moon" size="20" />
        </UButton>
    </div>
</template>

<script setup>
    const colorMode = useColorMode()
    const toggleDarkMode = () => {
        console.log('ToggleTheme')
        const MAPS = {
            'light': 'dark',
            'dark': 'system',
            'system': 'light'
        }
        colorMode.preference = MAPS[colorMode.preference]
    }
    const colorModeTitle = computed(() => {
        const MAPS = {
            'light': 'Chế độ nền sáng',
            'dark': 'Chế độ nền tối',
            'system': 'Chế độ tự động'
        }
        return MAPS[colorMode.preference]
    })
    
</script>