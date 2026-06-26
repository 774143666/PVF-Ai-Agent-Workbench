"use strict";

const childProcess = require("child_process");
const readline = require("readline");

class McpStdioClient {
  constructor(options) {
    this.command = options.command;
    this.args = options.args || [];
    this.cwd = options.cwd;
    this.env = options.env || {};
    this.nextId = 1;
    this.pending = new Map();
    this.stderr = "";
    this.process = null;
  }

  async start() {
    if (this.process) {
      return;
    }
    this.process = childProcess.spawn(this.command, this.args, {
      cwd: this.cwd,
      env: { ...process.env, ...this.env },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    this.process.on("exit", (code, signal) => {
      const stderr = this.stderr.trim();
      const detail = stderr ? `\nMCP upstream stderr:\n${stderr}` : "";
      const error = new Error(`MCP upstream exited with code=${code} signal=${signal}${detail}`);
      for (const pending of this.pending.values()) {
        pending.reject(error);
      }
      this.pending.clear();
      this.process = null;
    });

    this.process.stderr.on("data", (chunk) => {
      this.stderr += chunk.toString("utf8");
      if (this.stderr.length > 12000) {
        this.stderr = this.stderr.slice(-12000);
      }
    });

    const rl = readline.createInterface({ input: this.process.stdout });
    rl.on("line", (line) => {
      if (!line.trim()) {
        return;
      }
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        return;
      }
      if (message.id === undefined || message.id === null) {
        return;
      }
      const pending = this.pending.get(message.id);
      if (!pending) {
        return;
      }
      this.pending.delete(message.id);
      if (message.error) {
        pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      } else {
        pending.resolve(message.result);
      }
    });

    await this.request("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "pvf-agent-core-readonly", version: "1.0.0" },
    });
    this.notify("notifications/initialized", {});
  }

  request(method, params) {
    if (!this.process) {
      return Promise.reject(new Error("MCP upstream process is not running."));
    }
    const id = this.nextId++;
    const payload = { jsonrpc: "2.0", id, method, params };
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.process.stdin.write(`${JSON.stringify(payload)}\n`, "utf8", (error) => {
        if (error) {
          this.pending.delete(id);
          reject(error);
        }
      });
    });
  }

  notify(method, params) {
    if (!this.process) {
      return;
    }
    this.process.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`, "utf8");
  }

  async listTools() {
    await this.start();
    const result = await this.request("tools/list", {});
    return Array.isArray(result.tools) ? result.tools : [];
  }

  async callTool(name, args) {
    await this.start();
    return this.request("tools/call", { name, arguments: args || {} });
  }

  stop() {
    if (!this.process) {
      return;
    }
    this.process.kill();
    this.process = null;
  }
}

function parseMcpTextResult(result) {
  const textPart = result && Array.isArray(result.content) ? result.content.find((item) => item.type === "text") : null;
  if (!textPart) {
    return result;
  }
  try {
    return JSON.parse(textPart.text);
  } catch {
    return { text: textPart.text };
  }
}

module.exports = {
  McpStdioClient,
  parseMcpTextResult,
};
