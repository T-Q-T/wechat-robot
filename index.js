import { WechatyBuilder } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";
import fs from "fs";
import path from "path";
import { messageFn } from "./message.js";
import QRCode from "qrcode";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const bot = WechatyBuilder.build({
  puppet: "wechaty-puppet-wechat4u",
});

bot
  .on("scan", (qrcode) => {
    console.log("请扫描以下二维码登录：", qrcode);
    qrcodeTerminal.generate(qrcode, { small: true }); // 显示二维码到终端
    // 生成二维码图片并保存为 PNG 文件
    const filePath = path.resolve(__dirname, "qrcode.png");
    QRCode.toFile(
      filePath,
      qrcode,
      {
        color: {
          dark: "#000000", // 黑色
          light: "#ffffff", // 白色
        },
      },
      (err) => {
        if (err) console.error("二维码保存失败:", err);
        else console.log(`二维码已保存为 ${filePath}`);
      }
    );
  })
  .on("login", (user) => {
    console.log(`登录成功：${user}`);
  })
  .on("logout", () => {
    console.log("已登出，清除本地缓存");
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile); // 删除缓存文件
    }
  })
  .on("message", (message) => {
    messageFn(message, bot);
  });

bot.start().catch((error) => console.error("启动失败：", error));
