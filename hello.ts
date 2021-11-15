import { listenAndServe } from "https://deno.land/std/http/server.ts"

const sockets = new Set<WebSocket>();
const channel = new BroadcastChannel("");
const headers = {"Content-type": "text/html"};
const html = `<script>let ws = new WebSocket("wss://"+location.host)
ws.onmessage = e => pre.textContent += e.data+"\\n"</script>
<input onkeyup="event.key=='Enter'&&ws.send(this.value)"><pre id=pre>`

channel.onmessage = e => {
	(e.target != channel) && channel.postMessage(e.data)
	sockets.forEach(s => s.send(e.data))
}

await listenAndServe(":8080", (r: Request) => {
	try {
		const { socket, response } = Deno.upgradeWebSocket(r)
		sockets.add(socket)
		socket.onmessage = channel.onmessage
		socket.onclose = _ => sockets.delete(socket)
		return response
	} catch { return new Response(html, {headers}) }
})
