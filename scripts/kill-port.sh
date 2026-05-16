#!/bin/bash
PORT=3000
PID=$(lsof -ti :$PORT)

if [ -z "$PID" ]; then
  echo "Ingen process fundet på port $PORT."
else
  echo "Stopper process $PID på port $PORT..."
  kill -9 $PID
  echo "Port $PORT er nu ledig."
fi
