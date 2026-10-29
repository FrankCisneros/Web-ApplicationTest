import express from 'express';
import process from 'process';
import authRouter from './routes/auth';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Api is working, Yey!' 
    });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});