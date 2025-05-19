<?php
require_once 'db_config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Hàm trả về response dạng JSON
function response($status, $message, $data = null) {
    $response = [
        'status' => $status,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}

// Lấy các phản hồi gần đây đã được phê duyệt
$sql = "SELECT * FROM feedback WHERE status = 'approved' OR status = 'pending' ORDER BY created_at DESC LIMIT 5";
$result = $conn->query($sql);

if ($result) {
    $feedbacks = [];
    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = $row;
    }
    response(true, "Recent feedbacks retrieved successfully", $feedbacks);
} else {
    response(false, "Error retrieving recent feedbacks: " . $conn->error);
}

$conn->close();
?>
