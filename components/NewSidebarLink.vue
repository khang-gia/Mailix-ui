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
        <template v-for="slotName in ['customer', 'hrm', 'crm', 'company']" v-slot:[slotName]>
            <div v-for="(item, index) in submenuMap[slotName]?.value.slice(1)" :key="item.label">
                <div v-for="subItem in item" :key="subItem.label">
                    <UButton :to="subItem.link" color="white" variant="soft" :label="$t(subItem.label)" class="pl-9 my-0.5 w-full" :class="useRoute().path.startsWith(subItem.link) ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]' : 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'" >
                        {{ $t(subItem.label) }}
                    </UButton>
                </div>
                <UDivider class="pl-9 py-1" v-if="submenuMap[slotName]?.value.slice(1).length !== 1 && index + 1 !== submenuMap[slotName]?.value.slice(1).length"/>
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
const {  data: userInfo } = useAuth()

const checkView = (slotName) => {
    let resource = userInfo.value.profile_hr.department?.group?.resources || [];
    let role = userInfo.value.profile_hr.role
    console.log('role',role)
    if (role==='A'){
        return false
    }
    const resourceNames = resource.map(item => item.code);
    return !resourceNames.includes(slotName);
}

const items = computed(() => {
    const allItems = [
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
    ];
    return allItems.filter(item => !checkView(item.slot));
});

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
    [{ link: '/contacts', label: t('Contact'),click: () => {
        useRouter().push({ name: 'contacts' });
    } },
    { link: '/customers', label: t('Customer'), click: () => {
        useRouter().push({ name: 'customers' });
    } }]
])


const hrmSubmenu = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    [{ link: '/works', label: t('Work'), click: () => {
        useRouter().push({ name: 'works' });
    } },
    { link: '/schedules', label: t('Schedule'), click: () => {
        useRouter().push({ name: 'schedules' });
    } }]
])
const companySubmenu = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    // [{
    //     link: '/company', label: t('Information'), click: () => {
    //     useRouter().push({ name: 'company' });
    // }}],
    [{ link: '/groups', label: t('Groups'), click: () => {
        useRouter().push({ name: 'groups' });
    } },
    { link: '/departments', label: t('Department'), click: () => {
        useRouter().push({ name: 'departments' });
    } }],
    // [{
    //     link: '/company/config', label: t('Config'), click: () => {
    //     useRouter().push({ name: 'company/config' });
    // }}]
])
const submenuMap = {
  crm: crmSubmenu,
  hrm: hrmSubmenu,
  customer: customerSubmenu,
  company:companySubmenu
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