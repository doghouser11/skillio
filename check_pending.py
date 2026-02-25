#!/usr/bin/env python3
import sqlite3

def check_pending_submissions():
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    print("=== PENDING SUBMISSIONS ===")
    
    # Check submitted activities
    cursor.execute("SELECT * FROM submitted_activities ORDER BY created_at DESC LIMIT 10;")
    submissions = cursor.fetchall()
    
    print(f"\nSubmitted Activities ({len(submissions)} found):")
    for sub in submissions:
        print(f"  ID: {sub[0]}")
        print(f"  Activity: {sub[2]} at {sub[3]}")  
        print(f"  Status: {sub[11]}")
        print(f"  Created: {sub[12]}")
        print("  ---")
    
    # Check if we need to add test submissions
    if len(submissions) == 0:
        print("\n🔴 No submissions found. Adding test submission...")
        cursor.execute('''
        INSERT INTO submitted_activities 
        (id, submitted_by, activity_name, school_name, category, city, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('test-submission-1', '65fea650-25da-4012-b399-71080a6a249f', 
              'Детска йога', 'Център Хармония', 'Спорт и физическа активност', 
              'София', 'Йога за деца от 5 до 12 години', 'pending'))
        
        conn.commit()
        print("✅ Test submission added!")
    
    conn.close()

if __name__ == "__main__":
    check_pending_submissions()