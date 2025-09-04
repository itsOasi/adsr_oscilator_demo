
async function navigateTo(page){
	const header = document.querySelector("header")
    console.log(`Navigating to: ${page}`);
	document.querySelector("#body").innerHTML = "";
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
        document.querySelector("#body").innerHTML += html;
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

async function loadPresetFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const presetName = urlParams.get('preset');
    if (!presetName) return;

    try {
        messageBus.emit('loadPreset', data);
        loadComponent(presetName);
        console.log(`Preset "${presetName}" loaded.`);
    } catch (err) {
        console.error('Failed to load preset:', err);
    }
}

// Call this once when the page/component loads
loadPresetFromURL();


// messageBus.js
// A simple pub/sub system with sticky events so late listeners get the last event
const messageBus = (() => {
    const listeners = {};
    const stickyEvents = {}; // store last emitted events

    return {
        on(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);

            // replay last event if it exists
            if (stickyEvents.hasOwnProperty(event)) {
                callback(stickyEvents[event]);
            }
        },
        emit(event, data) {
            stickyEvents[event] = data;
            if (listeners[event]) {
                listeners[event].forEach(cb => cb(data));
            }
        },
        stickyEvents
    };
})();



function waitForReady(events, callback) {
    const state = {};
    events.forEach(event => {
        messageBus.on(event, () => {
			console.log(`Component ready: ${event}`);
            state[event] = true;
            if (events.every(e => state[e])) {
                callback();
            }
        });
    });
}
