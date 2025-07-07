<template>
    <UAccordion
        default-open
        color="white"
        variant="soft"
        size="sm"
        multiple
        :items="items"
        :ui="{
            base: 'w-full',
            wrapper: 'pt-4 px-2 ',
        }">
        <template #customer_info>
            <div v-for="item in customerSubmenu" :key="item.name">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.name)" class="pl-9 w-full" :class="useRoute().name === item.link.split('/')[1] ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.name) }}
                </UButton>
            </div>
        </template>
        <template #hrm>
            <div v-for="item in hrmSubmenu" :key="item.name">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.name)" class="pl-9 w-full" :class="useRoute().name === item.link.split('/')[1] ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.name) }}
                </UButton>
            </div>
        </template>
        <template #crm>
            <div v-for="item in crmSubmenu" :key="item.name">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.name)" class="pl-9 w-full" :class="useRoute().name === item.link.split('/')[1] ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.name) }}
                </UButton>
            </div>
        </template>
    </UAccordion>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const active = ref('')
const items = [
    {
        label: t('Customer'),
        icon:"ix:customer",
        slot: 'customer_info',
        content: '[{"link":"/me","name":"Me"},{"link":"/contact","name":"Contact"}]'
    },
    {
        label: t('CRM'),
        icon:"mdi:face-agent",
        slot: 'crm',
    },
    {
        label: t('HR'),
        icon:"heroicons:users",
        slot: 'hrm',
    },
    {
        label: t('Company'),
        icon:"mdi:company",
        slot: 'company',
    },
]
const customerSubmenu= ref([
    { link: '/me', name: 'Me' },
    { link: '/hr', name: 'Nhân sự' },
])
const crmSubmenu = ref([
    { link: '/contacts', name: 'Contact' },
    { link: '/customers', name: 'Customer' }
])
const hrmSubmenu = ref([
    { link: '/works', name: 'Công việc' },
])
</script>