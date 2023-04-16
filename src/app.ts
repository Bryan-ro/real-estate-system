import express, { request } from 'express';

const app = express();
app.use(express.json());


app.listen(4444, () => console.log("Server listening on port 4444"))