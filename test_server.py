#!/usr/bin/env python3
"""
Minimal test server to check if basic HTTP works
"""

from http.server import HTTPServer, BaseHTTPRequestHandler

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html = '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test Server</title>
        </head>
        <body>
            <h1>🔴 HAL Test Server Works!</h1>
            <p>Server is running on port 8000</p>
            <p>If you see this, the basic setup is working.</p>
        </body>
        </html>
        '''
        
        self.wfile.write(html.encode('utf-8'))

def run_test_server():
    server_address = ('', 8000)
    print(f"🧪 Test server starting on port {server_address[1]}")
    
    try:
        httpd = HTTPServer(server_address, TestHandler)
        print("✅ Test server created successfully")
        print("🌐 Listening on http://0.0.0.0:8000")
        httpd.serve_forever()
    except Exception as e:
        print(f"❌ Test server failed: {e}")

if __name__ == '__main__':
    run_test_server()