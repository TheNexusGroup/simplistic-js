#!/usr/bin/env python3
"""
Simple HTTP server for testing Simplistic demos
"""
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 9292

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    # Change to the simplistic directory
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"🚀 Simplistic Demo Server running at http://localhost:{PORT}")
        print(f"📁 Serving from: {os.getcwd()}")
        print("\n📋 Available demos:")
        print(f"   • Basic Demo:    http://localhost:{PORT}/demos/index.html")
        print(f"   • Todo App:      http://localhost:{PORT}/demos/todo.html")
        print(f"   • Counter Demo:  http://localhost:{PORT}/demos/counter.html")
        print("\n🔄 Press Ctrl+C to stop")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")