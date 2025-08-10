<template>
  <div v-if="company" class="p-6 bg-gray-50 min-h-screen">

    <UCard class="mb-6 max-w-sm">
      <div class="flex items-center space-x-4">
        <!-- <div class="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          <UIcon name="i-heroicons-globe-alt" class="h-8 w-8" />
        </div> -->
        <UAvatar
          :src=company.logo
          alt="Company Logo"
          size="xl"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ company.name }}</h1>
          <UBadge color="green" variant="solid" size="sm">{{ company.status === 0 ? $t('Active') : $t('Suspend') }}</UBadge>
        </div>
      </div>
    </UCard>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">{{$t('General')}}</h2>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Line of business')}}</p>
            <p class="text-lg font-bold text-gray-900">{{ company.industry?LINE_OF_BUSINESS[company.industry - 1]:'--' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Founded')}}</p>
            <p class="text-lg text-gray-900">{{ company.establishment_date }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Employees')}}</p>
            <p class="text-lg text-gray-900">{{ company.package_config?company.package_config.maximum_user:'--' }}</p>
          </div>
          <!-- <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5 text-red-500" />
            <p class="text-gray-700">Publicly Traded</p>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5 text-red-500" />
            <p class="text-gray-700">Non-Profit</p>
          </div> -->
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">{{$t('Location')}}</h2>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Headquarters')}}</p>
            <p class="text-lg text-gray-900">{{ company.headquarter }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Address')}}</p>
            <p class="text-lg text-gray-900">{{ company.address }}</p>
          </div>
          <!-- <a href="#" class="flex items-center space-x-2 text-blue-500 hover:underline">
            <UIcon name="i-heroicons-map-pin" class="h-5 w-5" />
            <span>View Map</span>
          </a> -->
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">{{$t('Administrative Info')}}</h2>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">{{$t('Last Updated')}}</p>
            <p class="text-lg text-gray-900">{{ dayjs(company.updated_at).format('YYYY-MM-DD') }}</p>
          </div>
          <!-- <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500" />
            <p class="text-gray-700">Registered: Yes</p>
          </div> -->
        </div>
      </UCard>

    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

definePageMeta({
  title: 'Thông tin công ty'
})
const company = computedAsync(async () => {
  const data = await useAPI().$get('system/company/', {})
  return data.results[0]
}) 

const LINE_OF_BUSINESS = [t('Retail'), t('Wholesale'), t('Manufacturing'),t('Service'), t('Technology'), t('Healthcare'),
    t('Education') ,t('Finance') , t('Real Estate') , t('Transportation') ,t('Construction'), t('Hospitality') ,t('Entertainment') ,t('Agriculture'),t('Other')
];
</script>
