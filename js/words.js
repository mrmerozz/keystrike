const WordBank = {
  normal: {
    easy: [
      'the','and','for','are','but','not','you','all','can','her','was','one','our',
      'out','day','get','has','him','how','man','new','now','old','see','two','way',
      'who','boy','did','its','let','put','say','she','too','use','big','cat','dog',
      'run','sit','top','yes','any','ask','end','far','got','job','cut','fix','hit',
      'hot','lot','mix','own','pay','set','six','ten','win','yet','zip'
    ],
    medium: [
      'about','above','after','again','along','among','around','asked','being','below',
      'bring','build','carry','catch','cause','clean','clear','climb','close','comes',
      'could','count','cover','cross','crowd','dance','doing','dream','drink','drive',
      'earth','every','fall','feel','field','fight','found','great','group','grown',
      'guard','heart','heavy','house','human','large','laugh','learn','level','light'
    ],
    hard: [
      'absolutely','accomplish','according','achievement','acknowledge','acquisition',
      'additionally','administration','advancement','advantage','advertising','algorithm',
      'alternative','ambiguous','approximately','architecture','argument','assignment',
      'authentication','authorization','breakthrough','calculating','challenging',
      'characteristic','circumstances','collaborate','communication','configuration'
    ]
  },
  quote: {
    easy: [
      'be yourself every day',
      'stay humble and kind',
      'work hard dream big',
      'never stop learning',
      'keep going no matter what',
      'think big act bigger',
      'love what you do',
      'trust the process always'
    ],
    medium: [
      'the only way to do great work is to love what you do',
      'in the middle of every difficulty lies opportunity',
      'it always seems impossible until it is done',
      'the future belongs to those who believe in their dreams',
      'success is not final failure is not fatal only courage counts'
    ],
    hard: [
      'the greatest glory in living lies not in never falling but in rising every time we fall',
      'your time is limited so do not waste it living someone else\'s life',
      'if life were predictable it would cease to be life and be without flavor or surprise',
      'if you want to live a happy life tie it to a goal not to people or things that come and go',
      'spread love everywhere you go and let no one ever come to you without leaving happier'
    ]
  },
  code: {
    easy: [
      'var','let','const','for','if','else','return','true','false','null',
      'function','class','import','export','from','this','new','typeof',
      'break','case','catch','continue','default','delete','finally','throw'
    ],
    medium: [
      'const result = array.filter(item => item.active)',
      'function greet(name) { return `hello ${name}` }',
      'let count = 0; while (count < 10) { count++ }',
      'const arr = [1, 2, 3].map(n => n * 2)',
      'class Animal { constructor(name) { this.name = name } }'
    ],
    hard: [
      'const fetchData = async () => { const res = await fetch(url); return res.json() }',
      'const memoize = fn => { const cache = {}; return (...args) => cache[args] || (cache[args] = fn(...args)) }',
      'const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) } }',
      'function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; const left = arr.slice(1).filter(x => x <= pivot); return [...quickSort(left), pivot, ...quickSort(arr.slice(1).filter(x => x > pivot))] }'
    ]
  },
  numbers: {
    easy: [
      '1','2','3','4','5','6','7','8','9','0',
      '10','11','12','13','14','15','16','17','18','19','20',
      '25','30','40','50','60','70','80','90','100',
      '123','456','789','321','654','987','111','222','333','444',
      '555','666','777','888','999','101','202','303'
    ],
    medium: [
      '1,024','2,048','4,096','8,192','1,337','9,001',
      '10,000','25,000','50,000','75,000','99,999','12,345',
      '3.14','2.71','1.41','1.73','0.99','0.01','100.5',
      '2023','2024','2025','1999','2000','1990','1985'
    ],
    hard: [
      '3.14159265','2.71828182','1.61803398','1.41421356',
      '192.168.1.1','255.255.255.0','127.0.0.1','10.0.0.1',
      '9,876,543','1,234,567','1,000,000','2,147,483',
      '3.14 * 2.71','100 / 3.14','2,048 + 1,337','9,999 - 1,234'
    ]
  },
  symbols: {
    easy: [
      "it's","don't","can't","won't","I'm","you're","they're","he's","she's","we're",
      "isn't","wasn't","didn't","couldn't","wouldn't","shouldn't","aren't","weren't",
      "I've","you've","we've","they've","I'll","you'll","he'll","she'll","we'll"
    ],
    medium: [
      '"hello world"','"good morning"','"stay focused"','"keep it up"','"well done"',
      '"type faster"','"no mistakes"','"you got this"','"almost there"','"nice work"',
      "'she said hi'","'don't stop'","'keep going'","'trust yourself'","'stay calm'"
    ],
    hard: [
      'end; break; return;',
      'arr[0]; obj.key; fn();',
      '"name": "value", "id": 1',
      'if (x > 0) { return x; }',
      'while (i < n) { i++; }',
      'for (let i = 0; i < 10; i++)',
      'console.log("done.");',
      'import { a, b } from "./mod";',
      'const x = a > b ? a : b;',
      'throw new Error("failed.");'
    ]
  }
};

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Enough text that even a 160 wpm typist will not run out before the timer.
function buildText(mode, level, seconds) {
  const pool = WordBank[mode][level];

  if (mode === 'quote') {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const minChars = Math.max(200, seconds * 14);
  const picks = [];
  let length = 0;
  while (length < minChars) {
    for (const item of shuffled(pool)) {
      picks.push(item);
      length += item.length + 1;
      if (length >= minChars) break;
    }
  }
  return picks.join(' ');
}
