#!/bin/bash

echo "🚀 Starting Brantech E-Shop MERN Stack Setup..."
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed!"
    echo "Please install MongoDB first:"
    echo "  Ubuntu/Debian: sudo apt-get install mongodb"
    echo "  MacOS: brew install mongodb-community"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration!"
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Start MongoDB: sudo systemctl start mongod"
echo "  2. Start backend:  cd backend && npm run dev"
echo "  3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Or use the provided start script: ./start.sh"
