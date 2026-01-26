<template>
    <div class="group">
        <!-- Display Mode -->
        <div v-if="!isEditing"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="startEdit">
            <UIcon :name="icon" class="w-5 h-5 text-gray-400" />
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {{ $t(label) }}
                </p>
                <div class="flex justify-between items-center h-6">
                    <p v-if="displayValue" class="text-gray-900 dark:text-white font-medium truncate">
                        {{ displayValue }}
                    </p>
                    <p v-else class="text-gray-400 dark:text-gray-500 font-medium truncate">
                        {{ $t(label) }}
                    </p>
                    <UIcon v-if="isAdmin" name="i-heroicons-pencil-square"
                        class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
                <UIcon :name="icon" class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(label) }}</span>
                <UBadge v-if="privacyText" color="gray" variant="subtle" size="xs" class="ml-auto">
                    <UIcon name="i-heroicons-globe-alt" class="w-3 h-3 mr-1" />
                    {{ privacyText }}
                </UBadge>
            </div>

            <BaseDatePicker v-if="type === 'date'" v-model="localValue" :place-holder="placeholder" class="mb-3 w-full"
                buttonType="outline" />
            <UTextarea v-else-if="type === 'textarea'" v-model="localValue" :placeholder="placeholder" autofocus
                :rows="3" class="mb-3" autoresize />
            <UInput v-else v-model="localValue" :type="type" :placeholder="placeholder" autofocus class="mb-3" />

            <div class="flex justify-end gap-2">
                <UButton size="xs" color="gray" variant="ghost" @click="cancelEdit">
                    {{ $t('Cancel') }}
                </UButton>
                <UButton size="xs" color="primary" :loading="isSaving" @click="saveEdit">
                    {{ $t('Save') }}
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    privacyText: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'save'])
const dayjs = useDayjs()

const isEditing = ref(false)
const isSaving = ref(false)
const localValue = ref('')

const displayValue = computed(() => {
    return props.modelValue
})

// Initialize local value when editing starts or prop changes
watch(() => props.modelValue, (newVal) => {
    if (!isEditing.value) {
        localValue.value = newVal
    }
})

const startEdit = () => {
    if (!props.isAdmin) return

    if (props.type === 'date' && props.modelValue) {
        localValue.value = new Date(props.modelValue)
    } else {
        localValue.value = props.modelValue
    }

    isEditing.value = true
}

const cancelEdit = () => {
    isEditing.value = false
    localValue.value = props.modelValue
}

const saveEdit = async () => {
    isSaving.value = true
    try {
        let valueToEmit = localValue.value

        if (props.type === 'date' && valueToEmit) {
            valueToEmit = dayjs(valueToEmit).format('YYYY-MM-DD')
        }

        emit('update:modelValue', valueToEmit)
        emit('save', valueToEmit)

        isEditing.value = false
    } finally {
        isSaving.value = false
    }
}
</script>
