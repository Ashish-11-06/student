<?php
$servername = "mysql-2460dd5f-snehalkadam1911.c.aivencloud.com";
$username = "avnadmin";
$password = "AVNS_VL5zdzgbMxp2CTae0nv";
$dbname = "defaultdb";
$port = 12810;

// Path to your CA certificate
$ssl_ca = "/path/to/ca.pem"; // Update with the actual path where the certificate is stored

// Create connection with SSL support
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check if the CA certificate exists
if (file_exists($ssl_ca)) {
    $conn->ssl_set(NULL, NULL, $ssl_ca, NULL, NULL);
}

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to create table if it does not exist
$tableCreationSQL = "CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

// Execute table creation query
if ($conn->query($tableCreationSQL) === TRUE) {
    echo "Table created successfully or already exists.";
} else {
    echo "Error creating table: " . $conn->error;
}

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $message);

// Set parameters and execute
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$stmt->execute();

echo "New record created successfully";

$stmt->close();
$conn->close();
?>
