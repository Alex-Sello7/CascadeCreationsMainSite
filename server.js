const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql'); // Changed from mysql2 to mssql

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQL Server configuration - using the connection string from your screenshot
const config = {
    server: 'localhost\\SQLEXPRESS', // Instance name from your screenshot
    database: 'contact_db',          // You'll need to create this database
    user: 'ALEXAlex',                // Administrator from your screenshot
    password: 'your_password_here',  // You need to set this password
    options: {
        trustedConnection: true,     // Use Windows authentication if no password
        trustServerCertificate: true // Needed for local dev
    }
};

// Initialize connection pool
let pool;
(async () => {
    try {
        pool = await sql.connect(config);
        console.log('✅ SQL Server Connected');
        
        // Create contacts table if it doesn't exist
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contacts' AND xtype='U')
            CREATE TABLE contacts (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(100),
                email NVARCHAR(100),
                subject NVARCHAR(200),
                message NVARCHAR(MAX),
                created_at DATETIME DEFAULT GETDATE()
            )
        `);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

// Contact route
app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
        return res.json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Combine first and last name for storage
        const fullName = `${firstName} ${lastName}`;
        
        const result = await pool.request()
            .input('name', sql.NVarChar, fullName)
            .input('email', sql.NVarChar, email)
            .input('subject', sql.NVarChar, subject)
            .input('message', sql.NVarChar, message)
            .query('INSERT INTO contacts (name, email, subject, message) VALUES (@name, @email, @subject, @message)');
        
        res.json({ success: true, message: 'Message stored successfully.' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Database error.' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));