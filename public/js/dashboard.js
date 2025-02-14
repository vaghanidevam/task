document.getElementById('clickButton').addEventListener('click', async () => {
    const response = await fetch('/user/click', { method: 'POST' });
    const data = await response.json();
    if (data.success) {
        window.location.reload();
    }
});