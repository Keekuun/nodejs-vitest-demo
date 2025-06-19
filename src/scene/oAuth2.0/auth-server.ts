// auth-server.ts
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const CLIENTS = {
    'app1': 'secret1',
    'app2': 'secret2'
};

const SECRET = 'your-oauth-secret-key';

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 模拟用户已登录状态
const loggedUser = {
    userId: 'user-123',
    name: '张三'
};

app.use(cookieParser());

// 授权页（用户点击同意授权）
app.get('/authorize', (req: Request, res: Response) => {
    const { client_id, redirect_uri, state } = req.query;

    if (!client_id || !redirect_uri || !state) {
        return res.status(400).send('Missing parameters');
    }

    // 用户确认授权后跳转回 redirect_uri，并带上 code
    const code = jwt.sign({ client_id }, 'code-secret', { expiresIn: '5m' });
    res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
});

// 获取 access_token
app.post('/token', (req: Request, res: Response) => {
    const { code, client_id, client_secret } = req.body;

    if (!code || !client_id || !client_secret || CLIENTS[client_id as string] !== client_secret) {
        return res.status(400).json({ error: 'invalid_request' });
    }

    try {
        const decoded = jwt.verify(code, 'code-secret') as { client_id: string };

        const access_token = jwt.sign(
            { user: loggedUser },
            SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            access_token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    } catch (e) {
        return res.status(400).json({ error: 'invalid_code' });
    }
});

// auth-server.ts
app.get('/verify', (req, res) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ valid: false });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        // jwt.verify 会自动验证 token 的有效期
        // if (decoded.exp * 1000 < Date.now()) {
        //     return res.status(400).json({ valid: false });
        // }

        console.log('decoded', decoded)

        res.json({ valid: true, user: decoded.user });
    } catch (e) {
        res.json({ valid: false });
    }
});


app.listen(PORT, () => {
    console.log(`OAuth2 Server running at http://localhost:${PORT}`);
});
