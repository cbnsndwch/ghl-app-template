import './ghl.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.ghl.getUserData();

    data.userId = '•••••••••••••••••••• (redacted)';
    data.companyId = '•••••••••••••••••••• (redacted)';

    document.getElementById('user-session-loading').style.display = 'none';
    document.getElementById('txt-user-session').innerHTML = JSON.stringify(
        data,
        null,
        2
    );
});
