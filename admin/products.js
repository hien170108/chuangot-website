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

// Hiển thị danh sách sản phẩm
function displayProducts(products, categories) {
  const tableBody = document.querySelector("#productsTable tbody")

  if (tableBody) {
    // Xóa dữ liệu cũ
    tableBody.innerHTML = ""

    // Thêm dữ liệu mới
    products.forEach((product) => {
      const category = categories.find((cat) => cat.code === product.category)
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                <td>${product.name}</td>
                <td>${category ? category.name : "Không xác định"}</td>
                <td>${product.price}</td>
                <td class="actions">
                    <button class="view" data-id="${product.id}" title="Xem"><i class="fas fa-eye"></i></button>
                    <button class="edit" data-id="${product.id}" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-id="${product.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `

      tableBody.appendChild(row)
    })

    // Thêm sự kiện cho các nút
    addProductButtonEvents()
  }
}

// Thêm sự kiện cho các nút trong bảng sản phẩm
function addProductButtonEvents() {
  // Nút xem sản phẩm
  document.querySelectorAll("#productsTable .view").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      window.open(`../product-detail.html?id=${productId}`, "_blank")
    })
  })

  // Nút sửa sản phẩm
  document.querySelectorAll("#productsTable .edit").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      openEditProductModal(productId)
    })
  })

  // Nút xóa sản phẩm
  document.querySelectorAll("#productsTable .delete").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      openDeleteConfirmDialog(productId)
    })
  })
}

// Mở modal xác nhận xóa sản phẩm
function openDeleteConfirmDialog(productId) {
  const dialog = document.getElementById("deleteConfirmDialog")
  const confirmBtn = document.getElementById("confirmDeleteBtn")
  const cancelBtn = document.getElementById("cancelDeleteBtn")

  // Hiển thị dialog
  dialog.classList.add("active")

  // Xử lý sự kiện xác nhận xóa
  confirmBtn.onclick = () => {
    deleteProduct(productId)
    dialog.classList.remove("active")
  }

  // Xử lý sự kiện hủy
  cancelBtn.onclick = () => {
    dialog.classList.remove("active")
  }
}

// Xóa sản phẩm
function deleteProduct(productId) {
  // Lấy danh sách sản phẩm
  let products = JSON.parse(localStorage.getItem("products"))

  // Lọc ra sản phẩm cần xóa
  products = products.filter((product) => product.id !== productId)

  // Lưu lại danh sách sản phẩm
  localStorage.setItem("products", JSON.stringify(products))

  // Cập nhật số liệu thống kê
  updateProductStats()

  // Hiển thị lại danh sách sản phẩm
  loadProducts()

  // Hiển thị thông báo
  showToast("success", "Thành công", "Đã xóa sản phẩm thành công!")
}

// Cập nhật số liệu thống kê sản phẩm
function updateProductStats() {
  const products = JSON.parse(localStorage.getItem("products"))
  const stats = JSON.parse(localStorage.getItem("websiteStats"))

  stats.products = products.length

  localStorage.setItem("websiteStats", JSON.stringify(stats))
}

// Mở modal thêm sản phẩm mới
function openAddProductModal() {
  const modal = document.getElementById("productModal")
  const modalTitle = document.getElementById("productModalTitle")
  const form = document.getElementById("productForm")

  // Đặt tiêu đề modal
  modalTitle.textContent = "Thêm Sản Phẩm Mới"

  // Reset form
  form.reset()
  document.getElementById("productId").value = ""

  // Ẩn preview hình ảnh
  document.getElementById("imagePreview").style.display = "none"

  // Hiển thị modal
  modal.classList.add("active")
}

