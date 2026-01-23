#!/bin/bash
# Quick Start Guide for Ticket Booking System

echo "🎫 Ticket Booking System - Quick Start"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker to continue."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose to continue."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "🚀 Starting services..."
echo ""
echo "Services:"
echo "  - PostgreSQL Database (port 5431)"
echo "  - NestJS Backend API (port 3000)"
echo "  - Angular Frontend (port 4200)"
echo ""

# Start services
docker-compose up

echo ""
echo "✅ Services started!"
echo ""
echo "Access the application:"
echo "  - Frontend: http://localhost:4200"
echo "  - Backend API: http://localhost:3000"
echo "  - Database: localhost:5431"
echo ""
echo "Mock Data:"
echo "  - 5 events automatically seeded"
echo "  - ~226,000 tickets available"
echo "  - Seat prices vary by section"
echo ""
echo "To stop services, press Ctrl+C"
