// app1.ts
import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

const PORT = 3002;

const AUTH_SERVER = 'http://localhost:3000';
const CLIENT_ID = 'app2';
const CLIENT_SECRET = 'secret2';
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

app.get('/login', (req, res) => {
    const query = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        state: 'abc456'
    }).toString();

    res.redirect(`${AUTH_SERVER}/authorize?${query}`);
});

app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || state !== 'abc456') {
        return res.status(400).send('Invalid state or missing code');
    }

    // 向认证中心换取 token
    const tokenRes = await axios.post(`${AUTH_SERVER}/token`, {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    });

    const access_token = tokenRes.data.access_token;

    // ✅ 将 Token 写入 Cookie
    res.cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: 3600000,
        path: '/'
    });

    res.send(`
        <h1>App2 登录成功</h1>
        <p>Token: ${access_token}</p>
        <a href="/protected">访问受保护资源</a>
    `);
});

app.get('/protected', async (req, res) => {
    const { access_token } = req.cookies;

    if (!access_token) {
        return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    try {
        // 向 SSO 认证中心验证 Token
        const verifyRes = await axios.get(`${AUTH_SERVER}/verify?token=${access_token}`);

        console.log('verify res', JSON.stringify(verifyRes.data))

        if (verifyRes.data.valid) {
            return res.send(`<h2>欢迎访问 App2 的受保护页面</h2><p>User: ${verifyRes.data.user.name}</p>`);
        }
    } catch (e) {
        return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    res.status(401).send('Unauthorized');
});

app.listen(PORT, () => {
    console.log(`App2 running at http://localhost:${PORT}`);
});
