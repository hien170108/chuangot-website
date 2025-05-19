// Import API module (assuming it's in a separate file)
import * as API from "../api.js"

// Kiểm tra đăng nhập
async function checkLogin() {
  try {
    const result = await API.auth.checkLoginStatus()
    if (!result.success) {
      window.location.href = "index.html"
    }
    return result.user
  } catch (error) {
    window.location.href = "index.html"
  }
}

// Hiển thị thông báo toast
function showToast(type, title, message) {
  const toastContainer = document.getElementById("toastContainer")

  // Tạo toast element
  const toast = document.createElement("div")
  toast.className = "admin-toast"

  // Thêm nội dung cho toast
  toast.innerHTML = `
        <div class="admin-toast-icon ${type}">
            <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : type === "warning" ? "exclamation" : "info"}-circle"></i>
        </div>
        <div class="admin-toast-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
        <button class="admin-toast-close"><i class="fas fa-times"></i></button>
    `

  // Thêm toast vào container
  toastContainer.appendChild(toast)

  // Hiển thị toast
  setTimeout(() => {
    toast.classList.add("active")
  }, 100)

  // Xử lý sự kiện đóng toast
  const closeBtn = toast.querySelector(".admin-toast-close")
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("active")
    setTimeout(() => {
      toast.remove()
    }, 300)
  })

  // Tự động đóng toast sau 5 giây
  setTimeout(() => {
    toast.classList.remove("active")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 5000)
}

// Hiển thị loading spinner
function showLoading() {
  const spinner = document.getElementById("loadingSpinner")
  spinner.classList.add("active")
}

// Ẩn loading spinner
function hideLoading() {
  const spinner = document.getElementById("loadingSpinner")
  spinner.classList.remove("active")
}

// Cập nhật thông tin người dùng trên giao diện
function updateUserInfo(user) {
  const userAvatar = document.getElementById("userAvatar")
  const userName = document.getElementById("userName")

  if (userAvatar && userName && user) {
    // Hiển thị chữ cái đầu tiên của tên người dùng trong avatar
    userAvatar.textContent = user.full_name.charAt(0)
    userName.textContent = user.full_name
  }
}

