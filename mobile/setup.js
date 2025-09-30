#!/usr/bin/env node

/**
 * Mobile App Setup Script
 * 
 * This script helps configure the mobile app for development
 * by automatically detecting the local IP address and updating
 * the API configuration.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return '192.168.1.100'; // Fallback IP
}

function updateConfigFile(ipAddress) {
  const configPath = path.join(__dirname, 'src/utils/config.js');
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ Config file not found:', configPath);
    return false;
  }
  
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Update the PHYSICAL_DEVICE IP address
  const updatedContent = configContent.replace(
    /PHYSICAL_DEVICE: "http:\/\/192\.168\.1\.XXX:8000"/g,
    `PHYSICAL_DEVICE: "http://${ipAddress}:8000"`
  );
  
  fs.writeFileSync(configPath, updatedContent);
  return true;
}

function main() {
  console.log('🚀 Setting up Todo Auth Mobile App...\n');
  
  const localIP = getLocalIPAddress();
  console.log(`📍 Detected local IP address: ${localIP}`);
  
  console.log('\n📝 Updating configuration...');
  if (updateConfigFile(localIP)) {
    console.log('✅ Configuration updated successfully!');
  } else {
    console.log('❌ Failed to update configuration');
    process.exit(1);
  }
  
  console.log('\n🔧 Setup Instructions:');
  console.log('1. Make sure Django backend is running:');
  console.log('   cd ../todo_backend');
  console.log('   python manage.py runserver 0.0.0.0:8000');
  console.log('');
  console.log('2. Install Expo CLI if you haven\'t already:');
  console.log('   npm install -g @expo/cli');
  console.log('');
  console.log('3. Install Expo Go app on your mobile device');
  console.log('');
  console.log('4. Start the development server:');
  console.log('   npm start');
  console.log('');
  console.log('5. Scan the QR code with Expo Go app');
  console.log('');
  console.log('🔗 Backend URLs configured:');
  console.log(`   • Android Emulator: http://10.0.2.2:8000`);
  console.log(`   • iOS Simulator: http://127.0.0.1:8000`);
  console.log(`   • Physical Device: http://${localIP}:8000`);
  console.log('');
  console.log('📱 Happy coding!');
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIPAddress, updateConfigFile };