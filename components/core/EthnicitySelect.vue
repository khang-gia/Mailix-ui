<template>
    <UInputMenu
        v-model="ethnicity"
        :loading="loading"
        :options="ethnicities"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="label"
        value-attribute="value"
        trailing
        debounce='300'
    >
    </UInputMenu>
</template>
<script setup>
const ethnicity = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
const ethnicities = [
    { label: 'Tày', value: 'Tày' },
    { label: 'Thái', value: 'Thái' },
    { label: 'Mường', value: 'Mường' },
    { label: 'Hmong', value: 'Hmong' },
    { label: 'Nùng', value: 'Nùng' },
    { label: 'Hoa', value: 'Hoa' },
    { label: 'Khmer', value: 'Khmer' },
    { label: 'Dao', value: 'Dao' },
    { label: 'Gia Rai', value: 'Gia Rai' },
    { label: 'Ê Đê', value: 'Ê Đê' },
    { label: 'Ba Na', value: 'Ba Na' },
    { label: 'Xơ Đăng', value: 'Xơ Đăng' },
    { label: 'Sán Chay', value: 'Sán Chay' },
    { label: 'Cơ Ho', value: 'Cơ Ho' },
    { label: 'Chăm', value: 'Chăm' },
    { label: 'Sán Dìu', value: 'Sán Dìu' },
    { label: 'Hrê', value: 'Hrê' },
    { label: 'Mnông', value: 'Mnông' },
    { label: 'Ra Glai', value: 'Ra Glai' },
    { label: 'Xinh Mun', value: 'Xinh Mun' },
    { label: 'Bru - Vân Kiều', value: 'Bru - Vân Kiều' },
    { label: 'Thổ', value: 'Thổ' },
    { label: 'Giáy', value: 'Giáy' },
    { label: 'Cơ Tu', value: 'Cơ Tu' },
    { label: 'Gié Triêng', value: 'Gié Triêng' },
    { label: 'Mạ', value: 'Mạ' },
    { label: 'Khơ Mú', value: 'Khơ Mú' },
    { label: 'Co', value: 'Co' },
    { label: 'Tà Ôi', value: 'Tà Ôi' },
    { label: 'Chơ Ro', value: 'Chơ Ro' },
    { label: 'Kháng', value: 'Kháng' },
    { label: 'Xtiêng', value: 'Xtiêng' },
    { label: 'Hà Nhì', value: 'Hà Nhì' },
    { label: 'Chu Ru', value: 'Chu Ru' },
    { label: 'Lào', value: 'Lào' },
    { label: 'La Chí', value: 'La Chí' },
    { label: 'Phù Lá', value: 'Phù Lá' },
    { label: 'La Hủ', value: 'La Hủ' },
    { label: 'Lự', value: 'Lự' },
    { label: 'Lô Lô', value: 'Lô Lô' },
    { label: 'Chứt', value: 'Chứt' },
    { label: 'Mảng', value: 'Mảng' },
    { label: 'Pà Thẻn', value: 'Pà Thẻn' },
    { label: 'Co Lao', value: 'Co Lao' },
    { label: 'Cống', value: 'Cống' },
    { label: 'Bố Y', value: 'Bố Y' },
    { label: 'Si La', value: 'Si La' },
    { label: 'Pu Péo', value: 'Pu Péo' },
    { label: 'Brâu', value: 'Brâu' },
    { label: 'Ơ Đu', value: 'Ơ Đu' },
    { label: 'Rơ Măm', value: 'Rơ Măm' },
    { label: 'Ngái', value: 'Ngái' },
    { label: 'Thành phần khác', value: 'Thành phần khác' },
    { label: 'Không xác định', value: 'Không xác định' },
    { label: 'Kinh', value: 'Kinh' },
    { label: 'Tày', value: 'Tày' },
    { label: 'Thái', value: 'Thái' },
    { label: 'Mường', value: 'Mường' },
    { label: 'Hmong', value: 'Hmong' },
    { label: 'Nùng', value: 'Nùng' },
    { label: 'Hoa', value: 'Hoa' },
    { label: 'Khmer', value: 'Khmer' },
    { label: 'Dao', value: 'Dao' }
]
</script>