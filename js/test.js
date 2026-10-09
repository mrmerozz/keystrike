const settings = Settings.get();
const text = buildText(settings.mode, settings.level, settings.time);

const el = {
  wrap: document.getElementById('wordsWrap'),
  words: document.getElementById('wordDisplay'),
  input: document.getElementById('typingInput'),
  hint: document.getElementById('focusHint'),
  keyboard: document.getElementById('keyboard'),
  timer: document.getElementById('timerVal'),
  wpm: document.getElementById('wpmLive'),
  accuracy: document.getElementById('accLive'),
  mistakes: document.getElementById('errLive'),
  setup: document.getElementById('setupLabel'),
};

const state = {
  typed: '',
  keystrokes: 0,
  mistakes: 0,
  startedAt: 0,
  endsAt: 0,
  ticker: null,
  finished: false,
};

let chars = [];

function renderText() {
  const fragment = document.createDocumentFragment();
  chars = [];
  text.split(' ').forEach((word, w, all) => {
    const wordEl = document.createElement('span');
    wordEl.className = 'word';
    const letters = w < all.length - 1 ? word + ' ' : word;
    for (const letter of letters) {
      const span = document.createElement('span');
      span.className = letter === ' ' ? 'char char--space' : 'char';
      span.textContent = letter === ' ' ? ' ' : letter;
      wordEl.append(span);
      chars.push(span);
    }
    fragment.append(wordEl);
  });
  el.words.replaceChildren(fragment);
  markCursor();
}

function markCursor() {
  const index = state.typed.length;
  chars.forEach(span => span.classList.remove('is-cursor'));
  const cursor = chars[index];
  if (!cursor) return;
  cursor.classList.add('is-cursor');

  // Keep the line being typed as the second visible line.
  const word = cursor.parentElement;
  el.wrap.scrollTop = Math.max(0, word.offsetTop - el.words.offsetTop - word.offsetHeight);
}

function correctCount() {
  let count = 0;
  for (let i = 0; i < state.typed.length; i++) {
    if (state.typed[i] === text[i]) count++;
  }
  return count;
}

function elapsedSeconds() {
  return state.startedAt ? (performance.now() - state.startedAt) / 1000 : 0;
}

function stats() {
  const seconds = Math.max(elapsedSeconds(), 1);
  const correct = correctCount();
  return {
    wpm: Math.round(correct / 5 / (seconds / 60)),
    accuracy: state.keystrokes ? Math.round(((state.keystrokes - state.mistakes) / state.keystrokes) * 100) : 100,
    correct,
    mistakes: state.mistakes,
    seconds: Math.round(Math.min(elapsedSeconds(), settings.time) * 10) / 10,
  };
}

function showLive() {
  const now = stats();
  el.wpm.textContent = state.startedAt ? now.wpm : 0;
  el.accuracy.textContent = now.accuracy + '%';
  el.mistakes.textContent = now.mistakes;
  const left = state.startedAt ? Math.max(0, Math.ceil((state.endsAt - performance.now()) / 1000)) : settings.time;
  el.timer.textContent = left;
}

function start() {
  state.startedAt = performance.now();
  state.endsAt = state.startedAt + settings.time * 1000;
  state.ticker = setInterval(() => {
    showLive();
    if (performance.now() >= state.endsAt) finish();
  }, 100);
}

function finish() {
  if (state.finished) return;
  state.finished = true;
  clearInterval(state.ticker);
  el.input.disabled = true;

  const result = { ...stats(), mode: settings.mode, level: settings.level, time: settings.time, date: new Date().toISOString() };
  if (state.typed.length) Scores.add(result);
  store.write('ks_last', result);
  window.location.href = 'result.html';
}

function onInput() {
  if (state.finished) return;
  const value = el.input.value.slice(0, text.length);
  if (!state.startedAt && value.length) start();

  // Count every new keystroke, so fixing a mistake with Backspace still costs accuracy.
  for (let i = state.typed.length; i < value.length; i++) {
    state.keystrokes++;
    const right = value[i] === text[i];
    if (!right) state.mistakes++;
    flashKey(el.keyboard, value[i], right ? 'right' : 'wrong');
  }

  for (let i = Math.min(state.typed.length, value.length); i < Math.max(state.typed.length, value.length); i++) {
    const span = chars[i];
    span.classList.remove('is-right', 'is-wrong');
    if (i < value.length) span.classList.add(value[i] === text[i] ? 'is-right' : 'is-wrong');
  }

  state.typed = value;
  el.input.value = value;
  markCursor();
  showLive();

  if (value.length === text.length) finish();
}

function keepCaretAtEnd() {
  const end = el.input.value.length;
  if (el.input.selectionStart !== end || el.input.selectionEnd !== end) {
    el.input.setSelectionRange(end, end);
  }
}

function showFocus() {
  el.hint.hidden = document.activeElement === el.input;
}

el.input.addEventListener('input', onInput);
el.input.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.location.href = 'index.html';
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) e.preventDefault();
});
el.input.addEventListener('select', keepCaretAtEnd);
el.input.addEventListener('click', keepCaretAtEnd);
['paste', 'drop', 'cut'].forEach(type => el.input.addEventListener(type, e => e.preventDefault()));
el.input.addEventListener('focus', showFocus);
el.input.addEventListener('blur', showFocus);
el.wrap.addEventListener('click', () => el.input.focus());
document.getElementById('restartBtn').addEventListener('click', () => window.location.reload());

el.input.maxLength = text.length;
el.setup.textContent = `${MODE_NAMES[settings.mode]}, ${settings.level}, ${settings.time} seconds`;
buildKeyboard(el.keyboard);
renderText();
showLive();
el.input.focus();
showFocus();
