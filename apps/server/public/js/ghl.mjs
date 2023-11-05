/**
 * A GHL helper service that retrieves user data by retrieving SSO session
 * details from the main GHL app and sending a request to a server that 
 * decrypts the response using the marketplace app's SSO Key.
 */
window.ghl = {
    async getUserData() {
        const key = await new Promise(resolve => {
            window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');
            window.addEventListener('message', ({ data }) => {
                if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
                    resolve(data.payload);
                }
            });
        });

        const res = await fetch('/api/ghl/sso/session', {
            method: 'GET',
            headers: {
                'x-ghl-sso-key': key
            }
        });

        const data = await res.json();

        return data;
    }
};
