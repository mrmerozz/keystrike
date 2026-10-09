const KEY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

// Shifted characters light up the key they live on.
const SHIFTED = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8',
  '(': '9', ')': '0', '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
  '<': ',', '>': '.', '?': '/',
};

function buildKeyboard(container) {
  container.replaceChildren(...KEY_ROWS.map(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(key => {
      const keyEl = document.createElement('span');
      keyEl.className = key === ' ' ? 'key key--space' : 'key';
      keyEl.textContent = key === ' ' ? '' : key;
      keyEl.dataset.key = key;
      rowEl.append(keyEl);
    });
    return rowEl;
  }));
}

function flashKey(container, char, result) {
  const lower = char.toLowerCase();
  const key = container.querySelector(`[data-key="${CSS.escape(SHIFTED[char] ?? lower)}"]`);
  if (!key) return;
  const cls = `key--${result}`;
  key.classList.remove('key--right', 'key--wrong');
  void key.offsetWidth;
  key.classList.add(cls);
  setTimeout(() => key.classList.remove(cls), 220);
}