// Hiển thị danh sách người dùng
async function displayUsers() {
  try {
    showLoading()
    const result = await API.users.getAll()
    hideLoading()

    if (result.success) {
      const users = result.data
      const tableBody = document.querySelector("#usersTable tbody")

      if (tableBody) {
        // Xóa dữ liệu cũ
        tableBody.innerHTML = ""

        // Thêm dữ liệu mới
        users.forEach((user) => {
          const row = document.createElement("tr")

          row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email || ""}</td>
                        <td>${user.role}</td>
                        <td class="actions">
                            <button class="edit" data-id="${user.id}" title="Sửa"><i class="fas fa-edit"></i></button>
                            <button class="delete" data-id="${user.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                        </td>
                    `

          tableBody.appendChild(row)
        })

        // Thêm sự kiện cho các nút
        addUserButtonEvents()
      }
    } else {
      showToast("error", "Lỗi", result.error)
    }
  } catch (error) {
    hideLoading()
    showToast("error", "Lỗi", error.message)
  }
}

// Thêm sự kiện cho các nút trong bảng người dùng
function addUserButtonEvents() {
  // Nút sửa người dùng
  document.querySelectorAll("#usersTable .edit").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = Number.parseInt(button.getAttribute("data-id"))
      openEditUserModal(userId)
    })
  })

  // Nút xóa người dùng
  document.querySelectorAll("#usersTable .delete").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = Number.parseInt(button.getAttribute("data-id"))
      openDeleteConfirmDialog(userId)
    })
  })
}

// Mở modal xác nhận xóa người dùng
function openDeleteConfirmDialog(userId) {
  const dialog = document.getElementById("deleteConfirmDialog")
  const confirmBtn = document.getElementById("confirmDeleteBtn")
  const cancelBtn = document.getElementById("cancelDeleteBtn")

  // Hiển thị dialog
  dialog.classList.add("active")

  // Xử lý sự kiện xác nhận xóa
  confirmBtn.onclick = async () => {
    try {
      showLoading()
      const result = await API.users.delete(userId)
      hideLoading()

      if (result.success) {
        dialog.classList.remove("active")
        showToast("success", "Thành công", result.message)
        displayUsers() // Tải lại danh sách người dùng
      } else {
        showToast("error", "Lỗi", result.error)
      }
    } catch (error) {
      hideLoading()
      showToast("error", "Lỗi", error.message)
    }
  }

  // Xử lý sự kiện hủy
  cancelBtn.onclick = () => {
    dialog.classList.remove("active")
  }
}

// Mở modal thêm người dùng mới
function openAddUserModal() {
  const modal = document.getElementById("userModal")
  const modalTitle = document.getElementById("userModalTitle")
  const form = document.getElementById("userForm")
  const passwordNote = document.getElementById("passwordNote")

  // Đặt tiêu đề modal
  modalTitle.textContent = "Thêm Người Dùng Mới"

  // Reset form
  form.reset()
  document.getElementById("userId").value = ""

  // Hiển thị ghi chú mật khẩu
  passwordNote.style.display = "none"
  document.getElementById("password").required = true

  // Hiển thị modal
  modal.classList.add("active")
}

// Mở modal chỉnh sửa người dùng
async function openEditUserModal(userId) {
  try {
    showLoading()
    const result = await API.users.getById(userId)
    hideLoading()

    if (result.success) {
      const user = result.data
      const modal = document.getElementById("userModal")
      const modalTitle = document.getElementById("userModalTitle")
      const form = document.getElementById("userForm")
      const passwordNote = document.getElementById("passwordNote")

      // Đặt tiêu đề modal
      modalTitle.textContent = "Chỉnh Sửa Người Dùng"

      // Điền thông tin người dùng vào form
      document.getElementById("userId").value = user.id
      document.getElementById("username").value = user.username
      document.getElementById("fullName").value = user.fullName
      document.getElementById("email").value = user.email || ""
      document.getElementById("role").value = user.role
      document.getElementById("password").value = ""

      // Hiển thị ghi chú mật khẩu
      passwordNote.style.display = "block"
      document.getElementById("password").required = false

      // Hiển thị modal
      modal.classList.add("active")
    } else {
      showToast("error", "Lỗi", result.error)
    }
  } catch (error) {
    hideLoading()
    showToast("error", "Lỗi", error.message)
  }
}

// Lưu người dùng
async function saveUser(formData) {
  try {
    showLoading()

    // Nếu có ID, cập nhật người dùng, ngược lại thêm mới
    const result = formData.id ? await API.users.update(formData) : await API.users.add(formData)

    hideLoading()

    if (result.success) {
      showToast(
        "success",
        "Thành công",
        formData.id ? "Đã cập nhật người dùng thành công!" : "Đã thêm người dùng mới thành công!",
      )

      // Tải lại danh sách người dùng
      displayUsers()

      // Đóng modal
      document.getElementById("userModal").classList.remove("active")
    } else {
      showToast("error", "Lỗi", result.error)
    }
  } catch (error) {
    hideLoading()
    showToast("error", "Lỗi", error.message)
  }
}

// Xử lý sự kiện đăng xuất
async function handleLogout() {
  try {
    const result = await API.auth.logout()
    if (result.success) {
      window.location.href = "index.html"
    } else {
      showToast("error", "Lỗi", result.error)
    }
  } catch (error) {
    showToast("error", "Lỗi", error.message)
  }
}

// Xử lý sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Kiểm tra đăng nhập
    const user = await checkLogin()

    // Hiển thị thông tin người dùng
    updateUserInfo(user)

    // Hiển thị danh sách người dùng
    await displayUsers()

    // Xử lý sự kiện đăng xuất
    const logoutBtn = document.getElementById("logoutBtn")
    const userLogoutBtn = document.getElementById("userLogoutBtn")

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        handleLogout()
      })
    }

    if (userLogoutBtn) {
      userLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        handleLogout()
      })
    }

    // Xử lý sự kiện hiển thị dropdown menu người dùng
    const userMenuToggle = document.getElementById("userMenuToggle")
    const userDropdown = document.getElementById("userDropdown")

    if (userMenuToggle && userDropdown) {
      userMenuToggle.addEventListener("click", () => {
        userDropdown.classList.toggle("active")
      })

      // Đóng dropdown khi click ra ngoài
      document.addEventListener("click", (e) => {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove("active")
        }
      })
    }

    // Xử lý sự kiện thêm người dùng mới
    const addUserBtn = document.getElementById("addUserBtn")
    if (addUserBtn) {
      addUserBtn.addEventListener("click", openAddUserModal)
    }

    // Xử lý sự kiện đóng modal
    const closeUserModal = document.getElementById("closeUserModal")
    const cancelUserBtn = document.getElementById("cancelUserBtn")
    const userModal = document.getElementById("userModal")

    if (closeUserModal && userModal) {
      closeUserModal.addEventListener("click", () => {
        userModal.classList.remove("active")
      })
    }

    if (cancelUserBtn && userModal) {
      cancelUserBtn.addEventListener("click", () => {
        userModal.classList.remove("active")
      })
    }

    // Xử lý sự kiện submit form người dùng
    const userForm = document.getElementById("userForm")
    if (userForm) {
      userForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Lấy dữ liệu từ form
        const formData = {
          id: document.getElementById("userId").value,
          username: document.getElementById("username").value,
          fullName: document.getElementById("fullName").value,
          email: document.getElementById("email").value,
          role: document.getElementById("role").value,
          password: document.getElementById("password").value,
        }

        // Lưu người dùng
        saveUser(formData)
      })
    }

    // Hiển thị thông báo chào mừng
    showToast("success", "Chào mừng", `Xin chào, ${user.full_name}!`)
  } catch (error) {
    showToast("error", "Lỗi", error.message)
  }
})
