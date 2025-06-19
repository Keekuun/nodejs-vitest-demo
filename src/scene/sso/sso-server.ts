import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET = 'your-secret-key';
const PORT = 3000;

// 👇 添加 body 解析中间件
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 模拟存储登录状态
const sessions: Record<string, any> = {};
//  记录 user id 的token
const tokens: Record<string, string> = {};

// 登录页面（模拟）
app.get('/login', (req, res) => {
    let { redirect } = req.query;
    if (!redirect || typeof redirect !== 'string') {
        redirect = 'http://localhost:3001/protected'; // 默认回退
    }
    res.send(`
    <h1>SSO 登录</h1>
    <form action="/login" method="POST">
      <input type="hidden" name="redirect" value="${redirect}" />
      <button type="submit">登录</button>
    </form>
  `);
});


// 登录处理
app.post('/login', (req, res) => {
    const { redirect } = req.body;

    if (!redirect || typeof redirect !== 'string' || !redirect.startsWith('http')) {
        return res.status(400).send('Invalid redirect URL');
    }

    const userId = 'user-123';
    let token = tokens[userId]

    sessions[token] = { userId };
    tokens[userId] = token;

    if(!tokens[userId]) {
        token = jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
    }

    // ✅ 设置 Cookie 的 domain 和 path
    // cookie 不能跨域，所以这中方式只能在同一父级域名下使用
    // res.cookie('sso_token', token, {
    //     httpOnly: true,
    //     domain: 'localhost', // 设置 Cookie 的 domain, 线上使用真实域名
    //     path: '/',
    //     maxAge: 3600000
    // });

    const finalRedirect = `${redirect}?token=${token}`;
    console.log('Redirecting to:', finalRedirect);
    res.redirect(finalRedirect);
});


// 验证 Token
app.get('/verify', (req, res) => {
    const { token } = req.query;

    console.log('Verifying token:', token)

    try {
        const decoded = jwt.verify(token as string, SECRET);
        res.json({ valid: true, user: decoded });
    } catch (e) {
        res.status(401).json({ valid: false });
    }
});

app.listen(PORT, () => {
    console.log(`SSO Server running at http://localhost:${PORT}`);
});
