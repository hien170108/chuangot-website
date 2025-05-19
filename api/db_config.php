<?php
// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$database = "chuangot_db";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");

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
?>
