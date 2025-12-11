#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Find Python executable
function findPython() {
  const pythonCommands = ['python3', 'python'];

  for (const cmd of pythonCommands) {
    try {
      const result = require('child_process').spawnSync(cmd, ['--version'], { stdio: 'pipe' });
      if (result.status === 0) {
        return cmd;
      }
    } catch (e) {
      // Continue to next command
    }
  }

  throw new Error('Python 3 is required but not found. Please install Python 3.10 or newer.');
}

// Start the Python MCP server
function startServer() {
  const python = findPython();
  const serverPath = path.join(__dirname, 'python');
  const srcPath = path.join(serverPath, 'src');

  // Check if dependencies are installed
  const checkDeps = require('child_process').spawnSync(python, ['-c', 'import mcp'], {
    cwd: serverPath,
    env: {
      ...process.env,
      PYTHONPATH: srcPath
    }
  });

  if (checkDeps.status !== 0) {
    console.error('Installing Python dependencies...');
    const install = require('child_process').spawnSync(python, ['-m', 'pip', 'install', '-e', '.'], {
      cwd: serverPath,
      stdio: 'inherit'
    });

    if (install.status !== 0) {
      console.error('Failed to install Python dependencies');
      process.exit(1);
    }
  }

  const server = spawn(python, ['-m', 'datagovmy_mcp.server'], {
    cwd: serverPath,
    stdio: 'inherit', // Inherit stdio for MCP communication
    env: {
      ...process.env,
      PYTHONPATH: srcPath
    }
  });

  server.on('error', (err) => {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
  });

  server.on('exit', (code) => {
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    server.kill('SIGTERM');
  });
}

startServer();
