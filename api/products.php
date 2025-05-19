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
        // Get all products or a specific one
        if (isset($_GET['id'])) {
            $id = sanitize($_GET['id']);
            $sql = "SELECT p.*, c.name as category_name FROM products p 
                    JOIN categories c ON p.category_code = c.code 
                    WHERE p.id = '$id'";
        } else {
            $category = isset($_GET['category']) ? sanitize($_GET['category']) : null;
            $search = isset($_GET['search']) ? sanitize($_GET['search']) : null;
            
            $sql = "SELECT p.*, c.name as category_name FROM products p 
                    JOIN categories c ON p.category_code = c.code";
            
            if ($category) {
                $sql .= " WHERE p.category_code = '$category'";
                if ($search) {
                    $sql .= " AND (p.name LIKE '%$search%' OR p.description LIKE '%$search%')";
                }
            } elseif ($search) {
                $sql .= " WHERE p.name LIKE '%$search%' OR p.description LIKE '%$search%'";
            }
            
            $sql .= " ORDER BY p.id ASC";
        }
        
        $result = $conn->query($sql);
        
        if ($result) {
            $products = [];
            while ($row = $result->fetch_assoc()) {
                // Format nutrition data
                $nutrition = [
                    'calories' => $row['calories'],
                    'fat' => $row['fat'],
                    'saturatedFat' => $row['saturated_fat'],
                    'cholesterol' => $row['cholesterol'],
                    'sodium' => $row['sodium'],
                    'carbs' => $row['carbs'],
                    'sugar' => $row['sugar'],
                    'protein' => $row['protein'],
                    'calcium' => $row['calcium'],
                    'vitaminD' => $row['vitamin_d']
                ];
                
                // Format product data
                $product = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'image' => $row['image'],
                    'category' => $row['category_code'],
                    'categoryName' => $row['category_name'],
                    'description' => $row['description'],
                    'longDescription' => $row['long_description'],
                    'nutrition' => $nutrition
                ];
                
                $products[] = $product;
            }
            
            if (isset($_GET['id']) && empty($products)) {
                response(false, "Product not found");
            } else {
                response(true, "Products retrieved successfully", $products);
            }
        } else {
            response(false, "Error retrieving products: " . $conn->error);
        }
        break;
        
    case 'POST':
        // Add new product
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            // Try to get from POST
            $data = $_POST;
        }
        
        if (!isset($data['name']) || !isset($data['price']) || !isset($data['category']) || !isset($data['description'])) {
            response(false, "Missing required fields");
        }
        
        $name = sanitize($data['name']);
        $price = sanitize($data['price']);
        $image = sanitize($data['image']);
        $category = sanitize($data['category']);
        $description = sanitize($data['description']);
        $longDescription = isset($data['longDescription']) ? sanitize($data['longDescription']) : '';
        
        // Nutrition data
        $calories = isset($data['nutrition']['calories']) ? sanitize($data['nutrition']['calories']) : '110 kcal';
        $fat = isset($data['nutrition']['fat']) ? sanitize($data['nutrition']['fat']) : '3g';
        $saturatedFat = isset($data['nutrition']['saturatedFat']) ? sanitize($data['nutrition']['saturatedFat']) : '2g';
        $cholesterol = isset($data['nutrition']['cholesterol']) ? sanitize($data['nutrition']['cholesterol']) : '10mg';
        $sodium = isset($data['nutrition']['sodium']) ? sanitize($data['nutrition']['sodium']) : '50mg';
        $carbs = isset($data['nutrition']['carbs']) ? sanitize($data['nutrition']['carbs']) : '17g';
        $sugar = isset($data['nutrition']['sugar']) ? sanitize($data['nutrition']['sugar']) : '15g';
        $protein = isset($data['nutrition']['protein']) ? sanitize($data['nutrition']['protein']) : '4g';
        $calcium = isset($data['nutrition']['calcium']) ? sanitize($data['nutrition']['calcium']) : '150mg';
        $vitaminD = isset($data['nutrition']['vitaminD']) ? sanitize($data['nutrition']['vitaminD']) : '2µg';
        
        $sql = "INSERT INTO products (name, price, image, category_code, description, long_description, 
                calories, fat, saturated_fat, cholesterol, sodium, carbs, sugar, protein, calcium, vitamin_d) 
                VALUES ('$name', '$price', '$image', '$category', '$description', '$longDescription', 
                '$calories', '$fat', '$saturatedFat', '$cholesterol', '$sodium', '$carbs', '$sugar', '$protein', '$calcium', '$vitaminD')";
        
        if ($conn->query($sql)) {
            $newId = $conn->insert_id;
            
            // Get the newly created product
            $sql = "SELECT p.*, c.name as category_name FROM products p 
                    JOIN categories c ON p.category_code = c.code 
                    WHERE p.id = '$newId'";
            $result = $conn->query($sql);
            
            if ($result && $row = $result->fetch_assoc()) {
                // Format nutrition data
                $nutrition = [
                    'calories' => $row['calories'],
                    'fat' => $row['fat'],
                    'saturatedFat' => $row['saturated_fat'],
                    'cholesterol' => $row['cholesterol'],
                    'sodium' => $row['sodium'],
                    'carbs' => $row['carbs'],
                    'sugar' => $row['sugar'],
                    'protein' => $row['protein'],
                    'calcium' => $row['calcium'],
                    'vitaminD' => $row['vitamin_d']
                ];
                
                // Format product data
                $product = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'image' => $row['image'],
                    'category' => $row['category_code'],
                    'categoryName' => $row['category_name'],
                    'description' => $row['description'],
                    'longDescription' => $row['long_description'],
                    'nutrition' => $nutrition
                ];
                
                response(true, "Product added successfully", $product);
            } else {
                response(true, "Product added successfully", ['id' => $newId]);
            }
        } else {
            response(false, "Error adding product: " . $conn->error);
        }
        break;
        
    case 'PUT':
        // Update existing product
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing product ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if product exists
        $checkSql = "SELECT * FROM products WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "Product not found");
        }
        
        $updates = [];
        
        if (isset($data['name'])) {
            $name = sanitize($data['name']);
            $updates[] = "name = '$name'";
        }
        
        if (isset($data['price'])) {
            $price = sanitize($data['price']);
            $updates[] = "price = '$price'";
        }
        
        if (isset($data['image'])) {
            $image = sanitize($data['image']);
            $updates[] = "image = '$image'";
        }
        
        if (isset($data['category'])) {
            $category = sanitize($data['category']);
            $updates[] = "category_code = '$category'";
        }
        
        if (isset($data['description'])) {
            $description = sanitize($data['description']);
            $updates[] = "description = '$description'";
        }
        
        if (isset($data['longDescription'])) {
            $longDescription = sanitize($data['longDescription']);
            $updates[] = "long_description = '$longDescription'";
        }
        
        // Nutrition data
        if (isset($data['nutrition'])) {
            $nutrition = $data['nutrition'];
            
            if (isset($nutrition['calories'])) {
                $calories = sanitize($nutrition['calories']);
                $updates[] = "calories = '$calories'";
            }
            
            if (isset($nutrition['fat'])) {
                $fat = sanitize($nutrition['fat']);
                $updates[] = "fat = '$fat'";
            }
            
            if (isset($nutrition['saturatedFat'])) {
                $saturatedFat = sanitize($nutrition['saturatedFat']);
                $updates[] = "saturated_fat = '$saturatedFat'";
            }
            
            if (isset($nutrition['cholesterol'])) {
                $cholesterol = sanitize($nutrition['cholesterol']);
                $updates[] = "cholesterol = '$cholesterol'";
            }
            
            if (isset($nutrition['sodium'])) {
                $sodium = sanitize($nutrition['sodium']);
                $updates[] = "sodium = '$sodium'";
            }
            
            if (isset($nutrition['carbs'])) {
                $carbs = sanitize($nutrition['carbs']);
                $updates[] = "carbs = '$carbs'";
            }
            
            if (isset($nutrition['sugar'])) {
                $sugar = sanitize($nutrition['sugar']);
                $updates[] = "sugar = '$sugar'";
            }
            
            if (isset($nutrition['protein'])) {
                $protein = sanitize($nutrition['protein']);
                $updates[] = "protein = '$protein'";
            }
            
            if (isset($nutrition['calcium'])) {
                $calcium = sanitize($nutrition['calcium']);
                $updates[] = "calcium = '$calcium'";
            }
            
            if (isset($nutrition['vitaminD'])) {
                $vitaminD = sanitize($nutrition['vitaminD']);
                $updates[] = "vitamin_d = '$vitaminD'";
            }
        }
        
        if (empty($updates)) {
            response(false, "No fields to update");
        }
        
        $sql = "UPDATE products SET " . implode(", ", $updates) . " WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            // Get the updated product
            $sql = "SELECT p.*, c.name as category_name FROM products p 
                    JOIN categories c ON p.category_code = c.code 
                    WHERE p.id = '$id'";
            $result = $conn->query($sql);
            
            if ($result && $row = $result->fetch_assoc()) {
                // Format nutrition data
                $nutrition = [
                    'calories' => $row['calories'],
                    'fat' => $row['fat'],
                    'saturatedFat' => $row['saturated_fat'],
                    'cholesterol' => $row['cholesterol'],
                    'sodium' => $row['sodium'],
                    'carbs' => $row['carbs'],
                    'sugar' => $row['sugar'],
                    'protein' => $row['protein'],
                    'calcium' => $row['calcium'],
                    'vitaminD' => $row['vitamin_d']
                ];
                
                // Format product data
                $product = [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'image' => $row['image'],
                    'category' => $row['category_code'],
                    'categoryName' => $row['category_name'],
                    'description' => $row['description'],
                    'longDescription' => $row['long_description'],
                    'nutrition' => $nutrition
                ];
                
                response(true, "Product updated successfully", $product);
            } else {
                response(true, "Product updated successfully");
            }
        } else {
            response(false, "Error updating product: " . $conn->error);
        }
        break;
        
    case 'DELETE':
        // Delete product
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing product ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if product exists
        $checkSql = "SELECT * FROM products WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "Product not found");
        }
        
        $sql = "DELETE FROM products WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            response(true, "Product deleted successfully");
        } else {
            response(false, "Error deleting product: " . $conn->error);
        }
        break;
        
    default:
        response(false, "Invalid request method");
}

$conn->close();
?>
