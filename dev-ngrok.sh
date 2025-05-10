#!/bin/bash
# Start Next.js in the background
npm run dev &
next_pid=$!

# Wait for Next.js to start
sleep 5

# Start ngrok
ngrok http 3000 --subdomain=clarity-coach

# When ngrok is terminated, kill the Next.js process
kill $next_pid