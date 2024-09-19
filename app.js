// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./db'); // Import the MySQL connection

const app = express();
const port = 3000;

// Parse incoming request bodies in a middleware before handlers
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

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
