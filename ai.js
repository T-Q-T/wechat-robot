import OpenAI from "openai";

const apiKey = 'api-key';
const openai = new OpenAI({
    apiKey,
    baseURL: "https://api.chatanywhere.tech/v1",
});

// 初始化对话历史，按用户或群聊进行区分
const conversationHistories = {};

export async function aiRobot(userId, message) {
    // 获取或初始化当前用户的对话上下文
    if (!conversationHistories[userId]) {
        conversationHistories[userId] = [
            { role: "system", content: "你是一个专业的微信 ai 机器人，精通各类知识，能够精简的帮人解决问题" },
        ];
    }

    let conversationHistory = conversationHistories[userId];

    // 限制上下文长度
    if (conversationHistory.length > 20) {
        conversationHistory = conversationHistories[userId] = conversationHistory.slice(-10);
    }

    // 将用户输入添加到对话上下文
    conversationHistory.push({ role: "user", content: message });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
        });

        const reply = completion.choices[0].message;
        
        // 将 AI 回复添加到对话上下文
        conversationHistory.push(reply);

        return reply.content; // 返回回复内容
    } catch (error) {
        console.error("Error generating completion:", error);
        return "AI 暂时无法回答，请稍后再试。";
    }
}
