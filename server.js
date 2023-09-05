import router from './routes/index';

const express = require('express');
// create the Express server
const app = express();
const port = process.env.PORT || 5000;

router(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
