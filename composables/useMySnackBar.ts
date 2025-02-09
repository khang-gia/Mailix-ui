export const useMySnackBar = () => {
  const snackbar = useSnackbar()
  return {
    success: (message: string, title: string = '') => {
      snackbar.add({
        title: title? title: undefined,
        text: message,
        type: 'success',
      })
    },
    error: (message: string, title: string = '') => {
      snackbar.add({
        title: title? title: undefined,
        text: message,
        type: 'error',
      })
    },
    httpError: (error: any) => {
      let msg = ''

      switch (error.statusCode) {
        case 403:
          msg = 'Bạn không có quyền thực hiện thao tác này.'
          break
        case 401:
          msg = 'Vui lòng đăng nhập để thực hiện thao tác.'
          break
        case 400:
          msg = 'Thông tin chưa đúng, vui lòng kiểm tra lại.'
          break
        default:
          msg = 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên.'
          break
      }
      snackbar.add({
        text: msg,
        type: 'error',
      })

    }
  }
}