#!/bin/bash

# KaoJob Demo Deployment Script
# This script sets up and runs the KaoJob website for demo purposes

echo "🚀 KaoJob Demo Deployment Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the site/ directory"
    echo "Usage: cd site && ./deploy-demo.sh"
    exit 1
fi

# Function to start server based on available tools
start_server() {
    PORT=${1:-8080}
    
    # Try Python 3 first
    if command -v python3 &> /dev/null; then
        echo "🐍 Starting Python 3 HTTP server on port $PORT..."
        python3 -m http.server $PORT
    # Try Python 2 as fallback
    elif command -v python &> /dev/null; then
        echo "🐍 Starting Python 2 HTTP server on port $PORT..."
        python -m SimpleHTTPServer $PORT
    # Try Node.js
    elif command -v npx &> /dev/null; then
        echo "🟢 Starting Node.js HTTP server on port $PORT..."
        npx http-server -p $PORT
    # Try PHP
    elif command -v php &> /dev/null; then
        echo "🐘 Starting PHP built-in server on port $PORT..."
        php -S localhost:$PORT
    else
        echo "❌ Error: No suitable HTTP server found!"
        echo "Please install Python, Node.js, or PHP to run the demo."
        exit 1
    fi
}

# Check for available port
check_port() {
    PORT=${1:-8080}
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
        echo "⚠️  Port $PORT is already in use. Trying port $(($PORT + 1))..."
        check_port $(($PORT + 1))
    else
        echo "✅ Port $PORT is available"
        return $PORT
    fi
}

echo ""
echo "📋 Demo Login Credentials:"
echo "=========================="
echo "Employer Account:"
echo "  Email: employer@kaojob.com"
echo "  Password: demo123"
echo ""
echo "Job Seeker Account:"
echo "  Email: jobseeker@kaojob.com"
echo "  Password: demo123"
echo ""

# Find available port
PORT=8080
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>/dev/null; then
    PORT=8081
fi

echo "🌐 Starting server on http://localhost:$PORT"
echo "📱 The website is mobile responsive and works on all devices"
echo "🔗 Click the above URL or open your browser to http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================="
echo ""

# Start the server
start_server $PORT