<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('Contact Detail') }}
      </h1>
      <div class="flex space-x-3">
        <UButton icon="i-heroicons-pencil-square" :label="$t('Update')" :to="{name: 'contacts-id-update'}" />
        <UButton icon="i-heroicons-trash" :label="$t('Delete')" color="red" variant="outline" />
        
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      <div class="lg:col-span-1">
        <UCard class="p-4 h-full">
          <div class="flex flex-col items-center">
            
            <UAvatar
              :src="contact.avatar"
              :alt="contact.name"
              size="3xl"
              class="mb-4"
            />
            <span class="text-mailix-primary text-2xl">{{ contact.name }}</span>
            <span class="text-sm text-gray-500 mt-1">{{ contact.customer_code || '--' }}</span>
          </div>

          <UDivider class="my-6" />

          <div class="space-y-4 text-sm">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 justify-center text-gray-400" />
              <span class="font-medium truncate items-center">{{ contact.phone || '--' }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 justify-center text-gray-400" />
              <span v-if="contact.mail" class="font-medium truncate cursor-pointer hover:text-blue-700" @click="copyToClipboard(contact.mail)">{{ contact.mail }}</span>
              <span v-else class="font-medium truncate">--</span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 justify-center text-gray-400" />
              <span v-if="contact.address" class="font-medium truncate cursor-pointer hover:text-blue-700 " @click="copyToClipboard(contact.address)">{{ contact.address }}</span>
              <span v-else class="font-medium truncate">--</span>
            </div>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-3">
        <UCard class="p-4">
          <UTabs :items="tabs" class="w-full">
            <template #item="{ item }">
              <div class="mt-4 p-4">
                
                <div v-if="item.key === 'basic_info'" class="space-y-6">
                    <h2 class="text-xl font-semibold border-b pb-3 mb-4 text-gray-800 dark:text-gray-100">{{ $t('Personal Information') }}</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                      <ContactDetailItem label="Email" :value="contact.email" />
                      <ContactDetailItem label="Name" :value="contact.name" />
                      <ContactDetailItem label="Contact title" :value="contact.title" />
                      
                      <ContactDetailItem label="Dob" :value="dayjs(contact.dob).format('YYYY-MM-DD')" />
                      <ContactDetailItem label="Gender" :value="contact.gender" />
                      <ContactDetailItem label="Type of contact" :value="contact.type_of_customer_display" />
                      
                      <ContactDetailItem label="Curators" :value="contact.curators_list" />
                      <ContactDetailItem label="Contact Source" :value="contact.customer_source_display" />
                    </div>
                </div>

                <div v-else-if="item.key === 'additional_info'" class="space-y-6">
                    <h2 class="text-xl font-semibold border-b pb-3 mb-4 text-gray-800 dark:text-gray-100">{{ $t('Descriptions & Accounting') }}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                      <ContactDetailItem label="Tax Code" :value="contact.tax_code" />
                      <ContactDetailItem label="Id Number" :value="contact.id_number" />
                      
                      <div class="md:col-span-2 lg:col-span-3">
                         <ContactDetailItem label="Description" :value="contact.description" />
                      </div>
                    </div>
                </div>
                
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>
</template>
<script setup>
const dayjs = useDayjs()
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Hồ sơ liên hệ',
  hideTitle: true,
})
const route = useRoute()
const contact = ref({})
const tabs = [{
  label: t('Basic Information'),
  key: 'basic_info',
}, {
  label: t('Additional Information'),
  key: 'additional_info',
}]
const loadData = async () => {
    try {
        const {data: response} = await useAPI().get(`core/customers/${useRoute().params.id}/`);
        contact.value = response.value
        contact.value.dob = contact.value.dob ? new Date(contact.value.dob) : null
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
loadData()
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // alert('Copied to clipboard!');
    useToast().add({
      description: 'Copied to clipboard!',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 1000,
      position: 'top-0',
    })
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>