#!/bin/bash

# Skillio Data Seeding Script
# Seeds the database with Sofia neighborhoods

echo "🌱 Starting Skillio data seeding..."

# Check if we're in the right directory
if [ ! -f "backend/scripts/seed_neighborhoods.py" ]; then
    echo "❌ Error: seed_neighborhoods.py not found. Are you in the project root?"
    exit 1
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "🐍 Activating virtual environment..."
    source venv/bin/activate
fi

# Run the seeding script
echo "🏘️  Seeding Sofia neighborhoods..."
cd backend
python scripts/seed_neighborhoods.py

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ Data seeding completed successfully!"
else
    echo "❌ Data seeding failed!"
    exit 1
fi

echo "🎉 Ready to use Skillio with Sofia neighborhoods!"