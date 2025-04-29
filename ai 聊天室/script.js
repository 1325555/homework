// 等待 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', generateJoke);
});

function addMessage(content, isUser = false) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function generateJoke() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('請輸入 API 金鑰');
        return;
    }
    const jokeType = document.getElementById('jokeType').value;
    addMessage(`讓我講個${jokeType}給你聽！`, false);
    const input = document.getElementById('jokeType');

    try {
        const prompt = `請為我生成一個有趣的${jokeType}笑話。請確保笑話內容：
1. 適合所有年齡層
2. 富有創意且有趣
3. 使用繁體中文
4. 包含笑話的前言和笑點
請直接給出笑話內容，不需要其他說明。`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        console.log('Sending request to API...');
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const text = await response.text();
        console.log('Raw API Response:', text);

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(`API 請求失敗: ${response.status}`);
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            throw new Error('API 回應格式不正確');
        }        const jokeText = data.candidates[0].content.parts[0].text;
        addMessage(jokeText, false);
        input.value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('抱歉，生成笑話時發生錯誤，請稍後再試。');
    }
}

// 添加按下 Enter 鍵發送的功能
document.getElementById('jokeType').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateJoke();
    }
});
