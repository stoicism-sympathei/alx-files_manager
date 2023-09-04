const bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const nodemailer = require('nodemailer'); // You would need to install nodemailer for email sending

const fileQueue = new bull('fileQueue');
const userQueue = new bull('userQueue');

// Bull worker to generate thumbnails
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Assuming you have a function to retrieve the file path based on userId and fileId
  const filePath = getFilePath(userId, fileId);

  if (!filePath) {
    throw new Error('File not found');
  }

  const sizes = [500, 250, 100];

  for (const size of sizes) {
    try {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const thumbnailName = `${filePath}_${size}`;
      fs.writeFileSync(thumbnailName, thumbnail);
    } catch (error) {
      console.error(`Error generating thumbnail for size ${size}:`, error);
    }
  }

  return Promise.resolve();
});

// Bull worker to send Welcome emails
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Assuming you have a function to retrieve user data from the database based on userId
  const userData = getUserData(userId);

  if (!userData) {
    throw new Error('User not found');
  }

  // Replace with your real email sending logic
  const transporter = nodemailer.createTransport({
    service: 'your-email-service', // e.g., 'Gmail'
    auth: {
      user: 'your-email@example.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to: userData.email, // Assuming userData contains user's email
    subject: 'Welcome to Our Service',
    text: `Welcome ${userData.email} to Our Service!`, // Customize your welcome email text
  };

  await transporter.sendMail(mailOptions);

  console.log(`Welcome email sent to ${userData.email}`);
});

function getFilePath(userId, fileId) {
  // Implement your logic to retrieve the file path here
}

function getUserData(userId) {
  // Implement your logic to retrieve user data from the database based on userId
  // Replace this with your actual database retrieval code
  const users = {
    'user1': { email: 'user1@example.com' },
    'user2': { email: 'user2@example.com' },
    // ...
  };
  return users[userId];
}

console.log('Worker is running...');

