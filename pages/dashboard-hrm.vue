<template>
  <div class="min-h-screen p-2 sm:p-2">
    <UContainer>
      <div class="flex w-full justify-between">
        <!-- <UCard :ui="{ background: 'bg-mailix-primary', body: { padding: 'p-5' } }" class="text-white">
          <p class="text-lg font-medium">{{ $t('Total Employee') }}</p>
          <p class="text-4xl font-bold">{{ hrmStatistic.total_profilehr }}</p>
        </UCard> -->
        <div class="flex">
          <UCard :ui="{}" class="relative rounded-xl shadow-lg
              bg-[linear-gradient(to_bottom_right,#1e40af,#3b82f6)]
              text-white pr-4 -mr-4 z-10">
            <p class="text-lg mb-2">{{ $t('Total Employee') }}</p>

            <div class="flex items-center justify-end space-x-2 ">
              <UAvatarGroup :max="3" size="sm">
                <UAvatar src="/images/user_female.png" alt="A" />
                <UAvatar src="/images/user_it.png" alt="B" />
                <UAvatar src="/images/user_accountant.png" alt="C" />
              </UAvatarGroup>
              <p class="text-6xl font-medium flex items-end">{{ hrmStatistic.total_profilehr }}</p>
            </div>
            <UIcon name="i-heroicons-user-group"
              class="absolute -bottom-1 right-0 w-8 h-8 opacity-20 pointer-events-none -rotate-12" />
          </UCard>

          <div
            class="pr-4 pl-8 flex items-center justify-between space-x-6 border-2 border-dashed border-indigo-300 dark:border-gray-600 shadow-none ring-0 z-0 rounded-lg bg-white">
            <div class="">
              <div class="flex space-x-2">
                <UIcon name="f7:waveform-path-ecg" class="w-6 h-6 opacity-80" />
                <p class="text-lg font-medium">{{ $t('Working') }}</p>
              </div>
              <p class="text-3xl font-semibold">{{ hrmStatistic.total_profilehr_working }}</p>
            </div>
            <div>
              <!-- <UIcon name="i-heroicons-archive-box" class="w-8 h-8 mb-4 opacity-80" /> -->
              <p class="text-lg font-medium">{{ $t('Resigned') }}</p>
              <p class="text-3xl font-semibold">{{ hrmStatistic.total_profilehr_resigned }}</p>
            </div>
            <div>
              <!-- <UIcon name="i-heroicons-cake" class="w-8 h-8 mb-4 opacity-80" /> -->
              <p class="text-lg font-medium truncate">{{ $t('Birthday in month') }}</p>
              <p class="text-3xl font-semibold">{{ hrmStatistic.total_profilehr_dob_inmonth }}</p>
            </div>
          </div>
        </div>

        <div
          class="overflow-hidden flex items-center rounded-xl border-[2px] border-indigo-300 border-dashed shadow-none ring-0 px-3 bg-white">
          <div>
            <div class="flex space-x-2">
              <UIcon name="tabler:clock-pause" class="w-6 h-6 opacity-80" />
              <p class="text-lg font-medium">{{ $t('Pending Activation') }}</p>
            </div>
            <p class="text-5xl font-medium">{{ hrmStatistic.total_pending_action }}</p>
          </div>
        </div>


      </div>
      <div class="mt-8">
        <UCard :ui="{
          background: 'bg-white',
          body: { padding: 'p-4 sm:p-6' }
        }" class="">

          <div class="flex justify-between items-center px-1 mb-4">
            <h1 class="text-lg text-black font-semibold text-center">{{ $t('Employees using domain email') }}</h1>
            <div class="flex space-x-2">
              <SearchInput v-model="search" />
              <!-- <UButton label="DATE"></UButton> -->
            </div>
          </div>
          <UDivider orientation="horizontal" class="mt-2 mb-6 px-1" />
          <UTable v-model:sort="sort" sort-mode="manual" :rows="users" :columns="columns"
            sort-asc-icon="i-heroicons-bars-arrow-up" sort-desc-icon="i-heroicons-bars-arrow-down"
            :sort-button="{ icon: 'i-heroicons-bars-3', color: 'none', variant: 'ghost', size: 'xs', square: false, ui: { rounded: 'rounded-full' } }"
            :ui="{
              base: 'w-max border',
              wrapper: 'bg-white rounded-lg',
              th: {
                base: 'text-left whitespace-nowrap items-center bg-[#ebecf8]',
                padding: 'px-4 py-3.5',
                color: 'text-[#0313B0] dark:text-white',
                font: 'font-medium',
                size: 'text-md',
                background: 'bg-sky-300'
              },
              td: {
                base: 'whitespace-nowrap max-w-[220px] truncate',
                padding: 'px-4 py-2',
                color: 'text-gray-800 dark:text-gray-300',
                font: '',
                size: 'text-sm'
              },
            }" :empty-state="{ icon: 'i-heroicons-square-3-stack-3d', label: $t('No items.') }">

            <template #actions-data="{ row }">
              <UDropdown :items="actionDropdown(row)" :popper="{ placement: 'bottom-start' }">
                <UButton color="gray" variant="soft" size="sm" icon="i-heroicons-ellipsis-vertical" />
                <template #item="{ item }">
                  <span class="truncate">{{ item.label }}</span>

                  <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                </template>
              </UDropdown>
            </template>
            <template v-for="column in columns.filter(item => !excludeColumns.includes(item.key))" :key="column.key"
              #[`${column.key}-data`]="{ row }">
              <span v-if="row[column.key] !== null && row[column.key] !== undefined && row[column.key] !== ''"
                class=" text-gray-900 dark:text-white">
                {{ row[column.key] }}
              </span>
              <span v-else class="text-sm text-slate-400 dark:text-gray-500">
                --
              </span>
            </template>
          </UTable>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4 px-1">
            <div class="text-sm text-gray-500">
              {{ $t('Showing') }} {{ ((page - 1) * pageSize) + 1 }} {{ $t('to') }} {{ Math.min(page * pageSize,
                pageTotal) }} {{
                $t('of') }} {{ pageTotal }} {{ $t('users') }}
            </div>
            <UPagination v-model="page" :page-count="pageSize" :total="pageTotal" :max="7" />
          </div>
        </UCard>
      </div>
    </UContainer>

    <!-- Change Password Modal -->
    <ModalChangePassword v-model="showChangePasswordModal" :user-id="selectedUserForPassword"
      @submit="handlePasswordChange" />
  </div>
