document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem("isLoggedIn")
  const currentPage = window.location.pathname.split("/").pop()

  // Redirect to login if not logged in and not on login page
  if (!isLoggedIn && currentPage !== "index.html") {
    window.location.href = "index.html"
    return
  }

  // Toggle sidebar on mobile
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("active")
    })
  }

  // Highlight active nav link
  const navLinks = document.querySelectorAll(".nav-links a")
  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Logout functionality
  const logoutLink = document.querySelector('a[href="index.html"]')
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()
      sessionStorage.removeItem("isLoggedIn")
      window.location.href = "index.html"
    })
  }

  // Show toast notification
  window.showToast = (message, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
    }).showToast()
  }
})
