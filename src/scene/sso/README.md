# 单点登录（SSO）Demo

## 单点登录（SSO）流程说明

+ 1.用户访问应用 A，未登录，跳转到 SSO 认证中心；
+ 2.认证中心检查是否已登录：
  - 如果未登录，则展示登录页面；
  - 如果已登录，则生成 Token 并重定向回应用 A；
+ 3.应用 A 拿着 Token 去认证中心验证身份； 
+ 4.验证成功后，用户可以访问应用 A； 
+ 5.用户访问应用 B 时，再次访问认证中心并携带 Token； 
+ 6.认证中心验证 Token 合法性，合法则直接跳转回应用 B； 
+ 7.应用 B 获取用户信息，完成免登录访问。

# 单点登录（SSO）Demo 说明文档

本项目实现了一个简化版的单点登录系统（Single Sign-On），支持多个子系统共享登录状态。用户只需登录一次，即可访问所有信任的应用。

## 🌐 功能概述

- 用户在认证中心登录后，可以访问多个受保护的子系统（如 App A、App B）；
- 使用 JWT 实现无状态 Token 认证；
- 支持 Cookie 共享，适用于多子域场景；
- 模拟了完整的 SSO 登录、验证、跳转流程；
- 可扩展为 OAuth2 / OpenID Connect 等协议基础框架。

## 🔑 核心流程图解

```

┌──────────────┐       ┌─────────────────────┐
│              │       │                     │
│   App A      ├──────▶│     SSO Auth Center │
│ (Protected)  │       │    (Login & Token)  │
└──────────────┘       └─────────────────────┘
▲                          ▲
│                          │
┌────────┴──┐        ┌─────────────┴────────────┐
│             │      │                            │
│   App B     ├──────┼─┐                          │
│ (Protected) │       │ └──▶                       │
└─────────────┘       └────────────────────────────┘
```
### 流程说明

1. **用户访问 App A**，未登录，被重定向至 SSO 认证中心；
2. **SSO 检查是否已登录**：
   - 未登录 → 显示登录页；
   - 已登录 → 生成 Token 并重定向回 App A；
3. **App A 获取 Token 后请求验证接口**，确认用户身份；
4. **用户访问 App B**，携带已有 Token；
5. **SSO 验证 Token 合法性**，合法则自动跳转回 App B；
6. **App B 获取用户信息并完成免登录访问**。

## 🧩 技术栈

- Node.js + Express：服务端逻辑
- JWT：Token 生成与验证
- Cookie：跨域共享 Token
- Axios：用于内部通信
- HTML + 原生 JS：前端页面模拟

## 📦 目录结构说明

```

sso/
├── sso-server.ts        // SSO 认证中心服务
├── app-a.ts               // 子系统 A 示例
├── app-b.ts               // 子系统 B 示例
└── README.md              // 当前文件
```
## 🚀 运行方式

### 安装依赖（确保你有 Node.js 和 npm）

```
bash
npm install express cookie-parser jsonwebtoken axios
```
### 启动服务

```
bash
node sso-server.js
node app-a.js
node app-b.js
```
三个服务分别运行在以下端口：

| 服务 | 地址 |
|------|------|
| SSO 认证中心 | http://localhost:3000 |
| App A | http://localhost:3001 |
| App B | http://localhost:3002 |

## 🧪 使用说明

### 1. 访问 App A

打开浏览器访问：

```

http://localhost:3001/protected
```
- 若未登录，会跳转到 SSO 登录页；
- 提交登录后，会被重定向回 App A；
- 页面显示用户 ID，表示登录成功。

### 2. 访问 App B

在同一浏览器中访问：

```

http://localhost:3002/protected
```
- 因为已在 SSO 登录，不会再次跳转登录；
- 自动获取 Token 并跳转至 App B；
- 页面显示用户 ID，表示免登录成功。

### 3. 注销流程（目前需手动清除 Cookie）

由于是演示环境，注销功能需要手动清除浏览器 Cookie 或重启服务。

---

## 📝 注意事项

- 所有子系统共享 Cookie 域名为 `.example.com`，请根据实际域名配置；
- JWT 设置了 1 小时过期时间，生产环境建议增加刷新机制；
- 可通过 Redis 缓存 session 实现分布式管理；
- 建议引入 HTTPS 提升安全性；
- 支持后续升级为 OAuth2 或 CAS 协议。

---

## 🛠️ 如何扩展

欢迎继续优化此项目：

- ✅ 添加登出接口，通知所有子系统清除 Token；
- ✅ 使用 Redis 缓存会话信息；
- ✅ 支持 Token 刷新（refresh token）；
- ✅ 引入 Vue/React 前端集成示例；
- ✅ 使用 Passport.js 支持第三方登录；
- ✅ 支持移动端 Token 认证流程。

# 问题

> **本地测试只能使用不同端口（如 localhost:3000、localhost:3001），而 Cookie 默认不能跨端口共享。**
>
> 跨域 Cookie 只能共享同父域名下的子域，如 `app.local` 和 `sso.local`。

