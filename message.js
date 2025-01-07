import { aiRobot } from "./ai.js";

/**
 * 这里维护微信信息回调
 */
export const messageFn = async (message, bot) => {
    const room = message.room(); // 如果消息来自群聊，会返回 Room 对象
    const sender = message.talker(); // 获取发送者对象

    let contextId; // 用于标识当前对话上下文
    if (room) {
        const topic = await room.topic(); // 获取群聊名称
        const senderName = sender.name(); // 获取发送者的名称
        contextId = `room:${topic}`; // 使用群聊名称作为上下文 ID

        console.log(
            `收到来自群 "${topic}" 中 "${senderName}" 的消息：${message.text()}`
        );

        // 如果在群聊中被 @ 并提到“你好”
        if (await message.mentionSelf()) {
            const text = message
                .text()
                .replace(`@${bot.userSelf().name()}`, "")
                .trim();
            if (text.includes("小c")) {
                const result = await aiRobot(contextId, text);
                await message.say(result);
            }
        }
    } else {
        // 处理私聊消息
        const senderName = sender.name(); // 获取发送者的名称
        contextId = `user:${senderName}`; // 使用发送者名称作为上下文 ID

        const text = message.text();
        // 如果是私聊并提到“小c”
        if (text.includes("小c")) {
            const result = await aiRobot(contextId, text);
            await message.say(result);
        }
    }
};
