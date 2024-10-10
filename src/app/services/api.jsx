
const sendMessageBot = (message) => {
    return fetch(`${window.origin}/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
        .then(response => response.json())
        .then(() => {
            return fetch(`${window.origin}/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            })
                .then(response => response.json())
                .then(data => data.response);
        });
};

export { sendMessageBot };