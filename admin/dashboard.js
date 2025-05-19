// Kiểm tra đăng nhập
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn")
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "index.html"
  }
}

// Khởi tạo dữ liệu danh mục nếu chưa có
function initCategoryData() {
  if (!localStorage.getItem("productCategories")) {
    const categories = [
      {
        id: 1,
        name: "Sữa Chua Ăn",
        code: "fruit",
        description: "Các loại sữa chua ăn với nhiều hương vị trái cây",
      },
      {
        id: 2,
        name: "Sữa Chua Uống",
        code: "traditional",
        description: "Các loại sữa chua uống tiện lợi",
      },
      {
        id: 3,
        name: "Sữa Chua Túi",
        code: "special",
        description: "Sữa chua đóng túi nhỏ gọn",
      },
    ]
    localStorage.setItem("productCategories", JSON.stringify(categories))
  }
}

// Khởi tạo dữ liệu sản phẩm nếu chưa có
function initProductData() {
  if (!localStorage.getItem("products")) {
    // Lấy dữ liệu sản phẩm từ script.js
    const products = [
      {
        id: 1,
        name: "Sữa Chua Thanh Long",
        price: "20.000đ",
        image: "../img/sp/suachuaan/Thiết kế chưa có tên (3).png",
        category: "fruit",
        description: "Sữa chua thanh long lạ miệng, vị ngọt thanh nhẹ, giàu chất xơ và vitamin.",
        longDescription:
          "Sữa chua thanh long là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và thanh long tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "110 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "17g",
          sugar: "15g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 2,
        name: "Sữa Chua Mít",
        price: "20.000đ",
        image: "../img/sp/suachuaan/Ban-co-biet-sua-chua-mit-bao-nhieu-calo_.jpg",
        category: "fruit",
        description: "Sữa chua mít dẻo thơm, vị ngọt béo đặc trưng, bổ sung năng lượng tự nhiên.",
        longDescription:
          "Sữa chua mít là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và mít tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "115 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "19g",
          sugar: "17g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 3,
        name: "Sữa Chua Xoài",
        price: "20.000đ",
        image: "../img/sp/suachuaan/Screenshot 2025-05-17 014034.png",
        category: "fruit",
        description: "Sữa chua xoài thơm ngọt, hương vị nhiệt đới.",
        longDescription:
          "Sữa chua xoài là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và xoài tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "112 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "18g",
          sugar: "16g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 4,
        name: "Sữa Chua Truyền Thống",
        price: "15.000đ",
        image: "../img/sp/suachuaan/istockphoto-819724192-612x612.jpg",
        category: "fruit",
        description: "Sữa chua truyền thống, vị chua thanh, bổ dưỡng.",
        longDescription:
          "Sữa chua truyền thống là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất và men chua sống, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "100 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "15g",
          sugar: "12g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 5,
        name: "Sữa Chua Chanh Leo",
        price: "37.000đ",
        image: "../img/sp/suachuaan/thanh-pham-1357.jpg",
        category: "fruit",
        description: "Sữa chua chanh leo thanh mát, giàu vitamin C, giúp tăng sức đề kháng.",
        longDescription:
          "Sữa chua chanh leo là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và chanh leo tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "105 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "16g",
          sugar: "14g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 6,
        name: "Sữa Chua Thập Cẩm",
        price: "35.000đ",
        image: "../img/sp/suachuaan/DeWatermark.ai_1747420140284.jpg",
        category: "fruit",
        description: "Sữa chua thập cẩm thơm mát, kết hợp hương vị trái cây đa dạng, bổ dưỡng.",
        longDescription:
          "Sữa chua thập cẩm là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và nhiều loại trái cây tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "120 kcal",
          fat: "3g",
          saturatedFat: "2g",
          cholesterol: "10mg",
          sodium: "50mg",
          carbs: "20g",
          sugar: "18g",
          protein: "4g",
          calcium: "150mg",
          vitaminD: "2µg",
        },
      },
      {
        id: 7,
        name: "Sữa Chua Túi Vị Cam",
        price: "5.000đ",
        image: "../img/sp/suachuatui/b28714fa3650c68e4b413dc49978b614.jpg",
        category: "special",
        description: "Sữa chua cam tươi mát, vị chua ngọt hài hòa trong từng túi nhỏ.",
        longDescription:
          "Sữa chua túi vị cam là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và cam tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "90 kcal",
          fat: "2g",
          saturatedFat: "1.5g",
          cholesterol: "8mg",
          sodium: "45mg",
          carbs: "15g",
          sugar: "13g",
          protein: "3g",
          calcium: "120mg",
          vitaminD: "1.5µg",
        },
      },
      {
        id: 8,
        name: "Sữa Chua Túi Vị Dâu",
        price: "5.000đ",
        image: "../img/sp/suachuatui/hq720.jpg",
        category: "special",
        description: "Sữa chua dâu ngọt dịu, thơm ngon trong từng túi mát lạnh.",
        longDescription:
          "Sữa chua túi vị dâu là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và dâu tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "90 kcal",
          fat: "2g",
          saturatedFat: "1.5g",
          cholesterol: "8mg",
          sodium: "45mg",
          carbs: "15g",
          sugar: "13g",
          protein: "3g",
          calcium: "120mg",
          vitaminD: "1.5µg",
        },
      },
      {
        id: 9,
        name: "Sữa Chua Uống Vị Cam",
        price: "15.000đ",
        image: "../img/sp/suachuauong/A-e61c3.png",
        category: "traditional",
        description: "Sữa chua cam tươi mát, hương vị dịu nhẹ dễ uống.",
        longDescription:
          "Sữa chua uống vị cam là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và cam tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "95 kcal",
          fat: "2.5g",
          saturatedFat: "1.5g",
          cholesterol: "9mg",
          sodium: "48mg",
          carbs: "16g",
          sugar: "14g",
          protein: "3.5g",
          calcium: "130mg",
          vitaminD: "1.8µg",
        },
      },
      {
        id: 10,
        name: "Sữa Chua Uống Vị Dâu",
        price: "15.000đ",
        image: "../img/sp/suachuauong/sua-chua-dau-tay-1.webp",
        category: "traditional",
        description: "Sữa chua uống vị dâu thơm ngon, vị ngọt thanh hấp dẫn.",
        longDescription:
          "Sữa chua uống vị dâu là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và dâu tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.",
        nutrition: {
          calories: "95 kcal",
          fat: "2.5g",
          saturatedFat: "1.5g",
          cholesterol: "9mg",
          sodium: "48mg",
          carbs: "16g",
          sugar: "14g",
          protein: "3.5g",
          calcium: "130mg",
          vitaminD: "1.8µg",
        },
      },
    ]
    localStorage.setItem("products", JSON.stringify(products))
  }
}