---

## ✅ 核心问题总结

| 条件 | 是否能共享 Cookie |
|------|------------------|
| `localhost:3000` ➝ `localhost:3001` | ❌ 不行（端口不同） |
| `app.local:3000` ➝ `sso.local:3001` | ✅ 可以（统一父域名 `.local`） |

---

## 🚫 为什么不能直接用 `localhost`

- 浏览器将 `localhost:3000` 和 `localhost:3001` 视为两个**完全不同的源（origin）**
- 即使你设置了 `domain: 'localhost'`，也不能跨端口共享 Cookie
- 这是浏览器的安全策略决定的，无法绕过

---

## ✅ 解决方案：使用自定义本地域名（推荐）

### 💡 思路：
- 在本地配置一个公共的父域名，比如 `.local`
- 所有子系统都使用这个域名的不同子域（如 `app1.local`, `app2.local`, `sso.local`）
- 设置 Cookie 的 `domain: '.local'`，这样所有子域都能访问到 Token

---

## 🛠️ 步骤一：修改 hosts 文件，添加本地域名映射

打开你的 hosts 文件：

```bash
# Mac/Linux
sudo nano /etc/hosts

# Windows
C:\Windows\System32\drivers\etc\hosts
```


添加以下内容：

```
127.0.0.1 app1.local
127.0.0.1 app2.local
127.0.0.1 sso.local
```


保存后你可以通过以下地址访问服务：

- App1: http://app1.local:3001
- App2: http://app2.local:3002
- SSO: http://sso.local:3000

---

## 🛠️ 步骤二：SSO 设置 Cookie 到 `.local` 域名

在 `sso-server.ts` 中设置 Cookie：

```ts
res.cookie('sso_token', token, {
    httpOnly: true,
    domain: '.local', // ⚠️ 注意前面有个点
    path: '/',
    maxAge: 3600000, // 与 jwt expiresIn 匹配
});
```


这样所有子域名都可以读取到这个 Cookie。

---

## 🛠️ 步骤三：App1 和 App2 使用新域名访问

### 修改后的 `/protected` 路由示例（App1）

```ts
app.get('/protected', async (req, res) => {
    const { sso_token } = req.cookies;

    if (!sso_token) {
        return res.redirect(`http://sso.local:3000/login?redirect=http://app1.local:3001/callback`);
    }

    try {
        const verifyRes = await axios.get(`http://sso.local:3000/verify?token=${sso_token}`);
        if (verifyRes.data.valid) {
            return res.send(`<h1>Welcome to App A</h1><p>User: ${verifyRes.data.user.userId}</p>`);
        }
    } catch (e) {
        return res.redirect(`http://sso.local:3000/login?redirect=http://app1.local:3001/callback`);
    }

    res.status(401).send('Unauthorized');
});
```


### 修改后的 `/callback` 示例（App1 & App2）

```ts
app.get('/callback', (req, res) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).send('Missing token');
    }

    // Cookie 已被 SSO 设置好，无需再写入
    res.redirect('/protected');
});
```


---

## 🧪 最终验证流程

1. 用户访问：`http://app1.local:3001/protected`
2. 无 Token → 跳转至：`http://sso.local:3000/login?redirect=http://app1.local:3001/callback`
3. 登录成功后跳转回：`http://app1.local:3001/callback?token=xxx`
4. SSO 设置 Cookie 到 `.local` 域名下
5. 用户访问 `http://app2.local:3002/protected`
6. 因为 Cookie 存在于 `.local` 下，自动携带 Token 验证 ✅

---

## 📌 如果你坚持只用 localhost 端口（不推荐）

如果你确实想继续使用 `localhost:3000`, `localhost:3001`, `localhost:3002`，那你就**必须放弃 Cookie 共享机制**，改为：

### ✅ 方案：使用 URL Query String 传 Token（已实现）

- 登录后 Token 放在 redirect 的 query 中；
- 每个 App 在 `/callback` 接口中把 Token 写入自己的 Cookie；
- 每次登录只需一次，后续访问各 App 时会从各自的 `/callback` 中获取 Token 并写入本地 Cookie；
- 实现“单点登录”的视觉体验。

这种方式虽然不是真正的“全局 Token 共享”，但可以模拟出类似效果。

---

## ✅ 总结

| 场景 | 是否可行 | 建议 |
|------|----------|------|
| `localhost:3000` ➝ `localhost:3001` | ❌ 不行 | Cookie 作用域限制 |
| 使用 `.local` 域名 | ✅ 完全可行 | 推荐方式 |
| 使用 Query 传 Token + 各自存 Cookie | ✅ 可行 | 本地开发可用替代方案 |

---

## 🚀 如何选择？

| 目标 | 推荐做法 |
|------|-----------|
| 本地测试 | ✅ 使用 `.local` 域名（简单有效） |
| 生产部署 | ✅ 使用 `.yourdomain.com` 统一 Cookie |
| 快速演示 | ✅ 使用 Query 传 Token（简单快速） |