// Mở modal chỉnh sửa sản phẩm
function openEditProductModal(productId) {
  const modal = document.getElementById("productModal")
  const modalTitle = document.getElementById("productModalTitle")
  const form = document.getElementById("productForm")

  // Đặt tiêu đề modal
  modalTitle.textContent = "Chỉnh Sửa Sản Phẩm"

  // Lấy thông tin sản phẩm
  const products = JSON.parse(localStorage.getItem("products"))
  const product = products.find((p) => p.id === productId)

  if (product) {
    // Điền thông tin sản phẩm vào form
    document.getElementById("productId").value = product.id
    document.getElementById("productName").value = product.name
    document.getElementById("productCategory").value = product.category
    document.getElementById("productPrice").value = product.price
    document.getElementById("productDescription").value = product.description
    document.getElementById("productLongDescription").value = product.longDescription || ""
    document.getElementById("productImage").value = product.image

    // Hiển thị preview hình ảnh
    const previewImg = document.getElementById("previewImg")
    const imagePreview = document.getElementById("imagePreview")
    previewImg.src = product.image
    imagePreview.style.display = "block"

    // Điền thông tin dinh dưỡng
    if (product.nutrition) {
      document.getElementById("nutritionCalories").value = product.nutrition.calories || "110 kcal"
      document.getElementById("nutritionFat").value = product.nutrition.fat || "3g"
      document.getElementById("nutritionSaturatedFat").value = product.nutrition.saturatedFat || "2g"
      document.getElementById("nutritionCholesterol").value = product.nutrition.cholesterol || "10mg"
      document.getElementById("nutritionSodium").value = product.nutrition.sodium || "50mg"
      document.getElementById("nutritionCarbs").value = product.nutrition.carbs || "17g"
      document.getElementById("nutritionSugar").value = product.nutrition.sugar || "15g"
      document.getElementById("nutritionProtein").value = product.nutrition.protein || "4g"
      document.getElementById("nutritionCalcium").value = product.nutrition.calcium || "150mg"
      document.getElementById("nutritionVitaminD").value = product.nutrition.vitaminD || "2µg"
    }

    // Điền thông tin nổi bật
    document.getElementById("productFeatured").checked = !!product.featured

    // Hiển thị modal
    modal.classList.add("active")
  } else {
    showToast("error", "Lỗi", "Không tìm thấy sản phẩm!")
  }
}

// Lưu sản phẩm
function saveProduct(formData) {
  // Lấy danh sách sản phẩm
  const products = JSON.parse(localStorage.getItem("products"))

  // Tạo đối tượng sản phẩm mới
  const product = {
    id: formData.id ? Number.parseInt(formData.id) : Math.max(...products.map((p) => p.id), 0) + 1,
    name: formData.name,
    price: formData.price,
    image: formData.image,
    category: formData.category,
    description: formData.description,
    longDescription: formData.longDescription,
    nutrition: {
      calories: formData.nutritionCalories,
      fat: formData.nutritionFat,
      saturatedFat: formData.nutritionSaturatedFat,
      cholesterol: formData.nutritionCholesterol,
      sodium: formData.nutritionSodium,
      carbs: formData.nutritionCarbs,
      sugar: formData.nutritionSugar,
      protein: formData.nutritionProtein,
      calcium: formData.nutritionCalcium,
      vitaminD: formData.nutritionVitaminD,
    },
    featured: formData.featured ? 1 : 0,
  }

  // Nếu là chỉnh sửa sản phẩm
  if (formData.id) {
    // Tìm vị trí sản phẩm trong mảng
    const index = products.findIndex((p) => p.id === Number.parseInt(formData.id))

    // Cập nhật sản phẩm
    if (index !== -1) {
      products[index] = product
    }
  } else {
    // Thêm sản phẩm mới
    products.push(product)
  }

  // Lưu lại danh sách sản phẩm
  localStorage.setItem("products", JSON.stringify(products))

  // Cập nhật số liệu thống kê
  updateProductStats()

  // Hiển thị lại danh sách sản phẩm
  loadProducts()

  // Hiển thị thông báo
  showToast(
    "success",
    "Thành công",
    formData.id ? "Đã cập nhật sản phẩm thành công!" : "Đã thêm sản phẩm mới thành công!",
  )
}

// Tải danh sách danh mục
function loadCategories() {
  const categories = JSON.parse(localStorage.getItem("productCategories"))

  // Điền danh mục vào dropdown filter
  const categoryFilter = document.getElementById("categoryFilter")
  const productCategory = document.getElementById("productCategory")

  if (categoryFilter && categories) {
    // Xóa các option cũ
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1)
    }

    // Thêm các option mới
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.code
      option.textContent = category.name
      categoryFilter.appendChild(option)
    })
  }

  if (productCategory && categories) {
    // Xóa các option cũ
    while (productCategory.options.length > 0) {
      productCategory.remove(0)
    }

    // Thêm các option mới
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.code
      option.textContent = category.name
      productCategory.appendChild(option)
    })
  }

  return categories
}

// Tải danh sách sản phẩm
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products"))
  const categories = loadCategories()

  if (products && categories) {
    // Lọc sản phẩm theo danh mục nếu có
    const categoryFilter = document.getElementById("categoryFilter")
    const searchInput = document.getElementById("searchProduct")

    let filteredProducts = [...products]

    // Lọc theo danh mục
    if (categoryFilter && categoryFilter.value) {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryFilter.value)
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchInput && searchInput.value) {
      const searchTerm = searchInput.value.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm),
      )
    }

    // Hiển thị danh sách sản phẩm
    displayProducts(filteredProducts, categories)
  }
}

