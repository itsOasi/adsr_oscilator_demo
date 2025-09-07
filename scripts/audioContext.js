window.AudioEngine = (function() {
    let audioCtx;
    const activeNotes = {};

    function init() {
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function resume() {
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    }

    function noteOn({midiNote, adsr}) {
        resume();
        init();
        const now = audioCtx.currentTime;
        const freq = 440 * Math.pow(2, (midiNote-69)/12);

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();

        // Apply ADSR envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(adsr.gain, now + adsr.a);
        gain.gain.linearRampToValueAtTime(adsr.s * adsr.gain, now + adsr.a + adsr.d);

        if (!activeNotes[midiNote]) activeNotes[midiNote] = [];
        activeNotes[midiNote].push({osc, gain, adsr});
    }

    function noteOff({midiNote}) {
        const noteInstances = activeNotes[midiNote];
        if(!noteInstances) return;

        noteInstances.forEach(n => {
            const now = audioCtx.currentTime;
            const g = n.gain;
            g.gain.cancelScheduledValues(now);
            g.gain.setValueAtTime(g.gain.value, now);
            g.gain.linearRampToValueAtTime(0, now + n.adsr.r);
            n.osc.stop(now + n.adsr.r);
        });

        delete activeNotes[midiNote];
    }

    // Subscribe to events
    messageBus.on('oscillatorNoteOn', noteOn);
    messageBus.on('oscillatorNoteOff', noteOff);

    messageBus.on('initAudio', () => {
        init();
        resume();
        console.log('Audio engine initialized');
    });

    return { init, resume };
})();