</template>
<style scoped></style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Welcome',
})
import { useSearchStore } from '@/stores/search';
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { setAlertModal } = modalStore
const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);

// Change password modal state
const showChangePasswordModal = ref(false)
const selectedUserForPassword = ref(null)

// 1. Define Table Columns
const columns = [
  {
    key: 'full_name',
    label: 'Người dùng',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'department_name',
    label: 'Phòng ban',
    sortable: true
  },
  {
    key: 'title',
    label: 'Chức vụ',
    sortable: true
  },
  // { key: 'status', label: 'Trạng thái' },
  {
    key: 'actions',
    label: ''
  }
]
const excludeColumns = ['full_name', 'system_date_joined', 'employee_code', 'actions']

const reload = ref(false)
const page = ref(1)
const pageSize = ref(10)
const pageTotal = ref(0)
const sort = ref({ column: null, direction: 'asc' })

// Map frontend column keys to backend field names
const fieldMapping = {
  'department_name': 'department',
  'email': 'email',
  'full_name': 'full_name',
  'title': 'title'
}

const users = computedAsync(async () => {
  const params = {
    using_domain_email: true,
    reload: reload.value,
    search: search,
    page: page.value,
    page_size: pageSize.value,
  }

  // Add ordering if sort is active
  if (sort.value.column) {
    const backendField = fieldMapping[sort.value.column] || sort.value.column
    const prefix = sort.value.direction === 'desc' ? '-' : ''
    params.ordering = `${prefix}${backendField}`
  }

  const { data: data } = await useAPI().get('core/profile_hrs/', params)
  pageTotal.value = data.value.count
  return data.value.results
})
const { data: hrmStatistic, refresh } = await useAPI().get(`core/hrm_statistic/`);
const deleteUser = async () => {
  try {
    const response = await useAPI().post(`core/profile_hrs/delete_users/`, {
      profiles: selectedUsers.value.map(user => user.id)
    });
    console.log('response', response)
    if (response && response.status.value === 'success') {
      return true;
    } else {
      throw new Error(t('Unexpected response status'));
    }
  } catch (error) {
    console.error('Error deleting fee:', error);
    throw error;
  }
}
const deactivateUser = async (userId) => {
  try {
    const response = await useAPI().post(`core/profile_hrs/deactivate_profile/`, {
      profiles: [userId]
    });
    if (response && response.status.value === 'success') {
      return true;
    } else {
      throw new Error(t('Unexpected response status'));
    }
  } catch (error) {
    console.error('Error deactivating users:', error);
    throw error;
  }
}

const handlePasswordChange = async ({ userId, newPassword }) => {
  try {
    const response = await useAPI().post(`core/profile_hrs/change_password/`, {
      profile_id: userId,
      new_password: newPassword
    });

    if (response && response.status.value === 'success') {
      showChangePasswordModal.value = false
      useToast().add({
        title: t('Success'),
        description: t('Password changed successfully'),
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });
    } else {
      throw new Error(t('Unexpected response status'));
    }
  } catch (error) {
    console.error('Error changing password:', error);
    useToast().add({
      title: t('Error'),
      description: t('Failed to change password'),
      icon: 'i-heroicons-x-circle',
      color: 'red',
    });
  }
}

const actionDropdown = (row) => [
  [{
    label: t('Change password'),
    icon: 'mdi:password-reset',
    click: () => {
      selectedUserForPassword.value = row.id
      showChangePasswordModal.value = true
    }
  },
  {
    label: t('Deactivate'),
    icon: 'mingcute:lock-fill',
    click: () => {
      setAlertModal(true, {
        message: t('Are you sure you want to deactivate this employee?'),
        confirmButton: t('OK'),
        denyButton: t('Cancel'),
      })

      const unwatch = watch(
        () => alertModal.value,
        async (newVal) => {
          if (!newVal) {
            if (alertConfirm.value) {
              const isDeactivated = await deactivateUser(row.id);
              if (isDeactivated) {
                reload.value = !reload.value
                useToast().add({
                  title: t('Success'),
                  description: t('Profile deactivated successfully'),
                  icon: 'i-heroicons-check-circle',
                  color: 'green',
                });
              } else {
                useToast().add({
                  title: t('Error'),
                  description: t('Profile deactivation failed'),
                  icon: 'i-heroicons-x-circle',
                  color: 'red',
                });
              }
            }
            unwatch();
          }
        }
      )
    }
  }]
]

</script>