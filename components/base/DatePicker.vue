<template>
    <div>
        <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" :label="label" :variant="buttonType" />
            <template #panel="{ close }">
                <VDatePicker
                    :model-value="props.dateValue"
                    :is-required="required" transparent
                    :is-dark="colorMode.value === 'dark'"
                    :mode="mode"
                    :minDate="minDate"
                    :maxDate="maxDate"
                    locale="vi"
                    @close="close"
                    @update:model-value="close();onUpdate($event)"
                />
            </template>
        </UPopover>
    </div>
</template>
<script setup>

const emit = defineEmits(["onUpdate"]);
const colorMode = useColorMode()
const props = defineProps({
    dateValue: {
        type: Date,
        default: new Date()
    },
    mode: {
        type: String,
        default: 'date'
    },
    required: {
        type: Boolean,
        default: false
    },
    labelType: {
        type: String,
        default: ''
    },
    buttonType: {
        type: String,
        default: 'solid'
    },
    maxDate: {
        type: Date,
        default: undefined
    },
    minDate: {
        type: Date,
        default: undefined
    }
    
});

const label = computed(() => {
    if (props.labelType == 'short') {
        if (!props.dateValue) return ''
        if (props.dateValue.toDateString() == new Date().toDateString()) return 'Hôm nay'
        return props.dateValue.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' })
    } 
    return props.dateValue ?props.dateValue.toLocaleDateString('vi-vi', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }):''
    
})
const onUpdate = (value) => {
    emit("onUpdate", value)
}
</script>