#!/usr/bin/env python3
import sqlite3

def check_database():
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    print("=== CURRENT DATABASE SCHEMA ===")
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    for table in tables:
        table_name = table[0]
        print(f"\n--- {table_name.upper()} ---")
        
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        
        for col in columns:
            print(f"  {col[1]} {col[2]} {'NOT NULL' if col[3] else 'NULL'} {'PK' if col[5] else ''}")
    
    print("\n=== SAMPLE DATA ===")
    
    # Check users table
    if any('users' in str(table) for table in tables):
        cursor.execute("SELECT * FROM users LIMIT 3;")
        users = cursor.fetchall()
        print(f"\nUsers ({len(users)} shown):")
        for user in users:
            print(f"  {user}")
    
    # Check agencies/schools table  
    for table_check in ['agencies', 'schools', 'activities']:
        if any(table_check in str(table) for table in tables):
            cursor.execute(f"SELECT * FROM {table_check} LIMIT 3;")
            data = cursor.fetchall()
            print(f"\n{table_check.title()} ({len(data)} shown):")
            for row in data:
                print(f"  {row}")
    
    conn.close()

if __name__ == "__main__":
    check_database()