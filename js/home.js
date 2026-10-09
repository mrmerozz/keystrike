function showChoices(settings) {
  document.querySelectorAll('.choice').forEach(button => {
    const current = String(settings[button.dataset.setting]);
    button.setAttribute('aria-pressed', String(button.dataset.value === current));
  });
}

function showScores() {
  const list = document.getElementById('bestScores');
  const scores = Scores.all().slice(0, 5);

  if (!scores.length) {
    const empty = document.createElement('li');
    empty.className = 'scores__empty';
    empty.textContent = 'No scores yet. Your best five show up here.';
    list.replaceChildren(empty);
    return;
  }

  list.replaceChildren(...scores.map(score => {
    const row = document.createElement('li');
    row.className = 'scores__row';
    const date = new Date(score.date);
    const cells = [
      [`${score.wpm} wpm`, 'scores__wpm'],
      [`${score.accuracy}%`, ''],
      [`${MODE_NAMES[score.mode] ?? score.mode}, ${score.level}, ${score.time}s`, ''],
      [Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 'scores__date'],
    ];
    cells.forEach(([text, cls]) => {
      const cell = document.createElement('span');
      cell.textContent = text;
      if (cls) cell.className = cls;
      row.append(cell);
    });
    return row;
  }));
}

const settings = Settings.get();

document.querySelectorAll('.choice').forEach(button => {
  button.addEventListener('click', () => {
    const { setting, value } = button.dataset;
    settings[setting] = setting === 'time' ? Number(value) : value;
    Settings.set(settings);
    showChoices(settings);
  });
});

showChoices(settings);
showScores();
