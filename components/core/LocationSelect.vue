<template>
    <UInputMenu
        v-model="pob"
        :search="search"
        :loading="loading"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        by="id"
        option-attribute="name"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const pob = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
async function search(q) {
    loading.value = true
    // const { data } = await useAPI().getLocation('search', { q, 
    //     format: 'json',
    //     countrycodes: 'vn',
    //     featureType:'city', 
    //     namedetails:'1',
    //     addressdetails:'1'
    // })
    const { data } = await useAPI().getNationality('name/' + q )

    loading.value = false
    console.log('data', data.value)
    // return data.value.map((item) => {
    //     return {
    //         id: item.display_name,
    //         name: item.display_name,
    //     }
    // })
    if (!data.value || data.value.length === 0) {
        console.log('filter', vietnamAdministrativeUnits.filter(unit => unit.id.toLowerCase().includes(q.toLowerCase())));
        return vietnamAdministrativeUnits.filter(unit => unit.id.toLowerCase().includes(q.toLowerCase()));
    }
    return data.value.map((item) => {
        return {
            id: item.name.common == 'Vietnam'?'Việt Nam':item.name.common,
            name: item.name.common == 'Vietnam'?'Việt Nam':item.name.common
        }
    })
}
const vietnamAdministrativeUnits = [
    { id: 'An Giang', name: 'An Giang' },
    { id: 'Bắc Ninh', name: 'Bắc Ninh' },
    { id: 'Cà Mau', name: 'Cà Mau' },
    { id: 'Cao Bằng', name: 'Cao Bằng' },
    { id: 'Đắk Lắk', name: 'Đắk Lắk' },
    { id: 'Điện Biên', name: 'Điện Biên' },
    { id: 'Đồng Nai', name: 'Đồng Nai' },
    { id: 'Đồng Tháp', name: 'Đồng Tháp' },
    { id: 'Gia Lai', name: 'Gia Lai' },
    { id: 'Hà Tĩnh', name: 'Hà Tĩnh' },
    { id: 'Hưng Yên', name: 'Hưng Yên' },
    { id: 'Khánh Hòa', name: 'Khánh Hòa' },
    { id: 'Lai Châu', name: 'Lai Châu' },
    { id: 'Lâm Đồng', name: 'Lâm Đồng' },
    { id: 'Lạng Sơn', name: 'Lạng Sơn' },
    { id: 'Lào Cai', name: 'Lào Cai' },
    { id: 'Nghệ An', name: 'Nghệ An' },
    { id: 'Ninh Bình', name: 'Ninh Bình' },
    { id: 'Phú Thọ', name: 'Phú Thọ' },
    { id: 'Quảng Ngãi', name: 'Quảng Ngãi' },
    { id: 'Quảng Ninh', name: 'Quảng Ninh' },
    { id: 'Quảng Trị', name: 'Quảng Trị' },
    { id: 'Sơn La', name: 'Sơn La' },
    { id: 'Tây Ninh', name: 'Tây Ninh' },
    { id: 'Thái Nguyên', name: 'Thái Nguyên' },
    { id: 'Thanh Hóa', name: 'Thanh Hóa' },
    // Centrally-run Cities (TP.)
    { id: 'TP. Cần Thơ', name: 'TP. Cần Thơ' },
    { id: 'TP. Đà Nẵng', name: 'TP. Đà Nẵng' },
    { id: 'TP. Hà Nội', name: 'TP. Hà Nội' },
    { id: 'TP. Hải Phòng', name: 'TP. Hải Phòng' },
    { id: 'TP. Hồ Chí Minh', name: 'TP. Hồ Chí Minh' },
    { id: 'TP. Huế', name: 'TP. Huế' },
    { id: 'Tuyên Quang', name: 'Tuyên Quang' },
    { id: 'Vĩnh Long', name: 'Vĩnh Long' },
];
</script>