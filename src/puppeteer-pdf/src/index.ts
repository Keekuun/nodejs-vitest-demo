import express from 'express';
import pdfRoutes from './routes/pdfRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// 使用中间件来解析JSON请求体
app.use(express.json());

// 挂载PDF路由
app.use('/api/pdf', pdfRoutes);

app.get('/', (req, res) => {
  res.send('PDF Generation Service is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
