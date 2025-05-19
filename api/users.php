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
        // Get all users or a specific one
        if (isset($_GET['id'])) {
            $id = sanitize($_GET['id']);
            $sql = "SELECT id, username, full_name, email, role, created_at FROM users WHERE id = '$id'";
        } else {
            $sql = "SELECT id, username, full_name, email, role, created_at FROM users ORDER BY id ASC";
        }
        
        $result = $conn->query($sql);
        
        if ($result) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            
            if (isset($_GET['id']) && empty($users)) {
                response(false, "User not found");
            } else {
                response(true, "Users retrieved successfully", $users);
            }
        } else {
            response(false, "Error retrieving users: " . $conn->error);
        }
        break;
        
    case 'POST':
        // Add new user
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            // Try to get from POST
            $data = $_POST;
        }
        
        if (!isset($data['username']) || !isset($data['password']) || !isset($data['full_name'])) {
            response(false, "Missing required fields");
        }
        
        $username = sanitize($data['username']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
        $fullName = sanitize($data['full_name']);
        $email = isset($data['email']) ? sanitize($data['email']) : '';
        $role = isset($data['role']) ? sanitize($data['role']) : 'viewer';
        
        // Check if username already exists
        $checkSql = "SELECT * FROM users WHERE username = '$username'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            response(false, "Username already exists");
        }
        
        $sql = "INSERT INTO users (username, password, full_name, email, role) VALUES ('$username', '$password', '$fullName', '$email', '$role')";
        
        if ($conn->query($sql)) {
            $newId = $conn->insert_id;
            
            $user = [
                'id' => $newId,
                'username' => $username,
                'full_name' => $fullName,
                'email' => $email,
                'role' => $role
            ];
            
            response(true, "User added successfully", $user);
        } else {
            response(false, "Error adding user: " . $conn->error);
        }
        break;
        
    case 'PUT':
        // Update existing user
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing user ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if user exists
        $checkSql = "SELECT * FROM users WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "User not found");
        }
        
        $updates = [];
        
        if (isset($data['username'])) {
            $username = sanitize($data['username']);
            
            // Check if username already exists (excluding current user)
            $checkUsernameSql = "SELECT * FROM users WHERE username = '$username' AND id != '$id'";
            $checkUsernameResult = $conn->query($checkUsernameSql);
            
            if ($checkUsernameResult->num_rows > 0) {
                response(false, "Username already exists");
            }
            
            $updates[] = "username = '$username'";
        }
        
        if (isset($data['password']) && !empty($data['password'])) {
            $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
            $updates[] = "password = '$password'";
        }
        
        if (isset($data['full_name'])) {
            $fullName = sanitize($data['full_name']);
            $updates[] = "full_name = '$fullName'";
        }
        
        if (isset($data['email'])) {
            $email = sanitize($data['email']);
            $updates[] = "email = '$email'";
        }
        
        if (isset($data['role'])) {
            $role = sanitize($data['role']);
            $updates[] = "role = '$role'";
        }
        
        if (empty($updates)) {
            response(false, "No fields to update");
        }
        
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            // Get the updated user
            $sql = "SELECT id, username, full_name, email, role, created_at FROM users WHERE id = '$id'";
            $result = $conn->query($sql);
            
            if ($result && $row = $result->fetch_assoc()) {
                response(true, "User updated successfully", $row);
            } else {
                response(true, "User updated successfully");
            }
        } else {
            response(false, "Error updating user: " . $conn->error);
        }
        break;
        
    case 'DELETE':
        // Delete user
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            response(false, "Missing user ID");
        }
        
        $id = sanitize($data['id']);
        
        // Check if user exists
        $checkSql = "SELECT * FROM users WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            response(false, "User not found");
        }
        
        // Check if this is the last admin user
        $checkAdminSql = "SELECT COUNT(*) as count FROM users WHERE role = 'admin'";
        $checkAdminResult = $conn->query($checkAdminSql);
        
        if ($checkAdminResult && $countRow = $checkAdminResult->fetch_assoc()) {
            $adminCount = (int)$countRow['count'];
            
            if ($adminCount <= 1) {
                // Check if the user to be deleted is an admin
                $row = $checkResult->fetch_assoc();
                if ($row['role'] === 'admin') {
                    response(false, "Cannot delete the last admin user");
                }
            }
        }
        
        $sql = "DELETE FROM users WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            response(true, "User deleted successfully");
        } else {
            response(false, "Error deleting user: " . $conn->error);
        }
        break;
        
    default:
        response(false, "Invalid request method");
}

$conn->close();
?>
