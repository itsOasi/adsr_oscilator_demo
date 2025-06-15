
async function navigateTo(page){
    const header = document.querySelector("header")
    console.log(`Navigating to: ${page}`);
    switch (page) {
        case 'entry':
            await loadComponent('entry_form');
            header.style.display = "none";
            break;
        case 'home':
            await loadComponent('home');
            break;
        case 'org':
            await loadComponent("organization_settings");
            break;
        case 'giveaway':
            await loadComponent("giveaway_drawing");
            break;
        default:
            await loadPage('404');
    }
}

async function loadComponent(comp) {
    try {
        const response = await fetch(`./comp/${comp}.html`);
        if (!response.ok) throw new Error(`Failed to load ${comp}.html`);
        const html = await response.text();
        document.querySelector("#body").innerHTML = html;
        // Extract and run script tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');


        doc.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement('script');
            newScript.text = script.textContent;
            document.body.appendChild(newScript);
        });

    } catch (error) {
        console.error(error);
        document.body.innerHTML = `<p>Error loading ${comp} page.</p>`;
    }
}

let messageBus = {
    listeners: {},
    on: function(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },
    emit: function(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}