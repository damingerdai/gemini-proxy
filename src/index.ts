export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// 1. 构造目标 Google API URL
		// 逻辑：将你的 Worker 域名替换为 Google 官方域名，保留路径和参数
		const targetUrl = new URL(url.pathname + url.search, 'https://generativelanguage.googleapis.com');

		// 2. 复制并修改请求头
		const newHeaders = new Headers(request.headers);
		newHeaders.set('Host', 'generativelanguage.googleapis.com');
		// 移除一些可能导致干扰的 Cloudflare 特定头信息
		newHeaders.delete('cf-connecting-ip');
		newHeaders.delete('cf-ipcountry');
		newHeaders.delete('cf-ray');
		newHeaders.delete('cf-visitor');

		// 3. 构建转发请求
		const proxyRequest = new Request(targetUrl.toString(), {
			method: request.method,
			headers: newHeaders,
			body: request.body,
			redirect: 'follow',
		});

		try {
			const response = await fetch(proxyRequest);

			// 4. 处理响应头（支持跨域）
			const modifiedHeaders = new Headers(response.headers);
			modifiedHeaders.set('Access-Control-Allow-Origin', '*');
			modifiedHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
			modifiedHeaders.set('Access-Control-Allow-Headers', '*');

			// 5. 返回响应流
			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: modifiedHeaders,
			});
		} catch (err: any) {
			return new Response(`Proxy Error: ${err.message}`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
