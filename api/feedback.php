<?php
require_once 'db_config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Hàm sanitize để tránh SQL injection
function sanitize($conn, $data) {
    return mysqli_real_escape_string($conn, trim($data));
}

// Hàm trả về response dạng JSON
function response($status, $message, $data = null) {
    $response = [
        'status' => $status,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

switch ($method) {
    case 'GET':
        // Get all feedback or a specific one
        if (isset($_GET['id'])) {
            $id = sanitize($conn, $_GET['id']);
            $sql = "SELECT * FROM feedback WHERE id = '$id'";
        } else {
            $sql = "SELECT * FROM feedback ORDER BY created_at DESC";
        }
        
        $result = $conn->query($sql);
        
        if ($result) {
            $feedbacks = [];
            while ($row = $result->fetch_assoc()) {
                $feedbacks[] = $row;
            }
            response(true, "Feedback retrieved successfully", $feedbacks);
        } else {
            response(false, "Error retrieving feedback: " . $conn->error);
        }
        break;
        
    case 'POST':
        // Add new feedback
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            // Try to get from POST
            $data = $_POST;
        }
        
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['product']) || !isset($data['rating']) || !isset($data['feedback'])) {
            response(false, "Missing required fields");
        }
        
        $name = sanitize($conn, $data['name']);
        $email = sanitize($conn, $data['email']);
        $phone = isset($data['phone']) ? sanitize($conn, $data['phone']) : '';
        $product = sanitize($conn, $data['product']);
        $rating = (int)sanitize($conn, $data['rating']);
        $feedback = sanitize($conn, $data['feedback']);
        
        $sql = "INSERT INTO feedback (name, email, phone, product, rating, feedback) 
                VALUES ('$name', '$email', '$phone', '$product', '$rating', '$feedback')";
        
        if ($conn->query($sql)) {
            response(true, "Feedback submitted successfully");
        } else {
            response(false, "Error submitting feedback: " . $conn->error);
        }
        break;
        
    case 'PUT':
        // Update existing feedback
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing feedback ID");
        }
        
        $id = sanitize($conn, $data['id']);
        $name = isset($data['name']) ? sanitize($conn, $data['name']) : null;
        $email = isset($data['email']) ? sanitize($conn, $data['email']) : null;
        $phone = isset($data['phone']) ? sanitize($conn, $data['phone']) : null;
        $product = isset($data['product']) ? sanitize($conn, $data['product']) : null;
        $rating = isset($data['rating']) ? (int)sanitize($conn, $data['rating']) : null;
        $feedback = isset($data['feedback']) ? sanitize($conn, $data['feedback']) : null;
        $status = isset($data['status']) ? sanitize($conn, $data['status']) : null;
        $reply = isset($data['reply']) ? sanitize($conn, $data['reply']) : null;
        
        $updates = [];
        if ($name !== null) $updates[] = "name = '$name'";
        if ($email !== null) $updates[] = "email = '$email'";
        if ($phone !== null) $updates[] = "phone = '$phone'";
        if ($product !== null) $updates[] = "product = '$product'";
        if ($rating !== null) $updates[] = "rating = '$rating'";
        if ($feedback !== null) $updates[] = "feedback = '$feedback'";
        if ($status !== null) $updates[] = "status = '$status'";
        if ($reply !== null) $updates[] = "reply = '$reply'";
        
        if (empty($updates)) {
            response(false, "No fields to update");
        }
        
        $sql = "UPDATE feedback SET " . implode(", ", $updates) . " WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            response(true, "Feedback updated successfully");
        } else {
            response(false, "Error updating feedback: " . $conn->error);
        }
        break;
        
    case 'DELETE':
        // Delete feedback
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing feedback ID");
        }
        
        $id = sanitize($conn, $data['id']);
        $sql = "DELETE FROM feedback WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            response(true, "Feedback deleted successfully");
        } else {
            response(false, "Error deleting feedback: " . $conn->error);
        }
        break;
        
    default:
        response(false, "Invalid request method");
}

$conn->close();
?>
