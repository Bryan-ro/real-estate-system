import express from 'express';
import router from './routes/index';

const app = express();
app.use(express.json());
router(app);
app.listen(4444, () => console.log("Server listening on port 4444"));