const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Import your router (if any)
// import router from './routes/index';

// Dummy data for demonstration purposes
const users = {
  'f21fb953-16f9-46ed-8d9c-84c6450ec80f': {
    id: '5f1e7cda04a394508232559d',
    name: 'John Doe',
    permissions: ['read', 'write'],
  },
};

const files = {
  '5f1e8896c7ba06511e683b25': {
    id: '5f1e8896c7ba06511e683b25',
    userId: '5f1e7cda04a394508232559d',
    name: 'image.png',
    type: 'image',
    isPublic: true,
    parentId: '5f1e881cc7ba06511e683b23',
  },
};

// Middleware to authenticate users based on X-Token header
app.use((req, res, next) => {
  const authToken = req.headers['x-token'];
  const user = users[authToken];
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
});

// Middleware to check authorization for accessing files
app.use('/files/:fileId', (req, res, next) => {
  const userId = req.user.id;
  const fileId = req.params.fileId;
  
  // Check if the user has permission to access the file
  const file = files[fileId];
  if (!file || (file.userId !== userId && !file.isPublic)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// Route to get a file by ID
app.get('/files/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const file = files[fileId];
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.json(file);
});

// Use your router (if any)
// router(app);

// Start the server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

