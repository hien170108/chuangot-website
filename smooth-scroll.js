// Kiểm tra xem trình duyệt có hỗ trợ smooth scrolling không
const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

// Hàm cuộn mượt mà tự tạo cho các trình duyệt cũ
function smoothScrollPolyfill(targetElement, duration) {
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeInOutQuad = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + targetPosition * easeInOutQuad);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }
    
    requestAnimationFrame(scrollAnimation);
}

// Xử lý sự kiện click vào các liên kết có class smooth-scroll
document.addEventListener('DOMContentLoaded', function() {
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;
            
            // Sử dụng native smooth scroll nếu trình duyệt hỗ trợ
            if (supportsNativeSmoothScroll) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // Sử dụng polyfill cho các trình duyệt cũ
                smoothScrollPolyfill(targetElement, 800); // 800ms là thời gian cuộn
            }
        });
    });
});

// Xử lý sự kiện cuộn chuột để làm mượt
let isScrolling = false;
let scrollTimeout;

// Hàm xử lý sự kiện cuộn chuột
function handleWheel(e) {
    // Nếu trình duyệt đã hỗ trợ smooth scroll, không cần can thiệp
    if (supportsNativeSmoothScroll) return;
    
    // Ngăn chặn sự kiện mặc định nếu đang trong quá trình cuộn
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    isScrolling = true;
    
    // Xác định hướng cuộn
    const delta = e.deltaY || -e.wheelDelta || e.detail;
    const scrollDown = delta > 0;
    
    // Tìm section hiện tại và section tiếp theo
    const sections = Array.from(document.querySelectorAll('.section'));
    const viewportMiddle = window.innerHeight / 2;
    
    let currentSectionIndex = -1;
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
            currentSectionIndex = index;
        }
    });
    
    // Xác định section đích
    let targetIndex;
    if (scrollDown) {
        targetIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    } else {
        targetIndex = Math.max(currentSectionIndex - 1, 0);
    }
    
    // Nếu đã ở section đầu/cuối và tiếp tục cuộn theo hướng đó, cho phép cuộn bình thường
    if (targetIndex === currentSectionIndex) {
        isScrolling = false;
        return;
    }
    
    e.preventDefault();
    
    // Cuộn đến section đích
    const targetSection = sections[targetIndex];
    smoothScrollPolyfill(targetSection, 600);
    
    // Đặt timeout để tránh cuộn liên tục
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 700);
}

// Chỉ áp dụng xử lý wheel nếu trình duyệt không hỗ trợ smooth scroll
if (!supportsNativeSmoothScroll) {
    // Sử dụng passive: false để có thể gọi preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousewheel', handleWheel, { passive: false });
    window.addEventListener('DOMMouseScroll', handleWheel, { passive: false });
}

// Xử lý touch events cho thiết bị di động
let touchStartY = 0;
let touchEndY = 0;
const minSwipeDistance = 50;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    // Nếu đang cuộn, bỏ qua
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].screenY;
    const touchDistance = touchStartY - touchEndY;
    
    // Nếu khoảng cách vuốt đủ lớn
    if (Math.abs(touchDistance) >= minSwipeDistance) {
        const scrollDown = touchDistance > 0;
        
        // Tìm section hiện tại và section tiếp theo
        const sections = Array.from(document.querySelectorAll('.section'));
        const viewportMiddle = window.innerHeight / 2;
        
        let currentSectionIndex = -1;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                currentSectionIndex = index;
            }
        });
        
        // Xác định section đích
        let targetIndex;
        if (scrollDown) {
            targetIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            targetIndex = Math.max(currentSectionIndex - 1, 0);
        }
        
        // Nếu đã ở section đầu/cuối và tiếp tục cuộn theo hướng đó, cho phép cuộn bình thường
        if (targetIndex === currentSectionIndex) {
            return;
        }
        
        isScrolling = true;
        
        // Cuộn đến section đích
        const targetSection = sections[targetIndex];
        
        if (supportsNativeSmoothScroll) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        } else {
            smoothScrollPolyfill(targetSection, 600);
        }
        
        // Đặt timeout để tránh cuộn liên tục
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 700);
    }
}, { passive: true });