// Khởi tạo dữ liệu cài đặt website nếu chưa có
function initWebsiteSettings() {
  if (!localStorage.getItem("websiteSettings")) {
    const settings = {
      colors: {
        primaryColor: "#b6e3ff",
        secondaryColor: "#ffc3ea",
        accentColor: "#ff6b9d",
        textColor: "#444",
        backgroundColor: "#fff",
      },
      fonts: {
        headingFont: "Playwrite DK Loopet, cursive",
        bodyFont: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
      logo: {
        text: "Chua&Ngọt",
        image: "../img/favicon.png",
      },
      hero: {
        title: "CHUA&NGỌT",
        subtitle: "Từ những nguyên liệu tự nhiên, tạo nên hương vị tuyệt hảo!",
        buttonText: "Khám Phá Ngay!",
        backgroundImage: null,
      },
      footer: {
        copyright: "© 2025 Chua&Ngọt.",
        address: "464 Quang Trung, Hà Đông, Hà Nội",
        phone: "0382092008",
        email: "ngotvachua@gmail.com",
      },
    }
    localStorage.setItem("websiteSettings", JSON.stringify(settings))
  }
}

// Khởi tạo dữ liệu thống kê nếu chưa có
function initStatsData() {
  if (!localStorage.getItem("websiteStats")) {
    const stats = {
      products: 10,
      categories: 3,
      users: 1,
      views: 0,
    }
    localStorage.setItem("websiteStats", JSON.stringify(stats))
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
      userAvatar.textContent = (userInfo.fullName || userInfo.full_name || "").charAt(0)
      userName.textContent = userInfo.fullName || userInfo.full_name || ""
    }
  }
}

// Cập nhật số liệu thống kê
function updateStats() {
  const stats = JSON.parse(localStorage.getItem("websiteStats"))
  if (stats) {
    document.getElementById("productCount").textContent = stats.products
    document.getElementById("categoryCount").textContent = stats.categories
    document.getElementById("userCount").textContent = stats.users
    document.getElementById("viewCount").textContent = stats.views
  }
}

