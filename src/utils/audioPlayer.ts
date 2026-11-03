/**
 * Audio synthesis utility for pure phonemes in early literacy.
 * Avoids adding extraneous schwa (e.g., pure /s/, /t/, /p/, /m/).
 */

class PhonemeAudioPlayer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pure sound or synthesized utterance
  public playPhoneme(phoneme: string, sampleWord?: string) {
    this.initCtx();
    const clean = phoneme.toLowerCase().replace(/[\/\[\]]/g, '').trim();

    // Try custom synthesis for pure consonants if context available
    if (this.ctx) {
      if (clean === 's') {
        this.playFricative(5000, 0.45);
        return;
      }
      if (clean === 't') {
        this.playPlosive(3500, 0.08);
        return;
      }
      if (clean === 'p') {
        this.playPlosive(1200, 0.06);
        return;
      }
      if (clean === 'm') {
        this.playNasal(220, 0.5);
        return;
      }
      if (clean === 'n') {
        this.playNasal(280, 0.5);
        return;
      }
      if (clean === 'f') {
        this.playFricative(3200, 0.4);
        return;
      }
    }

    // High quality Web Speech fallback with natural articulation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Phonetic pronunciation hint: if vowel like 'a', speak 'ah' or word context
      let textToSpeak = clean;
      if (clean === 'a') textToSpeak = 'ah';
      else if (clean === 'i') textToSpeak = 'ih';
      else if (clean === 'o') textToSpeak = 'aw';
      else if (clean === 'u') textToSpeak = 'uh';

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.lang = 'en-GB'; // British English standard for phonics
      
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('English')));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    }
  }

  public playWord(word: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.85;
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  }

  // Pure voiceless fricative (like /s/ or /f/) via white noise and high-pass filter
  private playFricative(freq: number, duration: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  // Pure voiceless plosive (like /t/ or /p/)
  private playPlosive(freq: number, duration: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Pure nasal hum (like /m/ or /n/)
  private playNasal(freq: number, duration: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const phonemeAudio = new PhonemeAudioPlayer();
