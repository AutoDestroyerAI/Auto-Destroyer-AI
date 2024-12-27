document.getElementById('send-gift').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Enter your name');
        return;
    }

    try {
        const response = await fetch('/send-gift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('gift-image').classList.remove('hidden');
            document.getElementById('gift').src = result.giftImage;
            const giftList = document.getElementById('gift-list');
            const newItem = document.createElement('li');
            newItem.textContent = `@${username}`;
            giftList.appendChild(newItem);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error(error);
        alert('发送礼物时出错，请稍后再试！');
    }
});
