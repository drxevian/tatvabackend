
const { spawn } = require('child_process');
const path = require('path');

// Build the server files first
console.log('Building server files...');
const buildProcess = spawn('tsc', ['--project', 'tsconfig.server.json'], { shell: true });

buildProcess.stdout.on('data', (data) => {
  console.log(`Build: ${data}`);
});

buildProcess.stderr.on('data', (data) => {
  console.error(`Build error: ${data}`);
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Build process exited with code ${code}`);
    return;
  }
  
  console.log('Server files built successfully');
  
  // Start the Express server
  const serverProcess = spawn('node', ['dist/server/index.js'], { shell: true });
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });
  
  // Start Vite dev server
  const clientProcess = spawn('vite', { shell: true });
  
  clientProcess.stdout.on('data', (data) => {
    console.log(`Client: ${data}`);
  });
  
  clientProcess.stderr.on('data', (data) => {
    console.error(`Client error: ${data}`);
  });
  
  console.log('Development servers started!');
  console.log('- API: http://localhost:5000/api');
});
