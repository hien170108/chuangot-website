// Kiểm tra đăng nhập
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn")
  if (!isLoggedIn || isLoggedIn !== "true") {
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
function updateUserInfo() {
  const userInfo = JSON.parse(sessionStorage.getItem("adminUser"))
  if (userInfo) {
    const userAvatar = document.getElementById("userAvatar")
    const userName = document.getElementById("userName")

    if (userAvatar && userName) {
      // Hiển thị chữ cái đầu tiên của tên người dùng trong avatar
      userAvatar.textContent = userInfo.fullName.charAt(0)
      userName.textContent = userInfo.fullName
    }
  }
}

// Hiển thị danh sách danh mục
function displayCategories() {
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const products = JSON.parse(localStorage.getItem("products"))
  const tableBody = document.querySelector("#categoriesTable tbody")

  if (categories && tableBody) {
    // Xóa dữ liệu cũ
    tableBody.innerHTML = ""

    // Thêm dữ liệu mới
    categories.forEach((category) => {
      // Đếm số sản phẩm trong danh mục
      const productCount = products.filter((product) => product.category === category.code).length

      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.code}</td>
                <td>${category.description || ""}</td>
                <td>${productCount}</td>
                <td class="actions">
                    <button class="edit" data-id="${category.id}" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-id="${category.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `

      tableBody.appendChild(row)
    })

    // Thêm sự kiện cho các nút
    addCategoryButtonEvents()
  }
}

// Thêm sự kiện cho các nút trong bảng danh mục
function addCategoryButtonEvents() {
  // Nút sửa danh mục
  document.querySelectorAll("#categoriesTable .edit").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = Number.parseInt(button.getAttribute("data-id"))
      openEditCategoryModal(categoryId)
    })
  })

  // Nút xóa danh mục
  document.querySelectorAll("#categoriesTable .delete").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = Number.parseInt(button.getAttribute("data-id"))
      openDeleteConfirmDialog(categoryId)
    })
  })
}

// Mở modal xác nhận xóa danh mục
function openDeleteConfirmDialog(categoryId) {
  const dialog = document.getElementById("deleteConfirmDialog")
  const confirmBtn = document.getElementById("confirmDeleteBtn")
  const cancelBtn = document.getElementById("cancelDeleteBtn")

  // Hiển thị dialog
  dialog.classList.add("active")

  // Xử lý sự kiện xác nhận xóa
  confirmBtn.onclick = () => {
    deleteCategory(categoryId)
    dialog.classList.remove("active")
  }

  // Xử lý sự kiện hủy
  cancelBtn.onclick = () => {
    dialog.classList.remove("active")
  }
}

// Xóa danh mục
function deleteCategory(categoryId) {
  // Lấy danh sách danh mục
  let categories = JSON.parse(localStorage.getItem("productCategories"))
  const products = JSON.parse(localStorage.getItem("products"))

  // Kiểm tra xem danh mục có sản phẩm không
  const category = categories.find((cat) => cat.id === categoryId)
  if (category) {
    const hasProducts = products.some((product) => product.category === category.code)

    if (hasProducts) {
      showToast("error", "Lỗi", "Không thể xóa danh mục này vì có sản phẩm thuộc danh mục!")
      return
    }

    // Lọc ra danh mục cần xóa
    categories = categories.filter((cat) => cat.id !== categoryId)

    // Lưu lại danh sách danh mục
    localStorage.setItem("productCategories", JSON.stringify(categories))

    // Cập nhật số liệu thống kê
    updateCategoryStats()

    // Hiển thị lại danh sách danh mục
    displayCategories()

    // Hiển thị thông báo
    showToast("success", "Thành công", "Đã xóa danh mục thành công!")
  }
}

// Cập nhật số liệu thống kê danh mục
function updateCategoryStats() {
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const stats = JSON.parse(localStorage.getItem("websiteStats"))

  stats.categories = categories.length

  localStorage.setItem("websiteStats", JSON.stringify(stats))
}

// Mở modal thêm danh mục mới
function openAddCategoryModal() {
  const modal = document.getElementById("categoryModal")
  const modalTitle = document.getElementById("categoryModalTitle")
  const form = document.getElementById("categoryForm")

  // Đặt tiêu đề modal
  modalTitle.textContent = "Thêm Danh Mục Mới"

  // Reset form
  form.reset()
  document.getElementById("categoryId").value = ""

  // Hiển thị modal
  modal.classList.add("active")
}

