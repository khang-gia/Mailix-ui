<template>
    <UAccordion
        v-if="isSidebarOpen"
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
        <template #customer>
            <div v-for="item in customerSubmenu[1]" :key="item.label">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.label)" class="pl-9 w-full" :class="useRoute().path.startsWith(item.link)? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.label) }}
                </UButton>
            </div>
        </template>
        <template #hrm>
            <div v-for="item in hrmSubmenu[1]" :key="item.label">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.label)" class="pl-9 w-full" :class="useRoute().path.startsWith(item.link) ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.label) }}
                </UButton>
            </div>
        </template>
        <template #crm>
            <div v-for="item in crmSubmenu[1]" :key="item.label">
                <UButton :to="item.link" color="white" variant="soft" :label="$t(item.label)" class="pl-9 w-full" :class="useRoute().path.startsWith(item.link) ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]': 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                    {{ $t(item.label) }}
                </UButton>
            </div>
        </template>
    </UAccordion>
    <div v-else >
        <div v-for="item in items" :key="item.name" class="flex justify-center items-center py-4">
            <UDropdown :items="getDropdownItems(item.slot)" mode="hover" :popper="{ placement: 'right-start' }">
                <UButton color="gray" variant="soft" size="xl" :icon="item.icon" class="text-slate-500"/>
                <template #tip>
                    <div class="text-left cursor-text font-bold text-slate-900">
                        <p>
                        {{ $t(item.label) }}
                        </p>
                    </div>
                </template>
            </UDropdown>
        </div>
    </div>
    
</template>
<script setup>

import { storeToRefs } from 'pinia'
import { useI18n } from "vue-i18n";
import {useUserStore } from '@/stores/user'
const { t } = useI18n();
const userStore = useUserStore()
const { isSidebarOpen } = storeToRefs(userStore)

const items = [
    {
        label: t('Customer'),
        icon:"ix:customer",
        slot: 'customer',
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
    [{
            slot: 'tip',
            disabled: true
        }],
    [{ link: '/me', label: 'Me', click: () => {
        useRouter().push({ name: 'me' });
    }},
    { link: '/hr', label: 'Nhân sự', click: () => {
        useRouter().push({ name: 'hr' });
    } },]
])
const crmSubmenu = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    [{ link: '/contacts', label: 'Contact',click: () => {
        useRouter().push({ name: 'contacts' });
    } },
    { link: '/customers', label: 'Customer', click: () => {
        useRouter().push({ name: 'customers' });
    } }]
])


const hrmSubmenu = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    [{ link: '/works', label: 'Công việc', click: () => {
        useRouter().push({ name: 'works' });
    } },]
])
const submenuMap = {
  crm: crmSubmenu,
  hrm: hrmSubmenu,
  customer: customerSubmenu,
};
const getDropdownItems = (name) => {
    const submenuRef = submenuMap[name];
    if (!submenuRef) {
        console.warn(`No submenu found for name: ${name}`);
        return [];
    }

    return submenuRef.value
}
</script>