// Hiển thị danh sách sản phẩm gần đây
function displayRecentProducts() {
  const products = JSON.parse(localStorage.getItem("products"))
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const tableBody = document.querySelector("#recentProductsTable tbody")

  if (products && tableBody) {
    // Lấy 5 sản phẩm mới nhất
    const recentProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5)

    // Xóa dữ liệu cũ
    tableBody.innerHTML = ""

    // Thêm dữ liệu mới
    recentProducts.forEach((product) => {
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

// Hiển thị danh sách danh mục gần đây
function displayRecentCategories() {
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const products = JSON.parse(localStorage.getItem("products"))
  const tableBody = document.querySelector("#recentCategoriesTable tbody")

  if (categories && tableBody) {
    // Lấy 5 danh mục mới nhất
    const recentCategories = [...categories].sort((a, b) => b.id - a.id).slice(0, 5)

    // Xóa dữ liệu cũ
    tableBody.innerHTML = ""

    // Thêm dữ liệu mới
    recentCategories.forEach((category) => {
      // Đếm số sản phẩm trong danh mục
      const productCount = products.filter((product) => product.category === category.code).length

      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.code}</td>
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

// Thêm sự kiện cho các nút trong bảng sản phẩm
function addProductButtonEvents() {
  // Nút xem sản phẩm
  document.querySelectorAll("#recentProductsTable .view").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      window.open(`../product-detail.html?id=${productId}`, "_blank")
    })
  })

  // Nút sửa sản phẩm
  document.querySelectorAll("#recentProductsTable .edit").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      window.location.href = `product-edit.html?id=${productId}`
    })
  })

  // Nút xóa sản phẩm
  document.querySelectorAll("#recentProductsTable .delete").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteProduct(productId)
      }
    })
  })
}

// Thêm sự kiện cho các nút trong bảng danh mục
function addCategoryButtonEvents() {
  // Nút sửa danh mục
  document.querySelectorAll("#recentCategoriesTable .edit").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = Number.parseInt(button.getAttribute("data-id"))
      window.location.href = `category-edit.html?id=${categoryId}`
    })
  })

  // Nút xóa danh mục
  document.querySelectorAll("#recentCategoriesTable .delete").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = Number.parseInt(button.getAttribute("data-id"))
      if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
        deleteCategory(categoryId)
      }
    })
  })
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
  displayRecentProducts()

  // Hiển thị thông báo
  showToast("success", "Thành công", "Đã xóa sản phẩm thành công!")
}

// Xóa danh mục
function deleteCategory(categoryId) {
  // Lấy danh sách danh mục
  let categories = JSON.parse(localStorage.getItem("productCategories"))

  // Kiểm tra xem danh mục có sản phẩm không
  const products = JSON.parse(localStorage.getItem("products"))
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
    displayRecentCategories()

    // Hiển thị thông báo
    showToast("success", "Thành công", "Đã xóa danh mục thành công!")
  }
}

// Cập nhật số liệu thống kê sản phẩm
function updateProductStats() {
  const products = JSON.parse(localStorage.getItem("products"))
  const stats = JSON.parse(localStorage.getItem("websiteStats"))

  stats.products = products.length

  localStorage.setItem("websiteStats", JSON.stringify(stats))
  updateStats()
}

// Cập nhật số liệu thống kê danh mục
function updateCategoryStats() {
  const categories = JSON.parse(localStorage.getItem("productCategories"))
  const stats = JSON.parse(localStorage.getItem("websiteStats"))

  stats.categories = categories.length

  localStorage.setItem("websiteStats", JSON.stringify(stats))
  updateStats()
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

  // Khởi tạo dữ liệu
  initCategoryData()
  initProductData()
  initWebsiteSettings()
  initStatsData()

  // Hiển thị thông tin người dùng
  updateUserInfo()

  // Cập nhật số liệu thống kê
  updateStats()

  // Hiển thị danh sách sản phẩm và danh mục gần đây
  displayRecentProducts()
  displayRecentCategories()

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

  // Hiển thị thông báo chào mừng
  const user = JSON.parse(sessionStorage.getItem("adminUser"))
  if (user) {
    showToast("success", "Chào mừng", `Xin chào, ${(user.fullName || user.full_name) || ""}!`)
  }
})
