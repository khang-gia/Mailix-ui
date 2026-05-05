<template>
    <UAccordion v-if="isSidebarOpen" default-open color="white" variant="soft" size="sm" multiple :items="items" :ui="{
        base: 'w-full',
        wrapper: 'pt-4 px-2 ',
    }">
        <!-- <template #default="{ item, index, open }">
            <UButton :to="item.noSub ? item.link : undefined" color="gray" variant="ghost" class="border-b border-gray-200 dark:border-gray-700" :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }">
                <template #leading>
                    <div class="w-6 h-6 rounded-full flex items-center justify-center -my-1">
                        <UIcon :name="item.icon" class="w-4 h-4" />
                    </div>
                </template>
<span class="truncate">{{ item.label }}</span>
<template #trailing>
                    <UIcon
                        v-if="!item.noSub"
                        name="i-heroicons-chevron-right-20-solid"
                        class="w-5 h-5 ms-auto transform transition-transform duration-200"
                        :class="[open && 'rotate-90']"
                    />
                </template>
</UButton>
</template>
-->
        <template v-for="slotName in ['customer', 'workspace', 'crm', 'company', 'task', 'guide', 'setting']" v-slot:[slotName]>
            <div v-for="(item, index) in submenuMap[slotName]?.value.slice(1)" :key="item.label">
                <div v-for="subItem in item" :key="subItem.label">
                    <UButton :to="subItem.link" :target="subItem.target" color="white" variant="soft"
                        :label="$t(subItem.label)" class="pl-9 my-0.5 w-full"
                        :class="useRoute().path.startsWith(subItem.link) ? 'text-[#0313B0] bg-[#e3e5f5] dark:bg-[#34344A] dark:text-[#E0E0E0]' : 'text-[#707070] dark:text-[#E0E0E0] hover:text-[#0313B0] hover:bg-[#e3e5f5]'">
                        {{ $t(subItem.label) }}
                    </UButton>
                </div>
                <UDivider class="pl-9 py-1"
                    v-if="submenuMap[slotName]?.value.slice(1).length !== 1 && index + 1 !== submenuMap[slotName]?.value.slice(1).length" />
            </div>
        </template>

    </UAccordion>
    <div v-else>
        <div v-for="item in items" :key="item.name" class="flex justify-center items-center py-4">
            <UDropdown :items="getDropdownItems(item.slot)" mode="hover" :popper="{ placement: 'right-start' }">
                <UButton color="gray" variant="soft" size="xl" :icon="item.icon" class="text-slate-500" />
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
import { useUserStore } from '@/stores/user'
const { t } = useI18n();
const userStore = useUserStore()
const { isSidebarOpen } = storeToRefs(userStore)
const { data: userInfo } = useAuth()

const checkView = (slotName) => {
    let role = userInfo.value.profile_hr.role
    if (role === 'A' || userInfo.value.is_superuser) {
        return false
    }
    let resource = userInfo.value.profile_hr.department?.resources || userInfo.value.profile_hr.department?.group?.resources || [];
    const resourceNames = resource.map(item => item.code);
    return !resourceNames.includes(slotName);
}

const items = computed(() => {
    const allItems = [
        {
            label: t('HR'),
            icon: "ix:customer",
            slot: 'customer',
        },
        {
            label: t('CRM'),
            icon: "mdi:face-agent",
            slot: 'crm',
        },
        {
            label: t('Workspace'),
            icon: "carbon:workspace",
            slot: 'workspace',
        },
        {
            label: t('Company'),
            icon: "mdi:company",
            slot: 'company',
        },
        // {
        //     label: t('Task'),
        //     icon:"fluent:tasks-app-24-regular",
        //     slot: 'task',
        // },
        {
            label: t('Guide'),
            icon: "ix:user-manual",
            slot: 'guide',
        },
        {
            label: t('Setting'),
            icon: "i-heroicons-cog-6-tooth",
            slot: 'setting',
            adminOnly: true,
        },
        // {
        //     label: t('Mail'),
        //     icon:"heroicons-envelope",
        //     slot: 'mail',
        //     noSub: true,
        // },
        // {
        //     label: t('App'),
        //     icon:"tdesign:app",
        //     slot: 'app',
        //     noSub: true,
        // },

    ];
    return allItems.filter(item => {
        if (item.adminOnly) {
            const role = userInfo.value.profile_hr.role
            return role === 'A' || userInfo.value.is_superuser
        }
        return !checkView(item.slot)
    });
});

const customerSubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [
        {
            link: '/hr', label: t('HR'), click: () => {
                useRouter().push({ name: 'hr' });
            }
        },
        {
            link: '/dashboard-hrm', label: t('Dashboard'), click: () => {
                useRouter().push({ name: 'dashboard-hrm' });
            }
        },]
])
const crmSubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{
        link: '/contacts', label: t('Contact'), click: () => {
            useRouter().push({ name: 'contacts' });
        }
    },
    {
        link: '/customers', label: t('Customer'), click: () => {
            useRouter().push({ name: 'customers' });
        }
    }]
])


const workspaceSubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{
        link: '/works', label: t('Work'), click: () => {
            useRouter().push({ name: 'works' });
        }
    },
    {
        link: '/schedules', label: t('Schedule'), click: () => {
            useRouter().push({ name: 'schedules' });
        }
    },
    {
        link: '/dashboard-work', label: t('Dashboard'), click: () => {
            useRouter().push({ name: 'dashboard-work' });
        }
    },
    {
        link: '/social', label: t('Social'), click: () => {
            useRouter().push({ name: 'social' });
        }
    }]
])
const companySubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{
        link: '/groups', label: t('Groups'), click: () => {
            useRouter().push({ name: 'groups' });
        }
    },
    {
        link: '/departments', label: t('Department'), click: () => {
            useRouter().push({ name: 'departments' });
        }
    }],
])
const manageSubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{
        link: '/company/theme', label: t('Theme'), click: () => {
            useRouter().push({ name: 'company-theme' });
        }
    },
    {
        link: '/company/config', label: t('System Config'), click: () => {
            useRouter().push({ name: 'company-config' });
        }
    }],
])
const taskSubmenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{ link: 'https://app.mailix.vn/', label: t('Mail'), click: () => { }, target: '_blank' },]
])
const guideMenu = computed(() => [
    [{ slot: 'tip', disabled: true }],
    [{ link: '/guide-mail', label: t('Mail'), click: () => { } },
    { link: '/guide-app', label: t('App'), click: () => { } }],
])
const submenuMap = {
    crm: crmSubmenu,
    workspace: workspaceSubmenu,
    customer: customerSubmenu,
    company: companySubmenu,
    task: taskSubmenu,
    guide: guideMenu,
    setting: manageSubmenu
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