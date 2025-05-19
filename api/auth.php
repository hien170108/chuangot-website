<?php
require_once 'db_config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    response(false, "Invalid request method");
}

// Get request data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    // Try to get from POST
    $data = $_POST;
}

if (!isset($data['action'])) {
    response(false, "Missing action parameter");
}

$action = $data['action'];

switch ($action) {
    case 'login':
        // Login
        if (!isset($data['username']) || !isset($data['password'])) {
            response(false, "Missing username or password");
        }
        
        $username = sanitize($data['username']);
        $password = $data['password'];
        
        // Get user from database
        $sql = "SELECT * FROM users WHERE username = '$username'";
        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Create session data
                session_start();
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['logged_in'] = true;
                
                // Return user data (without password)
                $userData = [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ];
                
                response(true, "Login successful", $userData);
            } else {
                response(false, "Invalid username or password");
            }
        } else {
            response(false, "Invalid username or password");
        }
        break;
        
    case 'logout':
        // Logout
        session_start();
        session_destroy();
        response(true, "Logout successful");
        break;
        
    case 'check':
        // Check login status
        session_start();
        
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
            $userData = [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'full_name' => $_SESSION['full_name'],
                'role' => $_SESSION['role']
            ];
            
            response(true, "User is logged in", $userData);
        } else {
            response(false, "User is not logged in");
        }
        break;
        
    default:
        response(false, "Invalid action");
}

$conn->close();
?>
