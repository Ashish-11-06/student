const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Parse incoming request bodies in a middleware before handlers
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'mysql-2460dd5f-snehalkadam1911.c.aivencloud.com',
    user: 'avnadmin',
    // password: 'AVNS_TLQSGEgAZs1wAPe-vJr',
    database: 'defaultdb',
    port: 12810
});

// Connect to MySQL and create table if it doesn't exist
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
    
    // Create table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS student (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
        } else {
            console.log('Table "student" is ready.');
        }
    });
});

// Serve the form page with optional message
app.get('/', (req, res) => {
    res.render('form', { message: null, student: null });
});

// Handle form submission
app.post('/', (req, res) => {
    const { studentName, email, class: studentClass, phoneNumber } = req.body;
    
    const message = `Class: ${studentClass}\nPhone: ${phoneNumber}`;
    
    // SQL query to insert data
    const sql = 'INSERT INTO student (name, email, message) VALUES (?, ?, ?)';
    
    connection.execute(sql, [studentName, email, message], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err.stack);
            return res.render('form', { message: 'Error occurred: ' + err.message, student: null });
        }
        
        // If successful, send the response message with student details back to the same page
        res.render('form', {
            message: 'Following record created successfully!',
            student: {
                name: studentName,
                email: email,
                class: studentClass,
                phone: phoneNumber
            }
        });
    });
});

// Close MySQL connection when the app is stopped
process.on('SIGINT', () => {
    connection.end((err) => {
        console.log('MySQL connection closed');
        process.exit(err ? 1 : 0);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
