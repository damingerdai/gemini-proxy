# Gemini API Reverse Proxy (Cloudflare Worker)

A high-performance, TypeScript-based reverse proxy for the Google Gemini API, designed to bypass regional network restrictions and provide stable access for LLM applications.

## 🚀 Features

- **TypeScript Support**: Full type safety and modern developer experience.
- **SSE Support**: Handles Server-Sent Events (streaming) for real-time AI responses.
- **CORS Enabled**: Configured to allow cross-origin requests.
- **Header Sanitization**: Properly re-writes `Host` and removes Cloudflare-specific headers to ensure compatibility with Google's API servers.

---

## 🛠 Deployment (Cloudflare Worker)

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [Cloudflare Account](https://dash.cloudflare.com/) and a registered domain (optional but recommended).

### 2. Initialize and Deploy

Install the **Wrangler CLI** and deploy the project:

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to your Cloudflare account
wrangler login

# Deploy the project
wrangler deploy

```

### 3. Proxy Configuration (`src/index.ts`)

The core logic maps incoming requests to `generativelanguage.googleapis.com` while maintaining the original path and query parameters.

---

## 🐍 Python Integration (LangChain)

To use this proxy in your Python project with `langchain-google-genai`, update your LLM initialization. Replace `YOUR_PROXY_DOMAIN` with your actual Worker URL.

```python
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic.types import SecretStr

def get_llm():
    # Recommended: Use base_url for the most stable integration
    proxy_url = "https://gemini-proxy.yourdomain.com/v1beta"
    api_key = "YOUR_GEMINI_API_KEY"

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        api_key=SecretStr(api_key),
        base_url=proxy_url
    )
    return llm

```

---

## ⚠️ Troubleshooting (403/404 Errors)

If you encounter a `403 Forbidden` error:

1. **Disable Bot Fight Mode**: In the Cloudflare Dashboard, go to `Security` -> `Bots` and turn off **Bot Fight Mode**.
2. **WAF Rules**: Ensure your IP or the request pattern isn't being blocked by Cloudflare Managed Rules.
3. **SSL Settings**: Set your Cloudflare SSL/TLS encryption mode to **Full** or **Full (strict)**.
4. **Endpoint Path**: Ensure you include the version prefix (e.g., `/v1beta`) in your `base_url` if the SDK doesn't append it automatically.

---

## 📄 License

MIT License. Feel free to use and modify for your own projects.
