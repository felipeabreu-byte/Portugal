async function check() {
    try {
        console.log("Fetching...");
        const res = await fetch("https://economia.awesomeapi.com.br/last/EUR-BRLT", {
            cache: 'no-store'
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
        try {
            const data = JSON.parse(text);
            console.log("Parsed:", data);
        } catch (e) { console.error("Parse error", e); }
    } catch (e) {
        console.error("Fetch error", e);
    }
}
check();
