const url = 'https://nioskyview.atlassian.net/rest/api/3/issue/';
const user = process.env.JIRA_USER || 'yuganggang66@gmail.com';
const token = process.env.JIRA_API_TOKEN;
if (!token) throw new Error("JIRA_API_TOKEN environment variable is required.");
const ids = ['10007', '10005', '10003', '10001'];

async function fetchAll() {
    for (const id of ids) {
        try {
            const r = await fetch(url + id, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(user + ':' + token).toString('base64'),
                    'Accept': 'application/json'
                }
            });
            const data = await r.json();
            console.log(`[${data.key}]: ${data.fields.summary}`);
        } catch (e) {
            console.error(e);
        }
    }
}
fetchAll();
