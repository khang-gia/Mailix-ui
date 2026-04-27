<template>
    <div>
        <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" :label="label" :variant="buttonType" color="blue" class="w-full truncate"/>
            <template #panel="{ close }">
                <VDatePicker
                    :model-value="dateValue"
                    :is-required="required" 
                    transparent
                    :is-dark="colorMode.value === 'dark'"
                    :mode="mode"
                    :minDate="minDate"
                    :maxDate="maxDate"
                    hide-time-header
                    is24hr
                    locale="vi"
                    @update:model-value="onUpdateModelValue($event, close)"
                />
            </template>
        </UPopover>
    </div>
</template>
<script setup>
const emit = defineEmits(["onUpdate"]);
const colorMode = useColorMode()
const dateValue = defineModel({default: ''})
const props = defineProps({
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
    },
    placeHolder:{
        type: String,
        default: ''
    }
});

const label = computed(() => {
    if (props.labelType == 'short') {
        if (!dateValue.value) return ''
        if (dateValue.value.toDateString() == new Date().toDateString()) return 'Hôm nay'
        return dateValue.value.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' })
    } 
    const formatOptions = props.mode === 'datetime' 
        ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
        
    return dateValue.value ? dateValue.value.toLocaleString('vi-vn', formatOptions) : props.placeHolder
})

function onUpdateModelValue(val, close) {
    dateValue.value = val
    if (props.mode === 'date') {
        close()
    }
}
</script>