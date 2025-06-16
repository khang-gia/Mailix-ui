import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', () => {
  const stockListModal = ref(false)
  const stockInfoModal = ref(false)
  const indexInfoModal = ref(false)
  const indexInfo = ref(null)
  const modalType = ref('')
  const stockListInfo = ref(null)

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
  const createAccountModal = ref(false)
  const accountData = ref({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const isLive = computed(() => draggableModalInfo.value.embed_url !== '')
  function setStockListModal(value) {
    stockListModal.value = value
  }

  function setModalType(type) {
    modalType.value = type
  }

  function setStockListInfo(id) {
    stockListInfo.value = id
  }

  function setStockInfoModal(value, symbol) {
    stockInfoModal.value = value
  }

  function setIndexInfoModal(value, idx) {
    indexInfoModal.value = value
    indexInfo.value = idx
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
  function setCreateAccountModal(value, data) {
    createAccountModal.value = value
    if (data) {
      accountData.value = data
    }
  }
  function setAccountData(data) {
    accountData.value = data
  }
  return { 
    setStockListModal, stockListModal,
    setStockInfoModal, stockInfoModal,
    modalType, stockListInfo, setModalType, setStockListInfo,
    setIndexInfoModal, indexInfoModal, indexInfo, setAlertModal, alertModal, alertProps, alertConfirm,
    setAuthModal, authModalMode, authModalOpen,
    setFeedbackModal, feedbackModal,
    setSearchModal, searchModal, draggableModal, toggleDraggableModal, draggableModalInfo, setDraggableModalInfo, setDraggableModal, isLive,
    setCreateArticleTypeModal, articleTypeModal, imageData, setExpandImageModal, expandImageModal,
    setImageData,setCreateAccountModal, createAccountModal, accountData, setAccountData
  }
})