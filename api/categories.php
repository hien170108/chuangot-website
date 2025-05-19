<?php
require_once 'db_config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all categories or a specific one
        if (isset($_GET['id'])) {
            $id = sanitize($_GET['id']);
            $sql = "SELECT * FROM categories WHERE id = '$id'";
        } else {
            $sql = "SELECT * FROM categories ORDER BY id ASC";
        }
        
        $result = $conn->query($sql);
        
        if ($result) {
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                // Get product count for this category
                $code = $row['code'];
                $countSql = "SELECT COUNT(*) as count FROM products WHERE category_code = '$code'";
                $countResult = $conn->query($countSql);
                $productCount = 0;
                
                if ($countResult && $countRow = $countResult->fetch_assoc()) {
                    $productCount = (int)$countRow['count'];
                }
                
                $category = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'code' => $row['code'],
                    'description' => $row['description'],
                    'productCount' => $productCount
                ];
                
                $categories[] = $category;
            }
            
            if (isset($_GET['id']) && empty($categories)) {
                response(false, "Category not found");
            } else {
                response(true, "Categories retrieved successfully", $categories);
            }
        } else {
            response(false, "Error retrieving categories: " . $conn->error);
        }
        break;
        
    case 'POST':
        // Add new category
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            // Try to get from POST
            $data = $_POST;
        }
        
        if (!isset($data['name']) || !isset($data['code'])) {
            response(false, "Missing required fields");
        }
        
        $name = sanitize($data['name']);
        $code = sanitize($data['code']);
        $description = isset($data['description']) ? sanitize($data['description']) : '';
        
        // Check if code already exists
        $checkSql = "SELECT * FROM categories WHERE code = '$code'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            response(false, "Category code already exists");
        }
        
        $sql = "INSERT INTO categories (name, code, description) VALUES ('$name', '$code', '$description')";
        
        if ($conn->query($sql)) {
            $newId = $conn->insert_id;
            
            $category = [
                'id' => $newId,
                'name' => $name,
                'code' => $code,
                'description' => $description,
                'productCount' => 0
            ];
            
            response(true, "Category added successfully", $category);
        } else {
            response(false, "Error adding category: " . $conn->error);
        }
        break;
        
    case 'PUT':
        // Update existing category
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing category ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if category exists
        $checkSql = "SELECT * FROM categories WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "Category not found");
        }
        
        $updates = [];
        
        if (isset($data['name'])) {
            $name = sanitize($data['name']);
            $updates[] = "name = '$name'";
        }
        
        if (isset($data['code'])) {
            $code = sanitize($data['code']);
            
            // Check if code already exists (excluding current category)
            $checkCodeSql = "SELECT * FROM categories WHERE code = '$code' AND id != '$id'";
            $checkCodeResult = $conn->query($checkCodeSql);
            
            if ($checkCodeResult->num_rows > 0) {
                response(false, "Category code already exists");
            }
            
            $updates[] = "code = '$code'";
        }
        
        if (isset($data['description'])) {
            $description = sanitize($data['description']);
            $updates[] = "description = '$description'";
        }
        
        if (empty($updates)) {
            response(false, "No fields to update");
        }
        
        $sql = "UPDATE categories SET " . implode(", ", $updates) . " WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            // Get the updated category
            $sql = "SELECT * FROM categories WHERE id = '$id'";
            $result = $conn->query($sql);
            
            if ($result && $row = $result->fetch_assoc()) {
                // Get product count for this category
                $code = $row['code'];
                $countSql = "SELECT COUNT(*) as count FROM products WHERE category_code = '$code'";
                $countResult = $conn->query($countSql);
                $productCount = 0;
                
                if ($countResult && $countRow = $countResult->fetch_assoc()) {
                    $productCount = (int)$countRow['count'];
                }
                
                $category = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'code' => $row['code'],
                    'description' => $row['description'],
                    'productCount' => $productCount
                ];
                
                response(true, "Category updated successfully", $category);
            } else {
                response(true, "Category updated successfully");
            }
        } else {
            response(false, "Error updating category: " . $conn->error);
        }
        break;
        
    case 'DELETE':
        // Delete category
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing category ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if category exists
        $checkSql = "SELECT * FROM categories WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "Category not found");
        }
        
        // Get category code
        $row = $checkResult->fetch_assoc();
        $code = $row['code'];
        
        // Check if category has products
        $checkProductsSql = "SELECT COUNT(*) as count FROM products WHERE category_code = '$code'";
        $checkProductsResult = $conn->query($checkProductsSql);
        
        if ($checkProductsResult && $countRow = $checkProductsResult->fetch_assoc()) {
            $productCount = (int)$countRow['count'];
            
            if ($productCount > 0) {
                response(false, "Cannot delete category with products");
            }
        }
        
        $sql = "DELETE FROM categories WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            response(true, "Category deleted successfully");
        } else {
            response(false, "Error deleting category: " . $conn->error);
        }
        break;
        
    default:
        response(false, "Invalid request method");
}

$conn->close();
?>
