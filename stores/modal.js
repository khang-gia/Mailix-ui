import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", () => {
  const modalType = ref("");

  const alertModal = ref(false);
  const alertProps = ref({});
  const alertConfirm = ref(false);

  const authModalMode = ref("");
  const authModalOpen = ref(false);

  const feedbackModal = ref(false);
  const searchModal = ref(false);
  const articleTypeModal = ref(false);
  const draggableModal = ref(false);
  const draggableModalInfo = ref({
    embed_url: "",
    title: "",
  });
  const expandImageModal = ref(false);
  const imageData = ref({
    src: "",
    title: "",
    imageWidth: 0,
    imageHeight: 0,
  });
  const createModal = ref(false);
  const modalCreateType = ref("");
  const calendarCreateModal = ref(false);
  const calendarCreateType = ref("");
  const calendarCreateInfo = ref({});
  const defaultCreateInfo = ref({
    id: null,
    title: "",
    start_datetime: null,
    end_datetime: null,
    allDay: false,
    participants: [],
    description: "",
    user: null,
    color: "#039be5",
    priority: 2,
    has_reminder: false,
    notification_type: 3,
    reminder_time_value: 15,
    reminder_time_unit: "minutes",
    reminder_email: "",
    is_send_participants: false,
  });
  const isLive = computed(() => draggableModalInfo.value.embed_url !== "");

  function setModalType(type) {
    modalType.value = type;
  }

  function setAlertModal(value, props, confirm = false) {
    alertModal.value = value;
    alertProps.value = props;
    alertConfirm.value = confirm;
  }

  function setAuthModal(value, mode = "signin") {
    authModalMode.value = mode;
    authModalOpen.value = value;
  }
  function toggleDraggableModal() {
    draggableModal.value = !draggableModal.value;
  }
  function setDraggableModal(value) {
    draggableModal.value = value;
  }
  function setDraggableModalInfo(info) {
    draggableModalInfo.value = info;
  }
  function setFeedbackModal(value) {
    feedbackModal.value = value;
  }

  function setSearchModal(value) {
    searchModal.value = value;
  }
  function setCreateArticleTypeModal(value) {
    articleTypeModal.value = value;
  }
  function setExpandImageModal(value, data) {
    expandImageModal.value = value;
    imageData.value = data;
  }
  function setImageData(data) {
    imageData.value = data;
  }

  const createModalData = ref(null);

  function setCreateModal(value, type, data = null) {
    createModal.value = value;
    modalCreateType.value = type;
    createModalData.value = data;
  }
  function setCalendarCreateModal(value, type, info) {
    calendarCreateModal.value = value;
    calendarCreateType.value = type;
    calendarCreateInfo.value = {
      ...defaultCreateInfo.value,
      ...info,
    };
  }

  // Work Kanban Modal - separate from createModal to avoid conflicts
  const workKanbanModal = ref(false);
  const workKanbanInitialStatus = ref(1);

  function setWorkKanbanModal(value, status = 1) {
    workKanbanModal.value = value;
    workKanbanInitialStatus.value = status;
  }

  // Contact Kanban Modal - separate modal for contact creation from kanban
  const contactKanbanModal = ref(false);
  const contactKanbanInitialStatus = ref(1);

  function setContactKanbanModal(value, status = 1) {
    contactKanbanModal.value = value;
    contactKanbanInitialStatus.value = status;
  }

  const socialCommentModal = ref(false);
  const socialCommentPost = ref({});
  const socialCommentModalFullscreen = ref(false);
  function setSocialCommentModal(value, post = {}) {
    socialCommentModal.value = value;
    socialCommentPost.value = post;
  }
  function setSocialCommentModalFullscreen(value, post = {}) {
    socialCommentModalFullscreen.value = value;
    socialCommentPost.value = post;
  }

  const socialCreatePostModal = ref(false);
  const socialCreatePostType = ref(1); // 1 = post, 2 = poll
  const socialCreatePostGroupId = ref(null); // Track group context for posts
  const socialCreatePostData = ref(null); // Data for editing

  function setSocialCreatePostModal(
    value,
    postType = 1,
    groupId = null,
    postData = null,
  ) {
    socialCreatePostModal.value = value;
    socialCreatePostType.value = postType;
    socialCreatePostGroupId.value = groupId;
    socialCreatePostData.value = postData;
  }

  // Event Detail Modal (read-only, from TodayEvents)
  const eventDetailModal = ref(false);
  const eventDetailData = ref(null);

  function setEventDetailModal(value, event = null) {
    eventDetailModal.value = value;
    eventDetailData.value = event;
  }

  return {
    modalType,
    setModalType,
    setAlertModal,
    alertModal,
    alertProps,
    alertConfirm,
    setAuthModal,
    authModalMode,
    authModalOpen,
    setFeedbackModal,
    feedbackModal,
    setSearchModal,
    searchModal,
    draggableModal,
    toggleDraggableModal,
    draggableModalInfo,
    setDraggableModalInfo,
    setDraggableModal,
    isLive,
    setCreateArticleTypeModal,
    articleTypeModal,
    imageData,
    setExpandImageModal,
    expandImageModal,
    setImageData,
    setCreateModal,
    createModal,
    modalCreateType,
    createModalData,
    setCalendarCreateModal,
    calendarCreateModal,
    calendarCreateType,
    calendarCreateInfo,
    workKanbanModal,
    workKanbanInitialStatus,
    setWorkKanbanModal,
    contactKanbanModal,
    contactKanbanInitialStatus,
    setContactKanbanModal,
    socialCommentModal,
    socialCommentPost,
    setSocialCommentModal,
    socialCommentModalFullscreen,
    setSocialCommentModalFullscreen,
    socialCreatePostModal,
    setSocialCreatePostModal,
    socialCreatePostType,
    socialCreatePostGroupId,
    socialCreatePostData,
    eventDetailModal,
    eventDetailData,
    setEventDetailModal,
  };
});
