import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3002;

app.use(cookieParser());

// 模拟受保护资源
app.get('/protected', async (req, res) => {
    const { sso_token } = req.cookies;
    const { token } = req.query

    console.log('sso_token', sso_token)
    console.log('token', token)

    if (!sso_token && !token) {
        return res.redirect(`http://localhost:3000/login?redirect=http://localhost:3002/callback`);
    }

    const _token = token || sso_token;

    console.log('_token', _token)

    try {
        const verifyRes = await axios.get(`http://localhost:3000/verify?token=${_token}`);
        if (verifyRes.data.valid) {
            return res.send(`<h1>Welcome to App B</h1><p>User: ${verifyRes.data.user.userId}</p>`);
        }
    } catch (e) {
        console.error('token verify failed', e)
        return res.redirect(`http://localhost:3000/login?redirect=http://localhost:3002/callback`);
    }

    res.status(401).send('Unauthorized');
});

// 回调接收 Token
app.get('/callback', (req, res) => {
    const { token } = req.query;
    // res.cookie('sso_token', token, { domain: '.example.com', httpOnly: true });
    res.cookie('sso_token', token, {
        httpOnly: true,
        domain: 'localhost', // 设置 Cookie 的 domain, 线上使用真实域名
        path: '/',
        maxAge: 3600000
    });
    res.redirect('/protected');
});

app.listen(PORT, () => {
    console.log(`App A running at http://localhost:${PORT}`);
});
