const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'database-1.czwi5mofuf0r.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Edaphic21',
  database: 'Users',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
 
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: 'dkipkerui@gmail.com',
    pass: '0798984313',
  },
});
 
// API endpoint to handle form submissions
app.post('/submit-form', (req, res) => {
  const { name, email } = req.body;

  // Save user information to the database
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('MySQL insertion error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Send welcome email
      const mailOptions = {
        from: 'dkipkerui@gmail.com',
        to: email,
        subject: 'Welcome to My Website!',
        text: `Hi ${name}, welcome to our website!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Email sent:', info.response);
          res.status(200).send('Form submitted successfully');
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
