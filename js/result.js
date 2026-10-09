function verdict(wpm, accuracy) {
  if (accuracy < 85) return 'Speed is there, but slow down a little. Accuracy first, and speed follows.';
  if (wpm >= 100) return 'Very fast. That is well above most typists.';
  if (wpm >= 70) return 'Fast. Clearly above average.';
  if (wpm >= 50) return 'Solid. A bit faster than the typical typist.';
  if (wpm >= 35) return 'About average for most people.';
  return 'A good start. A few short tests a day will move this up quickly.';
}

const last = store.read('ks_last', null);

if (!last || !Number.isFinite(last.wpm)) {
  window.location.replace('index.html');
} else {
  document.getElementById('setupLabel').textContent = `${MODE_NAMES[last.mode] ?? ''}, ${last.level}, ${last.time} seconds`;
  document.getElementById('resWpm').textContent = last.wpm;
  document.getElementById('resultRank').textContent = verdict(last.wpm, last.accuracy);
  document.getElementById('resAcc').textContent = last.accuracy + '%';
  document.getElementById('resCorrect').textContent = last.correct;
  document.getElementById('resErrors').textContent = last.mistakes;
  document.getElementById('resTime').textContent = last.seconds + 's';
}
