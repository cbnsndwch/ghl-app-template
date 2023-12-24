import './sso.mjs';


/**
 * A helper service that retrieves user data by getting an SSO session key
 * from the main GHL app and sending a request to a back-end that decrypts the 
 * response using the marketplace app's SSO Key. The back-end may also perform
 * additional validation and authorization on the request and/or include app-specific
 * user data in the response.
 */
window.sso = window.sso || {
    async getUserInfo() {
        const sessionKey = await new Promise(resolve => {
            window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');
            window.addEventListener('message', ({ data }) => {
                if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
                    resolve(data.payload);
                }
            });
        });

        const res = await fetch('/api/sso/ghl', {
            headers: { 'x-sso-session': sessionKey }
        });

        const data = await res.json();
        return data;
    }
};

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
