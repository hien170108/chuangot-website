document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle
  function initTheme() {
    // Kiểm tra xem người dùng đã chọn theme chưa
    const savedTheme = localStorage.getItem("theme");

    // Nếu đã chọn, áp dụng theme đó
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === "dark") {
        document.getElementById("theme-toggle").checked = true;
      }
    } else {
      // Nếu chưa chọn, kiểm tra preference của hệ thống
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute("data-theme", "dark");
        document.getElementById("theme-toggle").checked = true;
        localStorage.setItem("theme", "dark");
      }
    }
  }

  // Thêm event listener cho toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Khởi tạo theme khi trang được load
  if (document.getElementById("theme-toggle")) {
    initTheme();
  }
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const menu = document.querySelector(".menu");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("active");
    });
  }

  // Testimonial Slider
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  function showSlide(n) {
    testimonialSlides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;

    testimonialSlides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
    nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  // Auto slide testimonials
  let testimonialInterval;

  function startTestimonialInterval() {
    testimonialInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  if (testimonialSlides.length > 0) {
    startTestimonialInterval();

    // Pause interval on hover
    const testimonialSlider = document.querySelector(".testimonial-slider");
    if (testimonialSlider) {
      testimonialSlider.addEventListener("mouseenter", () => {
        clearInterval(testimonialInterval);
      });

      testimonialSlider.addEventListener("mouseleave", () => {
        startTestimonialInterval();
      });
    }
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        const toggle = faqItem.querySelector(".faq-toggle i");
        toggle.className = "fas fa-plus";
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active");
        const toggle = item.querySelector(".faq-toggle i");
        toggle.className = "fas fa-minus";
      }
    });
  });

  // Back to Top Button
  const backToTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });

  function scrollToTopSmooth() {
    const currentScroll =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
      window.requestAnimationFrame(scrollToTopSmooth);
      // Chỉnh hệ số chia từ 8 → 12 để cuộn chậm hơn
      window.scrollTo(0, currentScroll - currentScroll / 12);
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToTopSmooth();
    });
  }

  // Form Validation và Gửi dữ liệu đến Google Forms
  const feedbackForm = document.getElementById("feedbackForm");
  const formSuccess = document.getElementById("formSuccess");
  const hiddenIframe = document.getElementById("hidden_iframe");

  if (feedbackForm && hiddenIframe) {
    // Xử lý sự kiện load của iframe
    hiddenIframe.onload = function () {
      const submitBtn = document.getElementById("submitBtn");

      // Kiểm tra nếu form đã được gửi (không phải lần load đầu tiên)
      if (submitBtn && submitBtn.textContent === "Đang gửi...") {
        // Hiển thị thông báo thành công
        feedbackForm.style.display = "none";
        formSuccess.style.display = "block";

        // Reset form sau 5 giây
        setTimeout(() => {
          feedbackForm.reset();
          feedbackForm.style.display = "block";
          formSuccess.style.display = "none";
          submitBtn.disabled = false;
          submitBtn.textContent = "Gửi Đánh Giá";
        }, 5000);
      }
    };

    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định để kiểm tra trước

      let isValid = true;

      // Validate name
      const name = document.getElementById("name");
      const nameError = document.getElementById("nameError");

      if (!name.value.trim()) {
        nameError.textContent = "Vui lòng nhập họ tên";
        nameError.style.display = "block";
        isValid = false;
      } else {
        nameError.style.display = "none";
      }

      // Validate email
      const email = document.getElementById("email");
      const emailError = document.getElementById("emailError");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.value.trim()) {
        emailError.textContent = "Vui lòng nhập email";
        emailError.style.display = "block";
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = "Vui lòng nhập email hợp lệ";
        emailError.style.display = "block";
        isValid = false;
      } else {
        emailError.style.display = "none";
      }

      // Validate product
      const product = document.getElementById("product");
      const productError = document.getElementById("productError");

      if (!product.value) {
        productError.textContent = "Vui lòng chọn sản phẩm";
        productError.style.display = "block";
        isValid = false;
      } else {
        productError.style.display = "none";
      }

      // Validate rating
      const rating = document.querySelector(
        'input[name="entry.1053322840"]:checked'
      );
      const ratingError = document.getElementById("ratingError");

      if (!rating) {
        ratingError.textContent = "Vui lòng chọn đánh giá sao";
        ratingError.style.display = "block";
        isValid = false;
      } else {
        ratingError.style.display = "none";
      }

      // Validate feedback
      const feedback = document.getElementById("feedback");
      const feedbackError = document.getElementById("feedbackError");

      if (!feedback.value.trim()) {
        feedbackError.textContent = "Vui lòng nhập nội dung đánh giá";
        feedbackError.style.display = "block";
        isValid = false;
      } else if (feedback.value.trim().length < 10) {
        feedbackError.textContent =
          "Nội dung đánh giá phải có ít nhất 10 ký tự";
        feedbackError.style.display = "block";
        isValid = false;
      } else {
        feedbackError.style.display = "none";
      }

      // Nếu form hợp lệ
      if (isValid) {
        // Disable submit button và hiển thị trạng thái loading
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang gửi...";

        // Gửi form đến Google Forms thông qua iframe
        feedbackForm.target = "hidden_iframe";
        feedbackForm.submit();
      }
    });
  }

  // Products Page
  const productsContainer = document.getElementById("productsContainer");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Product data
  const products = [
    {
      id: 1,
      name: "Sữa Chua Thanh Long",
      price: "20.000đ",
      image: "img/sp/suachuaan/Thiết kế chưa có tên (3).png",
      category: "fruit",
      description: "Sữa chua thanh long lạ miệng, vị ngọt thanh nhẹ, giàu chất xơ và vitamin.",
    },
    {
      id: 2,
      name: "Sữa Chua Mít",
      price: "20.000đ",
      image: "img/sp/suachuaan/Ban-co-biet-sua-chua-mit-bao-nhieu-calo_.jpg",
      category: "fruit",
      description: "Sữa chua mít dẻo thơm, vị ngọt béo đặc trưng, bổ sung năng lượng tự nhiên.",
    },
    {
      id: 3,
      name: "Sữa Chua Xoài",
      price: "20.000đ",
      image: "img/sp/suachuaan/Screenshot 2025-05-17 014034.png",
      category: "fruit",
      description: "Sữa chua xoài thơm ngọt, hương vị nhiệt đới.",
    },
    {
      id: 4,
      name: "Sữa Chua Truyền Thống",
      price: "15.000đ",
      image: "img/sp/suachuaan/istockphoto-819724192-612x612.jpg",
      category: "fruit",
      description: "Sữa chua truyền thống, vị chua thanh, bổ dưỡng.",
    },
    {
      id: 5,
      name: "Sữa Chua Chanh Leo",
      price: "37.000đ",
      image: "img/sp/suachuaan/thanh-pham-1357.jpg",
      category: "fruit",
      description: "Sữa chua chanh leo thanh mát, giàu vitamin C, giúp tăng sức đề kháng.",
    },
    {
      id: 6,
      name: "Sữa Chua Thập Cẩm",
      price: "35.000đ",
      image: "img/sp/suachuaan/DeWatermark.ai_1747420140284.jpg",
      category: "fruit",
      description: "Sữa chua thập cẩm thơm mát, kết hợp hương vị trái cây đa dạng, bổ dưỡng.",
    },
    {
      id: 7,
      name: "Sữa Chua Túi Vị Cam",
      price: "5.000đ",
      image: "img/sp/suachuatui/b28714fa3650c68e4b413dc49978b614.jpg",
      category: "special",
      description: "Sữa chua cam tươi mát, vị chua ngọt hài hòa trong từng túi nhỏ.",
    },
    {
      id: 8,
      name: "Sữa Chua Túi Vị Dâu",
      price: "5.000đ",
      image: "img/sp/suachuatui/hq720.jpg",
      category: "special",
      description: "Sữa chua dâu ngọt dịu, thơm ngon trong từng túi mát lạnh.",
    },
    
    {
      id: 9,
      name: "Sữa Chua Uống Vị Cam",
      price: "15.000đ",
      image: "img/sp/suachuauong/A-e61c3.png",
      category: "traditional",
      description: "Sữa chua cam tươi mát, hương vị dịu nhẹ dễ uống.",
    },
    {
      id: 10,
      name: "Sữa Chua Uống Vị Dâu",
      price: "15.000đ",
      image: "img/sp/suachuauong/sua-chua-dau-tay-1.webp",
      category: "traditional",
      description: "Sữa chua uống vị dâu thơm ngon, vị ngọt thanh hấp dẫn.",
    },
  ];

  // Display products
  function displayProducts(items) {
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    items.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-card");
      productElement.setAttribute("data-aos", "fade-up");
      productElement.setAttribute("data-category", product.category);

      productElement.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <p class="description">${product.description}</p>
                    <a href="product-detail.html?id=${product.id}" class="btn-secondary">Xem Chi Tiết</a>
                </div>
            `;

      productsContainer.appendChild(productElement);
    });
  }

  // Filter products
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        if (filter === "all") {
          displayProducts(products);
        } else {
          const filteredProducts = products.filter(
            (product) => product.category === filter
          );
          displayProducts(filteredProducts);
        }
      });
    });

    // Display all products initially
    displayProducts(products);
  }

  // Product Detail Page
  const productDetail = document.getElementById("productDetail");
  const productDescription = document.getElementById("productDescription");
  const productNutrition = document.getElementById("productNutrition");
  const relatedProducts = document.getElementById("relatedProducts");

  if (
    productDetail &&
    productDescription &&
    productNutrition &&
    relatedProducts
  ) {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number.parseInt(urlParams.get("id"));

    // Find product
    const product = products.find((p) => p.id === productId);

    if (product) {
      // Update page title
      document.title = `${product.name} - Chua&Ngọt`;

      // Update breadcrumb
      const productName = document.getElementById("productName");
      if (productName) {
        productName.textContent = product.name;
      }

      // Display product details
      productDetail.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-detail-price">${product.price}</p>
                    <div class="product-detail-desc">
                        <p>${product.description}</p>
                        <p>Sữa chua ${product.name
                          .toLowerCase()
                          .replace(
                            "sữa chua ",
                            ""
                          )} được làm từ sữa tươi nguyên chất, men chua sống và ${product.name
        .toLowerCase()
        .replace(
          "sữa chua ",
          ""
        )} tự nhiên, không chất bảo quản, không phẩm màu.</p>
                    </div>
                    <div class="product-detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Khối lượng:</span>
                            <span>150g</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Hạn sử dụng:</span>
                            <span>7 ngày kể từ ngày mua</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Bảo quản:</span>
                            <span>2-5°C</span>
                        </div>
                    </div>
                    <div class="contact-buttons">
                        <a href="tel:0382092008" class="btn-phone">
                            <i class="fas fa-phone-alt"></i> Gọi Đặt Hàng: 0382092008
                        </a>
                        <a href="https://zalo.me/0382092008" class="btn-zalo" target="_blank">
                            <i class="fas fa-comment"></i> Zalo
                        </a>
                    </div>
                </div>
            `;

      // Display product description
      productDescription.innerHTML = `
                <h2>Mô Tả Sản Phẩm</h2>
                <div class="description-content">
                    <p>Sữa chua ${product.name
                      .toLowerCase()
                      .replace(
                        "sữa chua ",
                        ""
                      )} là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và ${product.name
        .toLowerCase()
        .replace(
          "sữa chua ",
          ""
        )} tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.</p>
                    <p>Quy trình sản xuất nghiêm ngặt đảm bảo giữ nguyên được các lợi khuẩn probiotic có lợi cho đường ruột. Sản phẩm không chứa chất bảo quản, không phẩm màu, an toàn cho sức khỏe người tiêu dùng.</p>
                    <p>Sữa chua ${product.name
                      .toLowerCase()
                      .replace(
                        "sữa chua ",
                        ""
                      )} có thể dùng trực tiếp hoặc kết hợp với các loại hạt, ngũ cốc để tạo thành bữa sáng hoặc bữa phụ bổ dưỡng.</p>
                </div>
            `;

      // Display product nutrition
      productNutrition.innerHTML = `
                <h2>Thông Tin Dinh Dưỡng</h2>
                <table class="nutrition-table">
                    <thead>
                        <tr>
                            <th>Thành phần</th>
                            <th>Lượng (trên 100g)</th>
                            <th>% Giá trị hàng ngày*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Calo</td>
                            <td>110 kcal</td>
                            <td>5.5%</td>
                        </tr>
                        <tr>
                            <td>Chất béo</td>
                            <td>3g</td>
                            <td>4.6%</td>
                        </tr>
                        <tr>
                            <td>Chất béo bão hòa</td>
                            <td>2g</td>
                            <td>10%</td>
                        </tr>
                        <tr>
                            <td>Cholesterol</td>
                            <td>10mg</td>
                            <td>3.3%</td>
                        </tr>
                        <tr>
                            <td>Natri</td>
                            <td>50mg</td>
                            <td>2.2%</td>
                        </tr>
                        <tr>
                            <td>Carbohydrate</td>
                            <td>17g</td>
                            <td>5.7%</td>
                        </tr>
                        <tr>
                            <td>Đường</td>
                            <td>15g</td>
                            <td>16.7%</td>
                        </tr>
                        <tr>
                            <td>Protein</td>
                            <td>4g</td>
                            <td>8%</td>
                        </tr>
                        <tr>
                            <td>Canxi</td>
                            <td>150mg</td>
                            <td>15%</td>
                        </tr>
                        <tr>
                            <td>Vitamin D</td>
                            <td>2µg</td>
                            <td>10%</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size: 0.9rem; margin-top: 15px;">* Phần trăm giá trị hàng ngày dựa trên chế độ ăn 2000 calo.</p>
            `;

      // Display related products
      const relatedProductsData = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

      relatedProductsData.forEach((relatedProduct) => {
        const relatedProductElement = document.createElement("div");
        relatedProductElement.classList.add("product-card");

        relatedProductElement.innerHTML = `
                    <div class="product-image">
                        <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
                    </div>
                    <div class="product-info">
                        <h3>${relatedProduct.name}</h3>
                        <p class="price">${relatedProduct.price}</p>
                        <a href="product-detail.html?id=${relatedProduct.id}" class="btn-secondary">Xem Chi Tiết</a>
                    </div>
                `;

        relatedProducts.appendChild(relatedProductElement);
      });
    } else {
      // Product not found
      productDetail.innerHTML = `
                <div class="product-not-found">
                    <h2>Không tìm thấy sản phẩm</h2>
                    <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <a href="products.html" class="btn">Quay lại trang sản phẩm</a>
                </div>
            `;

      productDescription.style.display = "none";
      productNutrition.style.display = "none";
      document.querySelector(".related-products").style.display = "none";
    }
  }

  // Add yogurt-themed bubbles dynamically
  function createYogurtBubbles() {
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      // Add 5-8 random bubbles to each section (increased from 3-5)
      const bubbleCount = Math.floor(Math.random() * 2) + 3;

      for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement("div");
        bubble.classList.add("yogurt-bubble");

        // Random size between 10px and 40px
        const size = Math.floor(Math.random() * 30) + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Random position
        bubble.style.top = `${Math.floor(Math.random() * 100)}%`;
        bubble.style.left = `${Math.floor(Math.random() * 100)}%`;

        // Random animation duration for more gentle floating (between 8 and 15 seconds)
        const animationDuration = Math.floor(Math.random() * 8) + 8;
        bubble.style.animationDuration = `${animationDuration}s`;

        // Random animation delay for more natural movement
        const animationDelay = Math.random() * 5;
        bubble.style.animationDelay = `${animationDelay}s`;

        // Append to section
        section.appendChild(bubble);
      }
    });
  }

  // Call the function to add bubbles
  createYogurtBubbles();

  // Smooth Scrolling lenis
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});
