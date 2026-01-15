<template>
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }" class="font-averta">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">{{ $t('Update Progress') }}</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="close" />
                </div>
            </template>

            <div class="space-y-4">
                <div class="flex items-center justify-center gap-3">
                    <UButton icon="i-heroicons-minus" size="sm" color="gray" variant="soft" @click="adjustProgress(-10)"
                        class="mt-6" />
                    <div class="flex-1 max-w-md flex flex-col gap-3">
                        <div class="text-center">
                            <span class="text-xl font-semibold text-primary-600 dark:text-primary-400 tabular-nums">{{
                                currentProgress
                            }}%</span>
                        </div>
                        <input v-model.number="currentProgress" type="range" min="0" max="100"
                            class="progress-slider w-full" />
                    </div>
                    <UButton icon="i-heroicons-plus" size="sm" color="gray" variant="soft" @click="adjustProgress(10)"
                        class="mt-6" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="ghost" @click="close">
                        {{ $t('Cancel') }}
                    </UButton>
                    <UButton color="primary" @click="save" :loading="saving">
                        {{ $t('Save') }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<style scoped>
.progress-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(to right,
            rgb(var(--color-primary-500)) 0%,
            rgb(var(--color-primary-500)) var(--progress, 0%),
            rgb(229 231 235) var(--progress, 0%),
            rgb(229 231 235) 100%);
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dark .progress-slider {
    background: linear-gradient(to right,
            rgb(var(--color-primary-400)) 0%,
            rgb(var(--color-primary-400)) var(--progress, 0%),
            rgb(55 65 81) var(--progress, 0%),
            rgb(55 65 81) 100%);
}

.progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: rgb(var(--color-primary-500));
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.dark .progress-slider::-webkit-slider-thumb {
    background: rgb(var(--color-primary-400));
    border-color: rgb(30 41 59);
}

.progress-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.progress-slider::-webkit-slider-thumb:active {
    transform: scale(1.05);
}

.progress-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: rgb(var(--color-primary-500));
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.dark .progress-slider::-moz-range-thumb {
    background: rgb(var(--color-primary-400));
    border-color: rgb(30 41 59);
}

.progress-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.progress-slider::-moz-range-thumb:active {
    transform: scale(1.05);
}
</style>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    workId: {
        type: [Number, String],
        required: true
    },
    progress: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'updated']);

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const currentProgress = ref(props.progress);
const saving = ref(false);

// Watch for prop changes
watch(() => props.progress, (newProgress) => {
    currentProgress.value = newProgress;
}, { immediate: true });

// Update CSS variable for progress bar
const updateProgressBar = () => {
    if (typeof document !== 'undefined') {
        nextTick(() => {
            const slider = document.querySelector('.progress-slider');
            if (slider) {
                slider.style.setProperty('--progress', `${currentProgress.value}%`);
            }
        });
    }
};

// Watch progress changes to update CSS variable
watch(currentProgress, (newProgress) => {
    updateProgressBar();
}, { immediate: true });

// Watch modal open to update progress bar
watch(isOpen, (newVal) => {
    if (newVal) {
        updateProgressBar();
    }
});

// Update on mount
onMounted(() => {
    updateProgressBar();
});

// Adjust progress by a delta value
const adjustProgress = (delta) => {
    const newProgress = currentProgress.value + delta;
    currentProgress.value = Math.max(0, Math.min(100, newProgress));
};

// Save progress to API
const save = async () => {
    try {
        saving.value = true;
        const response = await useAPI().patch(`core/works/${props.workId}/`, {
            progress: currentProgress.value
        });

        if (response.status.value === 'success') {
            useToast().add({
                title: t('Success'),
                description: t('Progress updated successfully'),
                color: 'green',
            });

            // Emit updated event with new progress
            emit('updated', currentProgress.value);

            // Close the modal
            close();
        }
    } catch (error) {
        console.error('Error updating progress:', error);
        useToast().add({
            title: t('Error'),
            description: t('Failed to update progress'),
            color: 'red',
        });
    } finally {
        saving.value = false;
    }
};

// Close modal
const close = () => {
    isOpen.value = false;
};
</script>
