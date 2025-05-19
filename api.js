// API Module
const API = {
  // Base URL for API endpoints
  baseUrl: "",

  // Generic fetch function with error handling
  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(this.baseUrl + endpoint, options)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Error:", error)
      return {
        status: false,
        message: "Đã xảy ra lỗi khi kết nối đến máy chủ",
        error: error.message,
      }
    }
  },
  // Xác thực
  auth: {
    // Đăng nhập
    login: async (username, password) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Kiểm tra thông tin đăng nhập
        const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]")
        const user = adminUsers.find((user) => user.username === username && user.password === password)

        if (user) {
          // Lưu thông tin đăng nhập vào session
          sessionStorage.setItem("adminLoggedIn", "true")
          sessionStorage.setItem(
            "adminUser",
            JSON.stringify({
              id: user.id,
              username: user.username,
              full_name: user.fullName,
              role: user.role,
            }),
          )

          return {
            success: true,
            message: "Đăng nhập thành công!",
            user: {
              id: user.id,
              username: user.username,
              full_name: user.fullName,
              role: user.role,
            },
          }
        } else {
          return {
            success: false,
            error: "Tên đăng nhập hoặc mật khẩu không đúng!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Kiểm tra thông tin đăng nhập trong session
        const isLoggedIn = sessionStorage.getItem("adminLoggedIn")
        const userInfo = JSON.parse(sessionStorage.getItem("adminUser") || "null")

        if (isLoggedIn === "true" && userInfo) {
          return {
            success: true,
            user: userInfo,
          }
        } else {
          return {
            success: false,
            error: "Chưa đăng nhập",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Đăng xuất
    logout: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Xóa thông tin đăng nhập khỏi session
        sessionStorage.removeItem("adminLoggedIn")
        sessionStorage.removeItem("adminUser")

        return {
          success: true,
          message: "Đăng xuất thành công!",
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },

  // Products API
  products: {
    getAll: async () => {
      return await API.fetch("api/products.php")
    },
    getById: async (id) => {
      return await API.fetch(`api/products.php?id=${id}`)
    },
    create: async (productData) => {
      return await API.fetch("api/products.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
    },
    update: async (productData) => {
      return await API.fetch("api/products.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
    },
    delete: async (id) => {
      return await API.fetch("api/products.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
    },
    // Lấy tất cả sản phẩm
    getAll_old: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")

        return {
          success: true,
          data: products,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Lấy sản phẩm theo ID
    getById_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")
        const product = products.find((p) => p.id === id)

        if (product) {
          return {
            success: true,
            data: product,
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy sản phẩm!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Thêm sản phẩm mới
    add_old: async (productData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Lấy dữ liệu sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")

        // Tạo ID mới cho sản phẩm
        const newId = Math.max(...products.map((p) => p.id), 0) + 1

        // Tạo sản phẩm mới
        const newProduct = {
          id: newId,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          category: productData.category_id,
          description: productData.description,
          longDescription: productData.long_description,
          nutrition: {
            calories: productData.calories,
            fat: productData.fat,
            saturatedFat: productData.saturated_fat,
            cholesterol: productData.cholesterol,
            sodium: productData.sodium,
            carbs: productData.carbs,
            sugar: productData.sugar,
            protein: productData.protein,
            calcium: productData.calcium,
            vitaminD: productData.vitamin_d,
          },
        }

        // Thêm sản phẩm mới vào danh sách
        products.push(newProduct)

        // Lưu lại danh sách sản phẩm
        localStorage.setItem("products", JSON.stringify(products))

        // Cập nhật số liệu thống kê
        const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
        stats.products = products.length
        localStorage.setItem("websiteStats", JSON.stringify(stats))

        return {
          success: true,
          message: "Thêm sản phẩm thành công!",
          data: newProduct,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Cập nhật sản phẩm
    update_old: async (productData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Lấy dữ liệu sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")

        // Tìm sản phẩm cần cập nhật
        const index = products.findIndex((p) => p.id === Number(productData.id))

        if (index !== -1) {
          // Cập nhật thông tin sản phẩm
          products[index] = {
            ...products[index],
            name: productData.name,
            price: productData.price,
            image: productData.image,
            category: productData.category_id,
            description: productData.description,
            longDescription: productData.long_description,
            nutrition: {
              calories: productData.calories,
              fat: productData.fat,
              saturatedFat: productData.saturated_fat,
              cholesterol: productData.cholesterol,
              sodium: productData.sodium,
              carbs: productData.carbs,
              sugar: productData.sugar,
              protein: productData.protein,
              calcium: productData.calcium,
              vitaminD: productData.vitamin_d,
            },
          }

          // Lưu lại danh sách sản phẩm
          localStorage.setItem("products", JSON.stringify(products))

          return {
            success: true,
            message: "Cập nhật sản phẩm thành công!",
            data: products[index],
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy sản phẩm!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Xóa sản phẩm
    delete_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu sản phẩm từ localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]")

        // Lọc ra sản phẩm cần xóa
        const newProducts = products.filter((p) => p.id !== id)

        if (newProducts.length < products.length) {
          // Lưu lại danh sách sản phẩm
          localStorage.setItem("products", JSON.stringify(newProducts))

          // Cập nhật số liệu thống kê
          const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
          stats.products = newProducts.length
          localStorage.setItem("websiteStats", JSON.stringify(stats))

          return {
            success: true,
            message: "Xóa sản phẩm thành công!",
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy sản phẩm!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },

  // Categories API
  categories: {
    getAll: async () => {
      return await API.fetch("api/categories.php")
    },
    getById: async (id) => {
      return await API.fetch(`api/categories.php?id=${id}`)
    },
    create: async (categoryData) => {
      return await API.fetch("api/categories.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
    },
    update: async (categoryData) => {
      return await API.fetch("api/categories.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
    },
    delete: async (id) => {
      return await API.fetch("api/categories.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
    },
    // Lấy tất cả danh mục
    getAll_old: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem("productCategories") || "[]")

        return {
          success: true,
          data: categories,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Lấy danh mục theo ID
    getById_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Lấy dữ liệu danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem("productCategories") || "[]")
        const category = categories.find((c) => c.id === id)

        if (category) {
          return {
            success: true,
            data: category,
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy danh mục!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Thêm danh mục mới
    add_old: async (categoryData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem("productCategories") || "[]")

        // Kiểm tra xem mã danh mục đã tồn tại chưa
        const existingCategory = categories.find((c) => c.code === categoryData.code)
        if (existingCategory) {
          return {
            success: false,
            error: "Mã danh mục đã tồn tại!",
          }
        }

        // Tạo ID mới cho danh mục
        const newId = Math.max(...categories.map((c) => c.id), 0) + 1

        // Tạo danh mục mới
        const newCategory = {
          id: newId,
          name: categoryData.name,
          code: categoryData.code,
          description: categoryData.description,
        }

        // Thêm danh mục mới vào danh sách
        categories.push(newCategory)

        // Lưu lại danh sách danh mục
        localStorage.setItem("productCategories", JSON.stringify(categories))

        // Cập nhật số liệu thống kê
        const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
        stats.categories = categories.length
        localStorage.setItem("websiteStats", JSON.stringify(stats))

        return {
          success: true,
          message: "Thêm danh mục thành công!",
          data: newCategory,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Cập nhật danh mục
    update_old: async (categoryData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem("productCategories") || "[]")

        // Kiểm tra xem mã danh mục đã tồn tại chưa (trừ danh mục hiện tại)
        const existingCategory = categories.find(
          (c) => c.code === categoryData.code && c.id !== Number(categoryData.id),
        )
        if (existingCategory) {
          return {
            success: false,
            error: "Mã danh mục đã tồn tại!",
          }
        }

        // Tìm danh mục cần cập nhật
        const index = categories.findIndex((c) => c.id === Number(categoryData.id))

        if (index !== -1) {
          // Cập nhật thông tin danh mục
          categories[index] = {
            ...categories[index],
            name: categoryData.name,
            code: categoryData.code,
            description: categoryData.description,
          }

          // Lưu lại danh sách danh mục
          localStorage.setItem("productCategories", JSON.stringify(categories))

          return {
            success: true,
            message: "Cập nhật danh mục thành công!",
            data: categories[index],
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy danh mục!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Xóa danh mục
    delete_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem("productCategories") || "[]")

        // Kiểm tra xem danh mục có sản phẩm không
        const products = JSON.parse(localStorage.getItem("products") || "[]")
        const category = categories.find((c) => c.id === id)

        if (category) {
          const hasProducts = products.some((p) => p.category === category.code)

          if (hasProducts) {
            return {
              success: false,
              error: "Không thể xóa danh mục này vì có sản phẩm thuộc danh mục!",
            }
          }

          // Lọc ra danh mục cần xóa
          const newCategories = categories.filter((c) => c.id !== id)

          // Lưu lại danh sách danh mục
          localStorage.setItem("productCategories", JSON.stringify(newCategories))

          // Cập nhật số liệu thống kê
          const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
          stats.categories = newCategories.length
          localStorage.setItem("websiteStats", JSON.stringify(stats))

          return {
            success: true,
            message: "Xóa danh mục thành công!",
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy danh mục!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },

  // Users API
  users: {
    getAll: async () => {
      return await API.fetch("api/users.php")
    },
    getById: async (id) => {
      return await API.fetch(`api/users.php?id=${id}`)
    },
    create: async (userData) => {
      return await API.fetch("api/users.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    },
    update: async (userData) => {
      return await API.fetch("api/users.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    },
    delete: async (id) => {
      return await API.fetch("api/users.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
    },
    // Lấy tất cả người dùng
    getAll_old: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")

        // Ẩn mật khẩu
        const safeUsers = users.map((user) => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          email: user.email,
          avatar: user.avatar,
        }))

        return {
          success: true,
          data: safeUsers,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Lấy người dùng theo ID
    getById_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")
        const user = users.find((u) => u.id === id)

        if (user) {
          // Ẩn mật khẩu
          const safeUser = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            email: user.email,
            avatar: user.avatar,
          }

          return {
            success: true,
            data: safeUser,
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy người dùng!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Thêm người dùng mới
    add_old: async (userData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Lấy dữ liệu người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")

        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        const existingUser = users.find((u) => u.username === userData.username)
        if (existingUser) {
          return {
            success: false,
            error: "Tên đăng nhập đã tồn tại!",
          }
        }

        // Tạo ID mới cho người dùng
        const newId = Math.max(...users.map((u) => u.id), 0) + 1

        // Tạo người dùng mới
        const newUser = {
          id: newId,
          username: userData.username,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role,
          email: userData.email,
          avatar: userData.avatar,
        }

        // Thêm người dùng mới vào danh sách
        users.push(newUser)

        // Lưu lại danh sách người dùng
        localStorage.setItem("adminUsers", JSON.stringify(users))

        // Cập nhật số liệu thống kê
        const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
        stats.users = users.length
        localStorage.setItem("websiteStats", JSON.stringify(stats))

        // Ẩn mật khẩu trong kết quả trả về
        const safeUser = {
          id: newUser.id,
          username: newUser.username,
          fullName: newUser.fullName,
          role: newUser.role,
          email: newUser.email,
          avatar: newUser.avatar,
        }

        return {
          success: true,
          message: "Thêm người dùng thành công!",
          data: safeUser,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Cập nhật người dùng
    update_old: async (userData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Lấy dữ liệu người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")

        // Kiểm tra xem tên đăng nhập đã tồn tại chưa (trừ người dùng hiện tại)
        const existingUser = users.find((u) => u.username === userData.username && u.id !== Number(userData.id))
        if (existingUser) {
          return {
            success: false,
            error: "Tên đăng nhập đã tồn tại!",
          }
        }

        // Tìm người dùng cần cập nhật
        const index = users.findIndex((u) => u.id === Number(userData.id))

        if (index !== -1) {
          // Cập nhật thông tin người dùng
          users[index] = {
            ...users[index],
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role,
            email: userData.email,
            avatar: userData.avatar,
          }

          // Cập nhật mật khẩu nếu có
          if (userData.password) {
            users[index].password = userData.password
          }

          // Lưu lại danh sách người dùng
          localStorage.setItem("adminUsers", JSON.stringify(users))

          // Ẩn mật khẩu trong kết quả trả về
          const safeUser = {
            id: users[index].id,
            username: users[index].username,
            fullName: users[index].fullName,
            role: users[index].role,
            email: users[index].email,
            avatar: users[index].avatar,
          }

          return {
            success: true,
            message: "Cập nhật người dùng thành công!",
            data: safeUser,
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy người dùng!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Xóa người dùng
    delete_old: async (id) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Lấy dữ liệu người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]")

        // Kiểm tra xem có phải người dùng cuối cùng không
        if (users.length <= 1) {
          return {
            success: false,
            error: "Không thể xóa người dùng cuối cùng!",
          }
        }

        // Lọc ra người dùng cần xóa
        const newUsers = users.filter((u) => u.id !== id)

        if (newUsers.length < users.length) {
          // Lưu lại danh sách người dùng
          localStorage.setItem("adminUsers", JSON.stringify(newUsers))

          // Cập nhật số liệu thống kê
          const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")
          stats.users = newUsers.length
          localStorage.setItem("websiteStats", JSON.stringify(stats))

          return {
            success: true,
            message: "Xóa người dùng thành công!",
          }
        } else {
          return {
            success: false,
            error: "Không tìm thấy người dùng!",
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },

  // Feedback API
  feedback: {
    getAll: async () => {
      return await API.fetch("api/feedback.php")
    },
    getById: async (id) => {
      return await API.fetch(`api/feedback.php?id=${id}`)
    },
    create: async (feedbackData) => {
      return await API.fetch("api/feedback.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })
    },
    update: async (feedbackData) => {
      return await API.fetch("api/feedback.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })
    },
    delete: async (id) => {
      return await API.fetch("api/feedback.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
    },
  },

  // Quản lý cài đặt website
  settings: {
    // Lấy cài đặt website
    get: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu cài đặt từ localStorage
        const settings = JSON.parse(localStorage.getItem("websiteSettings") || "{}")

        return {
          success: true,
          data: settings,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Cập nhật cài đặt website
    update: async (settingsData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Lấy dữ liệu cài đặt từ localStorage
        const settings = JSON.parse(localStorage.getItem("websiteSettings") || "{}")

        // Cập nhật cài đặt
        const updatedSettings = {
          ...settings,
          ...settingsData,
        }

        // Lưu lại cài đặt
        localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings))

        return {
          success: true,
          message: "Cập nhật cài đặt thành công!",
          data: updatedSettings,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },

  // Quản lý thống kê
  stats: {
    // Lấy thống kê
    get: async () => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu thống kê từ localStorage
        const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")

        return {
          success: true,
          data: stats,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },

    // Cập nhật thống kê
    update: async (statsData) => {
      try {
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Lấy dữ liệu thống kê từ localStorage
        const stats = JSON.parse(localStorage.getItem("websiteStats") || "{}")

        // Cập nhật thống kê
        const updatedStats = {
          ...stats,
          ...statsData,
        }

        // Lưu lại thống kê
        localStorage.setItem("websiteStats", JSON.stringify(updatedStats))

        return {
          success: true,
          message: "Cập nhật thống kê thành công!",
          data: updatedStats,
        }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  },
}

// Export the API module
if (typeof module !== "undefined" && module.exports) {
  module.exports = API
} else {
  window.API = API
}
