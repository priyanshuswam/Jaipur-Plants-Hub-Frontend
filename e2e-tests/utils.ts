import fs from 'fs';
import path from 'path';

let hasSMTP = false;
let hasRazorpay = false;
let hasCloudinary = false;

try {
  const envPath = path.resolve(__dirname, '../../backend/.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    hasSMTP = envContent.includes('SMTP_USER=') && !envContent.includes('your_email@gmail.com');
    hasRazorpay = envContent.includes('RAZORPAY_KEY_ID=') && !envContent.includes('rzp_test_xxxxxxxxxxxxxxxxxx');
    hasCloudinary = envContent.includes('CLOUDINARY_API_KEY=') && !envContent.includes('your_api_key');
  }
} catch (e) {
  // Ignore
}

export { hasSMTP, hasRazorpay, hasCloudinary };
