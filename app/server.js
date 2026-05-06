#!/bin/bash
yum update -y
yum install -y nodejs git
 
# Get instance metadata
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
 
# Create simple web server
cat > /home/ec2-user/server.js <<'EOF'
const http = require('http');
const os = require('os');
 
const INSTANCE_ID = process.env.INSTANCE_ID || 'unknown';
const AZ = process.env.AZ || 'unknown';
 
const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      status: 'healthy',
      instance: INSTANCE_ID,
      az: AZ,
      uptime: process.uptime()
    }));
    return;
  }
  
  // Main page
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Load Balanced App</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .instance { color: #007bff; font-size: 24px; font-weight: bold; }
        .az { color: #28a745; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Cloud Engineering Bootcamp</h1>
        <h2>Load Balanced Application</h2>
        <p class="instance">Instance: ${INSTANCE_ID}</p>
        <p class="az">Availability Zone: ${AZ}</p>
        <p>Hostname: ${os.hostname()}</p>
        <p>Request count handled: ${Math.floor(Math.random() * 1000)}</p>
      </div>
    </body>
    </html>
  `);
});
 
server.listen(80, () => {
  console.log(`Server running on port 80 (Instance: ${INSTANCE_ID}, AZ: ${AZ})`);
});
EOF
 
# Set environment variables and run server
export INSTANCE_ID=$INSTANCE_ID
export AZ=$AZ
cd /home/ec2-user
nohup node server.js > server.log 2>&1 &
