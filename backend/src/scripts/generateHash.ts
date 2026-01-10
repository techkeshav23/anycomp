import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log(`\nPassword: ${password}`);
console.log(`Hash: ${hash}\n`);
console.log('Copy this hash to your .env file as ADMIN_PASSWORD_HASH');
