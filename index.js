/**
 * ChatMe Framework Core
 * Lightweight messaging & webhook handler
 */

class ChatMeEngine {
  constructor(config = {}) {
    this.name = config.name || "ChatMe Core";
    this.version = "1.0.0";
    this.channels = new Map();
    this.middlewares = [];
  }

  use(middleware) {
    if (typeof middleware === "function") {
      this.middlewares.push(middleware);
    }
  }

  createChannel(channelName) {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, []);
      return { status: "created", channel: channelName };
    }
    return { status: "exists", channel: channelName };
  }

  sendMessage(channelName, messageData) {
    if (!this.channels.has(channelName)) {
      throw new Error(`Channel ${channelName} does not exist.`);
    }

    const payload = {
      id: Date.now().toString(),
      sender: messageData.sender || "System",
      content: messageData.content,
      timestamp: new Date().toISOString(),
    };

    // Run middlewares
    for (const fn of this.middlewares) {
      fn(payload);
    }

    this.channels.get(channelName).push(payload);
    return payload;
  }

  getHistory(channelName) {
    return this.channels.get(channelName) || [];
  }
}

module.exports = ChatMeEngine;

// Quick initialization check
if (require.main === module) {
  const chat = new ChatMeEngine();
  console.log(`[ChatMe] Initialized ${chat.name} v${chat.version}`);
  chat.createChannel("general");
  const msg = chat.sendMessage("general", {
    sender: "Admin",
    content: "Welcome to ChatMe open-source ecosystem!",
  });
  console.log("[ChatMe] Test message dispatched:", msg);
}
