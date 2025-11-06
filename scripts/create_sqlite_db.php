<?php
// scripts/create_sqlite_db.php

$dbPath = __DIR__ . '/../database/kadesh.sqlite';

// Check if the database file already exists and remove it to start fresh
if (file_exists($dbPath)) {
    unlink($dbPath);
    echo "Removed existing database file.\n";
}

try {
    // 1. Create a new SQLite database connection
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Successfully created SQLite database at: " . $dbPath . "\n";

    // 2. Enable foreign key support
    $pdo->exec('PRAGMA foreign_keys = ON;');

    // 3. Define and execute table creation queries (converted from MySQL)

    // --- users table ---
    $pdo->exec("
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            email_verified_at DATETIME DEFAULT NULL,
            password TEXT NOT NULL,
            remember_token TEXT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_type TEXT NOT NULL CHECK(user_type IN ('contractor', 'provider', 'both', 'admin')),
            bio TEXT DEFAULT NULL,
            skills TEXT DEFAULT NULL, -- Storing JSON as TEXT
            rating REAL DEFAULT 0.00,
            total_ratings INTEGER DEFAULT 0,
            wallet_balance REAL DEFAULT 0.00,
            is_active INTEGER DEFAULT 1
        )
    ");
    echo "Table 'users' created.\n";

    // --- projects table ---
    $pdo->exec("
        CREATE TABLE projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contractor_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            max_budget REAL,
            status TEXT DEFAULT 'open',
            winner_bid_id INTEGER DEFAULT NULL,
            bidding_ends_at DATETIME,
            project_deadline DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contractor_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ");
    echo "Table 'projects' created.\n";

    // --- bids table ---
    $pdo->exec("
        CREATE TABLE bids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            proposal TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ");
    echo "Table 'bids' created.\n";

    // --- milestones table ---
    $pdo->exec("
        CREATE TABLE milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending', -- pending, funded, released, disputed
            release_date DATETIME DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        )
    ");
    echo "Table 'milestones' created.\n";

    // 4. Insert initial data (e.g., an admin user)
    $adminEmail = 'admin@kadesh.com';
    $adminName = 'Admin User';
    $adminPassword = password_hash('password', PASSWORD_DEFAULT); // Simple password for local testing

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$adminName, $adminEmail, $adminPassword, 'admin']);
    echo "Admin user created with email: $adminEmail and password: password\n";

    echo "\nDatabase setup complete!\n";

} catch (PDOException $e) {
    die("Database setup failed: " . $e->getMessage() . "\n");
}
