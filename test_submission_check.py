#!/usr/bin/env python3
import sqlite3

def check_submission():
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM submitted_activities ORDER BY created_at DESC LIMIT 1;")
    row = cursor.fetchone()
    
    if row:
        print("=== LAST SUBMISSION ===")
        columns = ['id', 'submitted_by', 'activity_name', 'school_name', 'category', 'city', 
                  'neighborhood', 'age_range', 'price_range', 'description', 'contact_info', 
                  'personal_experience', 'status', 'created_at']
        
        for i, col in enumerate(columns):
            print(f"  {i}: {col} = {row[i]}")
    
    conn.close()

if __name__ == "__main__":
    check_submission()