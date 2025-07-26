// Password Hash Generator for Cryptics Admin
// Run this script to generate a SHA-256 hash of your password

const CryptoJS = require('crypto-js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hide input for password entry
function hiddenInput(prompt, callback) {
  const stdin = process.stdin;
  const stdout = process.stdout;
  
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  
  let password = '';
  
  stdin.on('data', function(char) {
    char = char + '';
    
    switch(char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.setRawMode(false);
        stdin.pause();
        stdout.write('\n');
        callback(password);
        break;
      case '\u0003':
        process.exit();
        break;
      case '\u007f': // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          stdout.write('\b \b');
        }
        break;
      default:
        password += char;
        break;
    }
  });
}

console.log('🔐 Cryptics Admin Password Hash Generator');
console.log('==========================================');
console.log('This will generate a SHA-256 hash of your password.');
console.log('Use the generated hash as your VITE_ADMIN_PASSWORD environment variable.\n');

hiddenInput('Enter your admin password: ', function(password) {
  if (password.length === 0) {
    console.log('❌ Password cannot be empty!');
    process.exit(1);
  }
  
  // Generate SHA-256 hash
  const hash = CryptoJS.SHA256(password).toString();
  
  console.log('\n✅ Password hash generated successfully!');
  console.log('==========================================');
  console.log('Hash:', hash);
  console.log('\n📝 Add this to your .env file:');
  console.log(`VITE_ADMIN_PASSWORD=${hash}`);
  console.log('\n🔒 Security Note:');
  console.log('- Keep this hash secret');
  console.log('- Do not commit the hash to version control');
  console.log('- Use different passwords for different environments');
  
  rl.close();
});