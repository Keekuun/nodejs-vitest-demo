
> 在真实场景中，比如使用钉钉、微信、QQ 等第三方登录授权时，并没有 cookie 共享问题。这是怎么实现的呢？

---

## ✅ 核心结论：

> **这些系统并不依赖 Cookie 实现身份共享，而是通过 Token 机制 + 第三方认证中心完成统一登录状态管理**。

---

## 🧠 详细解释

### 📌 场景：用户在 App A 使用钉钉登录

1. 用户点击“使用钉钉登录”；
2. App A 将用户重定向到钉钉认证中心；
3. 用户扫码/账号密码登录后，钉钉返回一个 `access_token`；
4. App A 获取 `access_token` 并保存到自己的服务端或前端；
5. 用户访问 App B 时，App B 再次将用户引导至钉钉认证中心；
6. 钉钉检查浏览器是否已有登录会话（通常是钉钉自身的 Cookie）；
    - 如果有，则直接返回新的 `access_token`；
    - 如果没有，再次要求用户登录；
7. App B 拿到 Token 后完成登录，无需用户重新输入账号密码 ✅

---

## 🔐 实现原理详解

### 1️⃣ 使用 OAuth2 / OpenID Connect 协议（标准做法）

#### 核心角色：
| 角色 | 说明 |
|------|------|
| **Resource Owner** | 用户 |
| **Client (App A / App B)** | 子系统 |
| **Authorization Server** | 第三方认证中心（如钉钉、企业微信） |
| **Resource Server** | 受保护资源服务器 |

#### 登录流程如下：
```
User ──(访问 App A)──> App A
           │
           ▼
     ┌────────────┐
     │  Redirect to DingTalk OAuth URL
     └────────────┘
           │
           ▼
    ┌────────────────────┐
    │ 用户在钉钉登录页面登录 │
    └────────────────────┘
           │
           ▼
  ┌────────────────────────────┐
  │ 钉钉回调 App A 的 redirect_uri │
  │ 带上 code 或 token          │
  └────────────────────────────┘
           │
           ▼
     ┌────────────┐
     │ App A 获取 access_token │
     └────────────┘
           │
           ▼
     ┌────────────┐
     │ 用户访问 App B │
     └────────────┘
           │
           ▼
     ┌────────────────────┐
     │ App B 再次跳转钉钉授权页 │
     └────────────────────┘
           │
           ▼
   ┌────────────────────────────┐
   │ 钉钉发现用户已登录，自动跳回 App B │
   │ 带上新的 access_token       │
   └────────────────────────────┘
           │
           ▼
     ┌────────────┐
     │ App B 完成登录 │
     └────────────┘
```


---

## 🚫 不需要 Cookie 共享的原因

- 所有子系统（App A/B）都信任同一个第三方认证中心（如钉钉）；
- 每个 App 都有自己的 Token 和 session；
- 浏览器与钉钉之间的 Cookie 是独立的（属于 `.dingtalk.com`），用于钉钉内部维护登录状态；
- App A/B 之间不需要共享 Cookie，只需要信任钉钉颁发的 Token；
- Token 通常以 JWT 形式存在本地存储（localStorage）或内存中，而不是 Cookie 中；

---

## ✅ 实际实现方式

### 1️⃣ 第三方登录流程（OAuth2 授权码模式）

#### App A 发起登录请求：

```http
GET https://oapi.dingtalk.com/connect/oauth2/sns_authorize?
    appid=APPID
    &response_type=code
    &redirect_uri=REDIRECT_URI
    &state=STATE
```


#### 钉钉回调你的 App A：

```
http://yourdomain.com/callback?code=xxxxxx&state=STATE
```


#### App A 请求钉钉换取 access_token：

```ts
const res = await axios.get('https://oapi.dingtalk.com/sns/gettoken', {
    params: {
        appid: 'YOUR_APPID',
        appsecret: 'YOUR_SECRET',
        code: 'xxxxxx'
    }
});
```


#### App A 保存用户信息并设置自己的 Token：

```ts
res.cookie('app_a_token', generatedJwtToken, { domain: '.yourdomain.com' });
```


---

### 2️⃣ App B 使用同样的钉钉授权流程

- App B 也配置了钉钉登录；
- 用户访问 App B 时跳转到钉钉；
- 因为钉钉已经登录过，所以钉钉自动跳回 App B；
- App B 获取 Token 并验证用户身份；
- 设置自己的 Cookie：`app_b_token`，作用域为 `.yourdomain.com`

---

## 🧩 这种模式的优势

| 特性 | 描述 |
|------|------|
| ✅ 无需 Cookie 共享 | 每个 App 自己管理自己的 Token |
| ✅ 支持跨域、多域名 | 所有 App 只需信任同一个认证中心 |
| ✅ 支持登出同步 | 可通过中央认证中心登出接口通知所有子系统 |
| ✅ 生产级安全 | 使用 OAuth2 / OpenID Connect 协议 |
| ✅ 多平台支持 | Web / 移动端 / 小程序通用 |

---

## 🛠️ 实际开发建议

### 1. 使用成熟的 SSO 认证协议

- ✅ OAuth2
- ✅ OpenID Connect（基于 OAuth2）
- ✅ CAS / SAML（企业级 SSO）

### 2. 使用中间层统一 Token 管理

你可以搭建一个统一认证网关：

```
┌──────────────┐      ┌──────────────┐
│              │      │              │
│  App A       ├────▶│ Auth Gateway │
│              │      │              │
└──────────────┘      └──────────────┘
                                ▲
                                │
                        ┌──────────────┐
                        │ Third Party  │
                        │ OAuth Server │
                        └──────────────┘
```


这样 App A/B 都只需信任这个中间网关，而无需关心 Token 来自哪里。

---

## 🧪 示例：多个应用使用钉钉登录（伪代码）

```ts
// App A 登录逻辑
app.get('/login', () => {
    const dingtalkUrl = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?' +
        'appid=YOUR_APPID' +
        '&redirect_uri=http://app-a.yourdomain.com/callback';
    res.redirect(dingtalkUrl);
});

// App B 登录逻辑
app.get('/login', () => {
    const dingtalkUrl = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?' +
        'appid=YOUR_OTHER_APPID' +
        '&redirect_uri=http://app-b.yourdomain.com/callback';
    res.redirect(dingtalkUrl);
});
```


虽然 App A 和 App B 是两个不同的应用，但它们都信任钉钉的身份认证结果。

---

## 📌 总结

| 方案 | 是否共享 Cookie | 描述 |
|------|------------------|------|
| ❌ Cookie 共享 | ❌ 不可行 | 跨域限制严重，不适用于生产 |
| ✅ OAuth2 / OIDC | ✅ 推荐 | 所有 App 信任同一个认证中心 |
| ✅ Token 转发 | ✅ 可行 | App A 获取 Token 后转发给 App B |
| ✅ 后端统一网关 | ✅ 推荐 | 所有 App 都走一个认证层 |
