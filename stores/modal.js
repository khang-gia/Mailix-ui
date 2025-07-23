import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', () => {
  const modalType = ref('')

  const alertModal = ref(false)
  const alertProps = ref({})
  const alertConfirm = ref(false)

  const authModalMode = ref('')
  const authModalOpen = ref(false)

  const feedbackModal = ref(false)
  const searchModal = ref(false)
  const articleTypeModal = ref(false)
  const draggableModal = ref(false)
  const draggableModalInfo = ref({
    embed_url: '',
    title: ''
  })
  const expandImageModal = ref(false)
  const imageData = ref({
    src: '',
    title: '',
    imageWidth: 0,
    imageHeight: 0
  })
  const createModal = ref(false)
  const modalCreateType = ref('')
  const calendarCreateModal = ref(false)
  const calendarCreateType = ref('')
  const calendarCreateInfo = ref({
  })
  const defaultCreateInfo = ref({
    id: null,
    title: '',
    start_datetime: null,
    end_datetime: null,
    allDay: false,
    participants: [],
    description: '',
    user: null,
    color: '#039be5',
    priority: 2,
    has_reminder: false,
    notification_type: 3,
    reminder_time_value: 15,
    reminder_time_unit: 'minutes',
    reminder_email: '',
    is_send_participants: false
  })
  const isLive = computed(() => draggableModalInfo.value.embed_url !== '')

  function setModalType(type) {
    modalType.value = type
  }


  function setAlertModal(value, props, confirm = false) {
    alertModal.value = value
    alertProps.value = props
    alertConfirm.value = confirm
  }

  function setAuthModal(value, mode = 'signin') {
    authModalMode.value = mode
    authModalOpen.value = value
  }
  function toggleDraggableModal() {
    draggableModal.value = !draggableModal.value
  }
  function setDraggableModal(value) {
    draggableModal.value = value
  }
  function setDraggableModalInfo(info) {
    draggableModalInfo.value = info
  }
  function setFeedbackModal(value) {
    feedbackModal.value = value
  }

  function setSearchModal(value) {
    searchModal.value = value
  }
  function setCreateArticleTypeModal(value) {
    articleTypeModal.value = value
  }
  function setExpandImageModal(value, data) {
    expandImageModal.value = value
    imageData.value = data
  }
  function setImageData(data) {
    imageData.value = data
  }
  function setCreateModal(value, type) {
    createModal.value = value
    modalCreateType.value = type
  }
  function setCalendarCreateModal(value, type, info) {
    calendarCreateModal.value = value
    calendarCreateType.value = type
    calendarCreateInfo.value = {
      ...defaultCreateInfo.value,
      ...info
    }
  }
  return { 
    modalType, setModalType, setAlertModal, alertModal, alertProps, alertConfirm,
    setAuthModal, authModalMode, authModalOpen,
    setFeedbackModal, feedbackModal,
    setSearchModal, searchModal, draggableModal, toggleDraggableModal, draggableModalInfo, setDraggableModalInfo, setDraggableModal, isLive,
    setCreateArticleTypeModal, articleTypeModal, imageData, setExpandImageModal, expandImageModal,
    setImageData,setCreateModal, createModal, modalCreateType, setCalendarCreateModal, calendarCreateModal, calendarCreateType, calendarCreateInfo
  }
})