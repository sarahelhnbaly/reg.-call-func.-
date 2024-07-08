const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_registration_db',
  port:3307
});


// Register User
app.post('/register', async (req, res) => {
  const { username,email,password,
    gender,
    address,
    mobile,
    dob,firstname,lastname} = req.body;
 // const salt = bcrypt.genSaltSync(10);
 // const hashedPassword = bcrypt.hashSync(password, salt); mar

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO users (username, email, password,gender,address,mobile,dob,firstname,lastname) VALUES (?, ?, ?,?,?,?,?,?,?)', [username, email, password,gender,address,mobile,dob,firstname,lastname]);
    conn.release();
    res.send({ message: 'User registered!' });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/login',async (req, res) => {
  const { username, password } = req.body;
  const conn =  await pool.getConnection();
  const results = await conn.query('SELECT id FROM users WHERE username = ? AND password = ?', [username, password]);
  

    if (results.length > 0) {
      conn.release();
      res.send({ message: 'User :loggedin!' });
    } else {
      res.send({ message: 'Invalid username and password!' });
    }
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});