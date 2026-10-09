const MODE_NAMES = { normal: 'Words', quote: 'Quote', code: 'Code', numbers: 'Numbers', symbols: 'Symbols' };
const MODES = Object.keys(MODE_NAMES);
const LEVELS = ['easy', 'medium', 'hard'];
const TIMES = [15, 30, 60];

const store = {
  read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be blocked in private windows. The test still runs.
    }
  },
};

const Settings = {
  get() {
    const saved = store.read('ks_config', {});
    return {
      mode: MODES.includes(saved.mode) ? saved.mode : 'normal',
      level: LEVELS.includes(saved.level) ? saved.level : 'easy',
      time: TIMES.includes(saved.time) ? saved.time : 30,
    };
  },
  set(settings) {
    store.write('ks_config', settings);
  },
};

const Scores = {
  all() {
    const list = store.read('ks_scores', []);
    if (!Array.isArray(list)) return [];
    return list
      .filter(s => s && Number.isFinite(s.wpm))
      .map(s => ({ ...s, accuracy: s.accuracy ?? s.acc ?? 0 }));
  },
  add(entry) {
    const list = [...this.all(), entry].sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    store.write('ks_scores', list.slice(0, 10));
  },
};

