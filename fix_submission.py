#!/usr/bin/env python3
import sqlite3
import uuid

def fix_and_add_submission():
    conn = sqlite3.connect('activities.db')
    cursor = conn.cursor()
    
    # Get exact schema
    cursor.execute("PRAGMA table_info(submitted_activities);")
    columns = cursor.fetchall()
    
    print("=== SUBMITTED_ACTIVITIES SCHEMA ===")
    for col in columns:
        print(f"  {col[1]} {col[2]} {'NOT NULL' if col[3] else 'NULL'}")
    
    # Add proper test submission with all required fields
    submission_id = str(uuid.uuid4())
    parent_id = '65fea650-25da-4012-b399-71080a6a249f'  # parent@test.com
    
    try:
        cursor.execute('''
        INSERT INTO submitted_activities 
        (id, submitted_by, activity_name, school_name, category, city, neighborhood, 
         age_range, price_range, description, contact_info, personal_experience, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            submission_id,
            parent_id,
            'Детска йога',
            'Център Хармония', 
            'Спорт и физическа активност',
            'София',
            'Център',
            '5-12 години',
            '80-120 лв/месец',
            'Йога за деца от 5 до 12 години с опитен инструктор',
            'Телефон: 0888123456, Email: yoga@harmonia.bg',
            'Детето ми ходи там от 6 месеца, много доволни',
            'pending'
        ))
        
        conn.commit()
        print("✅ Test submission added successfully!")
        
        # Check what we added  
        cursor.execute("SELECT * FROM submitted_activities WHERE id = ?", (submission_id,))
        submission = cursor.fetchone()
        print(f"\n🎯 Added submission:")
        print(f"  Activity: {submission[2]} at {submission[3]}")
        print(f"  Status: {submission[11]}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    conn.close()

if __name__ == "__main__":
    fix_and_add_submission()