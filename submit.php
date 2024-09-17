<?php
$servername = "your-aiven-hostname";
$username = "your-username";
$password = "your-password";
$dbname = "your-database-name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
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
