# PERSISTENT USER STORAGE для emergency mode
# =======================================
# Този файл ще се използва за съхранение на user данни между deployments

import json
import os
from datetime import datetime

USERS_FILE = "/tmp/emergency_users_backup.json"

def save_users_to_file(users_dict):
    """Запазва users в persistent файл"""
    try:
        backup_data = {
            "timestamp": datetime.now().isoformat(),
            "users": users_dict,
            "count": len(users_dict)
        }
        
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Saved {len(users_dict)} users to {USERS_FILE}")
        return True
    except Exception as e:
        print(f"❌ Error saving users: {e}")
        return False

def load_users_from_file():
    """Зарежда users от persistent файл"""
    try:
        if not os.path.exists(USERS_FILE):
            print(f"📁 No backup file found at {USERS_FILE}")
            return {}
            
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)
        
        users = backup_data.get("users", {})
        print(f"📂 Loaded {len(users)} users from backup (saved: {backup_data.get('timestamp', 'unknown')})")
        
        return users
    except Exception as e:
        print(f"❌ Error loading users: {e}")
        return {}

def get_backup_info():
    """Връща информация за backup-а"""
    try:
        if not os.path.exists(USERS_FILE):
            return {"status": "no_backup", "users_count": 0}
            
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)
        
        return {
            "status": "backup_exists",
            "users_count": backup_data.get("count", 0),
            "timestamp": backup_data.get("timestamp", "unknown"),
            "file_path": USERS_FILE
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}