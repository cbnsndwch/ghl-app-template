import './sso.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await window.sso.getUserInfo();

    data.userId = '•••••••••••••••••••• (redacted)';
    data.companyId = '•••••••••••••••••••• (redacted)';

    document.getElementById('user-session-loading').style.display = 'none';
    document.getElementById('txt-user-session').innerHTML = JSON.stringify(
        data,
        null,
        2
    );
});
