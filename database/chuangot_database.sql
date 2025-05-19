-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS chuangot_db;
USE chuangot_db;

-- Bảng categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category_code` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `long_description` text DEFAULT NULL,
  `calories` varchar(20) DEFAULT NULL,
  `fat` varchar(20) DEFAULT NULL,
  `saturated_fat` varchar(20) DEFAULT NULL,
  `cholesterol` varchar(20) DEFAULT NULL,
  `sodium` varchar(20) DEFAULT NULL,
  `carbs` varchar(20) DEFAULT NULL,
  `sugar` varchar(20) DEFAULT NULL,
  `protein` varchar(20) DEFAULT NULL,
  `calcium` varchar(20) DEFAULT NULL,
  `vitamin_d` varchar(20) DEFAULT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `category_code` (`category_code`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_code`) REFERENCES `categories` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng feedback
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `product` varchar(100) NOT NULL,
  `rating` int(1) NOT NULL,
  `feedback` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reply` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dữ liệu mẫu cho bảng categories
INSERT INTO `categories` (`name`, `code`, `description`) VALUES
('Sữa Chua Ăn', 'fruit', 'Các loại sữa chua ăn với nhiều hương vị trái cây'),
('Sữa Chua Uống', 'traditional', 'Các loại sữa chua uống tiện lợi'),
('Sữa Chua Túi', 'special', 'Sữa chua đóng túi nhỏ gọn');

-- Dữ liệu mẫu cho bảng products
INSERT INTO `products` (`name`, `price`, `image`, `category_code`, `description`, `long_description`, `calories`, `fat`, `saturated_fat`, `cholesterol`, `sodium`, `carbs`, `sugar`, `protein`, `calcium`, `vitamin_d`, `featured`) VALUES
('Sữa Chua Thanh Long', '20.000đ', 'img/sp/suachuaan/Thiết kế chưa có tên (3).png', 'fruit', 'Sữa chua thanh long lạ miệng, vị ngọt thanh nhẹ, giàu chất xơ và vitamin.', 'Sữa chua thanh long là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và thanh long tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '110 kcal', '3g', '2g', '10mg', '50mg', '17g', '15g', '4g', '150mg', '2µg', 0),
('Sữa Chua Mít', '20.000đ', 'img/sp/suachuaan/Ban-co-biet-sua-chua-mit-bao-nhieu-calo_.jpg', 'fruit', 'Sữa chua mít dẻo thơm, vị ngọt béo đặc trưng, bổ sung năng lượng tự nhiên.', 'Sữa chua mít là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và mít tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '115 kcal', '3g', '2g', '10mg', '50mg', '19g', '17g', '4g', '150mg', '2µg', 0),
('Sữa Chua Xoài', '20.000đ', 'img/sp/suachuaan/Screenshot 2025-05-17 014034.png', 'fruit', 'Sữa chua xoài thơm ngọt, hương vị nhiệt đới.', 'Sữa chua xoài là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và xoài tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '112 kcal', '3g', '2g', '10mg', '50mg', '18g', '16g', '4g', '150mg', '2µg', 0),
('Sữa Chua Truyền Thống', '15.000đ', 'img/sp/suachuaan/istockphoto-819724192-612x612.jpg', 'fruit', 'Sữa chua truyền thống, vị chua thanh, bổ dưỡng.', 'Sữa chua truyền thống là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất và men chua sống, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '100 kcal', '3g', '2g', '10mg', '50mg', '15g', '12g', '4g', '150mg', '2µg', 0),
('Sữa Chua Chanh Leo', '37.000đ', 'img/sp/suachuaan/thanh-pham-1357.jpg', 'fruit', 'Sữa chua chanh leo thanh mát, giàu vitamin C, giúp tăng sức đề kháng.', 'Sữa chua chanh leo là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và chanh leo tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '105 kcal', '3g', '2g', '10mg', '50mg', '16g', '14g', '4g', '150mg', '2µg', 0),
('Sữa Chua Thập Cẩm', '35.000đ', 'img/sp/suachuaan/DeWatermark.ai_1747420140284.jpg', 'fruit', 'Sữa chua thập cẩm thơm mát, kết hợp hương vị trái cây đa dạng, bổ dưỡng.', 'Sữa chua thập cẩm là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và nhiều loại trái cây tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '120 kcal', '3g', '2g', '10mg', '50mg', '20g', '18g', '4g', '150mg', '2µg', 0),
('Sữa Chua Túi Vị Cam', '5.000đ', 'img/sp/suachuatui/b28714fa3650c68e4b413dc49978b614.jpg', 'special', 'Sữa chua cam tươi mát, vị chua ngọt hài hòa trong từng túi nhỏ.', 'Sữa chua túi vị cam là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và cam tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '90 kcal', '2g', '1.5g', '8mg', '45mg', '15g', '13g', '3g', '120mg', '1.5µg', 0),
('Sữa Chua Túi Vị Dâu', '5.000đ', 'img/sp/suachuatui/hq720.jpg', 'special', 'Sữa chua dâu ngọt dịu, thơm ngon trong từng túi mát lạnh.', 'Sữa chua túi vị dâu là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và dâu tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '90 kcal', '2g', '1.5g', '8mg', '45mg', '15g', '13g', '3g', '120mg', '1.5µg', 0),
('Sữa Chua Uống Vị Cam', '15.000đ', 'img/sp/suachuauong/A-e61c3.png', 'traditional', 'Sữa chua cam tươi mát, hương vị dịu nhẹ dễ uống.', 'Sữa chua uống vị cam là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và cam tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '95 kcal', '2.5g', '1.5g', '9mg', '48mg', '16g', '14g', '3.5g', '130mg', '1.8µg', 0),
('Sữa Chua Uống Vị Dâu', '15.000đ', 'img/sp/suachuauong/sua-chua-dau-tay-1.webp', 'traditional', 'Sữa chua uống vị dâu thơm ngon, vị ngọt thanh hấp dẫn.', 'Sữa chua uống vị dâu là một trong những sản phẩm được yêu thích nhất của chúng tôi. Được làm từ sữa tươi nguyên chất, men chua sống và dâu tự nhiên, sản phẩm mang đến hương vị thơm ngon và bổ dưỡng.', '95 kcal', '2.5g', '1.5g', '9mg', '48mg', '16g', '14g', '3.5g', '130mg', '1.8µg', 0);

-- Dữ liệu mẫu cho bảng users
INSERT INTO `users` (`username`, `password`, `full_name`, `email`, `role`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@chuangot.com', 'admin');