// Mở modal chỉnh sửa danh mục
function openEditCategoryModal(categoryId) {
  const modal = document.getElementById("categoryModal")
  const modalTitle = document.getElementById("categoryModalTitle")
  const form = document.getElementById("categoryForm")

  // Đặt tiêu đề modal
  modalTitle.textContent = "Chỉnh Sửa Danh Mục"

  // Lấy thông tin danh mục
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const category = categories.find((cat) => cat.id === categoryId)

  if (category) {
    // Điền thông tin danh mục vào form
    document.getElementById("categoryId").value = category.id
    document.getElementById("categoryName").value = category.name
    document.getElementById("categoryCode").value = category.code
    document.getElementById("categoryDescription").value = category.description || ""

    // Hiển thị modal
    modal.classList.add("active")
  } else {
    showToast("error", "Lỗi", "Không tìm thấy danh mục!")
  }
}

// Lưu danh mục
function saveCategory(formData) {
  // Lấy danh sách danh mục
  const categories = JSON.parse(localStorage.getItem("productCategories"))

  // Tạo đối tượng danh mục mới
  const category = {
    id: formData.id ? Number.parseInt(formData.id) : Math.max(...categories.map((cat) => cat.id), 0) + 1,
    name: formData.name,
    code: formData.code,
    description: formData.description,
  }

  // Kiểm tra xem mã danh mục đã tồn tại chưa
  const existingCategory = categories.find(
    (cat) => cat.code === formData.code && (!formData.id || cat.id !== Number.parseInt(formData.id)),
  )

  if (existingCategory) {
    showToast("error", "Lỗi", "Mã danh mục đã tồn tại!")
    return false
  }

  // Nếu là chỉnh sửa danh mục
  if (formData.id) {
    // Tìm vị trí danh mục trong mảng
    const index = categories.findIndex((cat) => cat.id === Number.parseInt(formData.id))

    // Cập nhật danh mục
    if (index !== -1) {
      categories[index] = category
    }
  } else {
    // Thêm danh mục mới
    categories.push(category)
  }

  // Lưu lại danh sách danh mục
  localStorage.setItem("productCategories", JSON.stringify(categories))

  // Cập nhật số liệu thống kê
  updateCategoryStats()

  // Hiển thị lại danh sách danh mục
  displayCategories()

  // Hiển thị thông báo
  showToast(
    "success",
    "Thành công",
    formData.id ? "Đã cập nhật danh mục thành công!" : "Đã thêm danh mục mới thành công!",
  )

  return true
}

// Xử lý sự kiện đăng xuất
function handleLogout() {
  sessionStorage.removeItem("adminLoggedIn")
  sessionStorage.removeItem("adminUser")
  window.location.href = "index.html"
}

// Xử lý sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập
  checkLogin()

  // Hiển thị thông tin người dùng
  updateUserInfo()

  // Hiển thị danh sách danh mục
  displayCategories()

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

  // Xử lý sự kiện thêm danh mục mới
  const addCategoryBtn = document.getElementById("addCategoryBtn")
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", openAddCategoryModal)
  }

  // Xử lý sự kiện đóng modal
  const closeCategoryModal = document.getElementById("closeCategoryModal")
  const cancelCategoryBtn = document.getElementById("cancelCategoryBtn")
  const categoryModal = document.getElementById("categoryModal")

  if (closeCategoryModal && categoryModal) {
    closeCategoryModal.addEventListener("click", () => {
      categoryModal.classList.remove("active")
    })
  }

  if (cancelCategoryBtn && categoryModal) {
    cancelCategoryBtn.addEventListener("click", () => {
      categoryModal.classList.remove("active")
    })
  }

  // Xử lý sự kiện submit form danh mục
  const categoryForm = document.getElementById("categoryForm")
  if (categoryForm) {
    categoryForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const formData = {
        id: document.getElementById("categoryId").value,
        name: document.getElementById("categoryName").value,
        code: document.getElementById("categoryCode").value,
        description: document.getElementById("categoryDescription").value,
      }

      // Lưu danh mục
      const success = saveCategory(formData)

      // Nếu lưu thành công thì đóng modal
      if (success) {
        categoryModal.classList.remove("active")
      }
    })
  }
})
