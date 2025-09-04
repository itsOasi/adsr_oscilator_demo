// Wait for multiple ready events before initializing audio engine
function waitForReady(components, callback) {
    const readySet = new Set();
    components.forEach(comp => {
        messageBus.on(comp, () => {
            readySet.add(comp);
            if (readySet.size === components.length) callback();
        });
    });
}

// Wait for keyboard + ADSR
waitForReady(['keyboardReady','adsrReady'], () => {
    console.log('All components ready, initializing audio engine');
    messageBus.emit('initAudio');
});