// Xử lý sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập
  checkLogin()

  // Hiển thị thông tin người dùng
  updateUserInfo()

  // Tải danh sách sản phẩm
  loadProducts()

  // Xử lý sự kiện đăng xuất
  const logoutBtn = document.getElementById("logoutBtn")
  const userLogoutBtn = document.getElementById("userLogoutBtn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sessionStorage.removeItem("adminLoggedIn")
      sessionStorage.removeItem("adminUser")
      window.location.href = "index.html"
    })
  }

  if (userLogoutBtn) {
    userLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sessionStorage.removeItem("adminLoggedIn")
      sessionStorage.removeItem("adminUser")
      window.location.href = "index.html"
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

  // Xử lý sự kiện thêm sản phẩm mới
  const addProductBtn = document.getElementById("addProductBtn")
  if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddProductModal)
  }

  // Xử lý sự kiện đóng modal
  const closeProductModal = document.getElementById("closeProductModal")
  const cancelProductBtn = document.getElementById("cancelProductBtn")
  const productModal = document.getElementById("productModal")

  if (closeProductModal && productModal) {
    closeProductModal.addEventListener("click", () => {
      productModal.classList.remove("active")
    })
  }

  if (cancelProductBtn && productModal) {
    cancelProductBtn.addEventListener("click", () => {
      productModal.classList.remove("active")
    })
  }

  // Xử lý sự kiện submit form sản phẩm
  const productForm = document.getElementById("productForm")
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const formData = {
        id: document.getElementById("productId").value,
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        price: document.getElementById("productPrice").value,
        description: document.getElementById("productDescription").value,
        longDescription: document.getElementById("productLongDescription").value,
        image: document.getElementById("productImage").value,
        nutritionCalories: document.getElementById("nutritionCalories").value,
        nutritionFat: document.getElementById("nutritionFat").value,
        nutritionSaturatedFat: document.getElementById("nutritionSaturatedFat").value,
        nutritionCholesterol: document.getElementById("nutritionCholesterol").value,
        nutritionSodium: document.getElementById("nutritionSodium").value,
        nutritionCarbs: document.getElementById("nutritionCarbs").value,
        nutritionSugar: document.getElementById("nutritionSugar").value,
        nutritionProtein: document.getElementById("nutritionProtein").value,
        nutritionCalcium: document.getElementById("nutritionCalcium").value,
        nutritionVitaminD: document.getElementById("nutritionVitaminD").value,
        featured: document.getElementById("productFeatured").checked,
      }

      // Lưu sản phẩm
      saveProduct(formData)

      // Đóng modal
      productModal.classList.remove("active")
    })
  }

  // Xử lý sự kiện tải lên hình ảnh
  const uploadImageBtn = document.getElementById("uploadImageBtn")
  const productImageFile = document.getElementById("productImageFile")

  if (uploadImageBtn && productImageFile) {
    uploadImageBtn.addEventListener("click", () => {
      productImageFile.click()
    })

    productImageFile.addEventListener("change", function () {
      const file = this.files[0]
      if (file) {
        // Trong thực tế, bạn sẽ tải file lên server
        // Ở đây, chúng ta sẽ giả lập bằng cách tạo URL cho file
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target.result
          document.getElementById("productImage").value = imageUrl
          document.getElementById("previewImg").src = imageUrl
          document.getElementById("imagePreview").style.display = "block"
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Xử lý sự kiện preview hình ảnh khi nhập URL
  const productImage = document.getElementById("productImage")
  if (productImage) {
    productImage.addEventListener("input", function () {
      const imageUrl = this.value
      if (imageUrl) {
        document.getElementById("previewImg").src = imageUrl
        document.getElementById("imagePreview").style.display = "block"
      } else {
        document.getElementById("imagePreview").style.display = "none"
      }
    })
  }

  // Xử lý sự kiện lọc sản phẩm
  const categoryFilter = document.getElementById("categoryFilter")
  const searchBtn = document.getElementById("searchBtn")
  const searchInput = document.getElementById("searchProduct")

  if (categoryFilter) {
    categoryFilter.addEventListener("change", loadProducts)
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", loadProducts)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        loadProducts()
      }
    })
  }
})
