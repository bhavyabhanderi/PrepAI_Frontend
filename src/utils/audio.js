export function playNotificationSound() {
  try {
    const saved = localStorage.getItem('ai-interview-preferences');
    const prefs = saved ? JSON.parse(saved) : { email: true, sound: true };
    
    if (!prefs.sound) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Start at a higher frequency and drop quickly for a 'pop'/'bloop' sound
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio play errors (e.g., if user hasn't interacted with document yet)
    console.error('Failed to play sound', e);
  }
}
