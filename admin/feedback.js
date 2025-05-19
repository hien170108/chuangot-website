document.addEventListener("DOMContentLoaded", () => {
  // Import API module
  const API = window.API || {}

  // DOM Elements
  const feedbackTable = document.getElementById("feedbackTable")
  const editFeedbackModal = document.getElementById("editFeedbackModal")
  const viewFeedbackModal = document.getElementById("viewFeedbackModal")
  const deleteConfirmModal = document.getElementById("deleteConfirmModal")
  const editFeedbackForm = document.getElementById("editFeedbackForm")

  // Variables
  let currentFeedbackId = null

  // Load all feedback
  function loadFeedbacks() {
    fetch("../api/feedback.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          renderFeedbackTable(data.data)
        } else {
          showToast(data.message, "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showToast("Không thể tải dữ liệu phản hồi", "error")
      })
  }

  // Render feedback table
  function renderFeedbackTable(feedbacks) {
    const tbody = feedbackTable.querySelector("tbody")
    tbody.innerHTML = ""

    if (feedbacks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có dữ liệu phản hồi</td></tr>'
      return
    }

    feedbacks.forEach((feedback) => {
      const row = document.createElement("tr")

      // Truncate message if too long
      const truncatedMessage =
        feedback.feedback.length > 50 ? feedback.feedback.substring(0, 50) + "..." : feedback.feedback

      // Format status
      let statusClass = ""
      let statusText = ""

      switch (feedback.status) {
        case "approved":
          statusClass = "status-approved"
          statusText = "Đã duyệt"
          break
        case "rejected":
          statusClass = "status-rejected"
          statusText = "Từ chối"
          break
        default:
          statusClass = "status-pending"
          statusText = "Chờ duyệt"
      }

      row.innerHTML = `
                <td>${feedback.id}</td>
                <td>${feedback.name}</td>
                <td>${feedback.email}</td>
                <td>${feedback.phone || "-"}</td>
                <td>${feedback.product}</td>
                <td>${feedback.rating} <i class="fas fa-star"></i></td>
                <td>${truncatedMessage}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${formatDate(feedback.created_at)}</td>
                <td>
                    <button class="btn-icon view-btn" data-id="${feedback.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon edit-btn" data-id="${feedback.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${feedback.id}"><i class="fas fa-trash"></i></button>
                </td>
            `

      tbody.appendChild(row)
    })

    // Add event listeners to buttons
    addButtonEventListeners()
  }

  // Add event listeners to table buttons
  function addButtonEventListeners() {
    // View buttons
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        viewFeedback(id)
      })
    })

    // Edit buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        editFeedback(id)
      })
    })

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        showDeleteConfirmation(id)
      })
    })
  }

  // View feedback details
  function viewFeedback(id) {
    fetch(`../api/feedback.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.data.length > 0) {
          const feedback = data.data[0]

          document.getElementById("viewName").textContent = feedback.name
          document.getElementById("viewEmail").textContent = feedback.email
          document.getElementById("viewPhone").textContent = feedback.phone || "Không có"
          document.getElementById("viewProduct").textContent = feedback.product
          document.getElementById("viewRating").textContent = feedback.rating + " sao"
          document.getElementById("viewCreatedAt").textContent = formatDate(feedback.created_at)
          document.getElementById("viewFeedback").textContent = feedback.feedback

          // Hiển thị trạng thái
          let statusText = ""
          switch (feedback.status) {
            case "approved":
              statusText = "Đã duyệt"
              break
            case "rejected":
              statusText = "Từ chối"
              break
            default:
              statusText = "Chờ duyệt"
          }
          document.getElementById("viewStatus").textContent = statusText

          // Hiển thị phản hồi nếu có
          const replySection = document.getElementById("viewReplySection")
          if (feedback.reply) {
            document.getElementById("viewReply").textContent = feedback.reply
            replySection.style.display = "block"
          } else {
            replySection.style.display = "none"
          }

          openModal(viewFeedbackModal)
        } else {
          showToast("Không thể tải thông tin phản hồi", "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showToast("Đã xảy ra lỗi khi tải thông tin phản hồi", "error")
      })
  }

  // Edit feedback
  function editFeedback(id) {
    fetch(`../api/feedback.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.data.length > 0) {
          const feedback = data.data[0]

          document.getElementById("editId").value = feedback.id
          document.getElementById("editName").value = feedback.name
          document.getElementById("editEmail").value = feedback.email
          document.getElementById("editPhone").value = feedback.phone || ""
          document.getElementById("editProduct").value = feedback.product
          document.getElementById("editRating").value = feedback.rating
          document.getElementById("editFeedback").value = feedback.feedback

          // Set status
          const statusSelect = document.getElementById("editStatus")
          statusSelect.value = feedback.status || "pending"

          // Set reply
          document.getElementById("editReply").value = feedback.reply || ""

          currentFeedbackId = feedback.id
          openModal(editFeedbackModal)
        } else {
          showToast("Không thể tải thông tin phản hồi", "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showToast("Đã xảy ra lỗi khi tải thông tin phản hồi", "error")
      })
  }

  // Show delete confirmation
  function showDeleteConfirmation(id) {
    currentFeedbackId = id
    openModal(deleteConfirmModal)
  }

  // Delete feedback
  function deleteFeedback(id) {
    fetch("../api/feedback.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showToast("Xóa phản hồi thành công", "success")
          loadFeedbacks()
          closeModal(deleteConfirmModal)
        } else {
          showToast("Không thể xóa phản hồi: " + data.message, "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showToast("Đã xảy ra lỗi khi xóa phản hồi", "error")
      })
  }

  // Submit edit form
  if (editFeedbackForm) {
    editFeedbackForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = {
        id: document.getElementById("editId").value,
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editPhone").value,
        product: document.getElementById("editProduct").value,
        rating: document.getElementById("editRating").value,
        feedback: document.getElementById("editFeedback").value,
        status: document.getElementById("editStatus").value,
        reply: document.getElementById("editReply").value,
      }

      fetch("../api/feedback.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            showToast("Cập nhật phản hồi thành công", "success")
            loadFeedbacks()
            closeModal(editFeedbackModal)
          } else {
            showToast("Không thể cập nhật phản hồi: " + data.message, "error")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          showToast("Đã xảy ra lỗi khi cập nhật phản hồi", "error")
        })
    })
  }

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDelete")
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (currentFeedbackId) {
        deleteFeedback(currentFeedbackId)
      }
    })
  }

  // Modal functions
  function openModal(modal) {
    if (modal) {
      modal.style.display = "block"
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.style.display = "none"
    }
  }

  // Close modals when clicking on X or outside
  document.querySelectorAll(".close, .close-modal").forEach((element) => {
    element.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        closeModal(modal)
      })
    })
  })

  window.addEventListener("click", (event) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (event.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Show toast notification
  function showToast(message, type = "success") {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
    }).showToast()
  }

  // Load feedbacks when page loads
  loadFeedbacks()
})
