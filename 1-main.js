import dbClient from './utils/db';

const waitConnection = async () => {
  let i = 0;
  while (i < 10) {
    if (dbClient.isAlive()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    i += 1;
  }
  throw new Error('Database connection not established.');
};

(async () => {
  try {
    console.log(dbClient.isAlive());
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
  } catch (error) {
    console.error('Error:', error);
  }
})();

