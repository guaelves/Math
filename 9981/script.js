document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('multiplicationTable');
  const challengeButtonsDiv = document.getElementById('challengeButtons');
  const messageDiv = document.getElementById('message');

  // 建立挑戰按鈕 1~9
  for (let n = 1; n <= 9; n++) {
    const btn = document.createElement('button');
    btn.textContent = `挑戰 ${n}`;
    btn.classList.add('challenge-btn');
    btn.addEventListener('click', () => startChallenge(n));
    challengeButtonsDiv.appendChild(btn);

    if (n === 9) {
      const clearBtn = document.createElement('button');
      clearBtn.textContent = '全部清空挑戰';
      clearBtn.classList.add('clear-btn');
      clearBtn.addEventListener('click', () => {
        const tds = table.querySelectorAll('td');
        tds.forEach(td => {
          td.textContent = '';
          td.className = '';
        });
        messageDiv.textContent = '';
      });
      challengeButtonsDiv.appendChild(clearBtn);
    }
  }

  function speakNumber(num) {
    const utter = new SpeechSynthesisUtterance(num.toString());
    utter.lang = 'zh-TW';
    speechSynthesis.speak(utter);
  }

  function createTable() {
    table.innerHTML = '';
    messageDiv.textContent = '';
    currentChallenge = null;

    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('th');
    emptyCell.textContent = 'x';
    headerRow.appendChild(emptyCell);

    for (let i = 1; i <= 9; i++) {
      const th = document.createElement('th');
      th.textContent = i;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let i = 1; i <= 9; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = i;
      tr.appendChild(th);

      for (let j = 1; j <= 9; j++) {
        const td = document.createElement('td');
        td.textContent = i * j;
        td.classList.add('done');
        td.dataset.answer = i * j;
        td.dataset.row = i;
        td.dataset.col = j;

        td.addEventListener('click', function () {
          if (td.querySelector('input')) return;
          highlightHeader(i, j);
          speakNumber(j);
          setTimeout(() => speakNumber(i), 400);

          td.textContent = '';
          td.className = '';
          const input = document.createElement('input');
          input.type = 'tel';
          input.inputMode = 'numeric';
          td.appendChild(input);
          input.focus();

          input.addEventListener('blur', function () {
            const answer = parseInt(td.dataset.answer);
            const val = parseInt(input.value);
            if (val === answer) {
              td.className = 'correct';
              td.textContent = answer;
              checkChallengeCompletion();
            } else {
              td.className = 'wrong';
              td.textContent = input.value || '';
            }
            removeHighlight();
          });

          input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') input.blur();
          });
        });

        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  function highlightHeader(row, col) {
    removeHighlight();
    const ths = table.querySelectorAll('th');
    ths[col].classList.add('highlight');
    table.rows[row].cells[0].classList.add('highlight');
  }

  function removeHighlight() {
    table.querySelectorAll('th').forEach(th => th.classList.remove('highlight'));
  }

  let currentChallenge = null;
  function startChallenge(n) {
    currentChallenge = n;
    messageDiv.textContent = '';
    for (let row = 1; row <= 9; row++) {
      const td = table.rows[row].cells[n];
      td.textContent = '';
      td.className = '';
    }
  }

  function checkChallengeCompletion() {
    if (!currentChallenge) return;
    let allCorrect = true;
    for (let row = 1; row <= 9; row++) {
      const td = table.rows[row].cells[currentChallenge];
      if (!td.classList.contains('correct')) {
        allCorrect = false;
        break;
      }
    }
    if (allCorrect) {
      messageDiv.textContent = `挑戰成功，恭喜全對！`;
      showFirework();
      currentChallenge = null;
    }
  }

  function showFirework() {
    for (let i = 0; i < 20; i++) {
      const fire = document.createElement('div');
      fire.className = 'firework';
      fire.style.width = fire.style.height = `${Math.random() * 10 + 10}px`;
      fire.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      fire.style.left = `${Math.random() * 90}vw`;
      fire.style.top = `${Math.random() * 60}vh`;
      document.body.appendChild(fire);
      setTimeout(() => fire.remove(), 800);
    }
  }

  document.getElementById('resetBtn').addEventListener('click', () => {
    createTable();
  });

  createTable();

  // 泡泡遊戲連結按鈕
  const bubbleButtonsDiv = document.getElementById('bubbleButtons');
  for (let n = 2; n <= 9; n++) {
    const btn = document.createElement('a');
    btn.textContent = `${n} 乘法泡泡`;
    btn.href = `https://guaelves.github.io/Math/9981/${n}.html`;
    Object.assign(btn.style, {
      display: 'inline-block',
      backgroundColor: '#c8a2f7',
      color: '#fff',
      textAlign: 'center',
      fontSize: 'clamp(16px, 4vw, 24px)',
      padding: '10px',
      borderRadius: '8px',
      textDecoration: 'none',
      cursor: 'pointer'
    });
    bubbleButtonsDiv.appendChild(btn);
  }

  const allBtn = document.createElement('a');
  allBtn.textContent = '2~9 乘法泡泡';
  allBtn.href = 'https://guaelves.github.io/Math/9981/All.html';
  Object.assign(allBtn.style, {
    display: 'inline-block',
    backgroundColor: '#ff6f61',
    color: '#fff',
    textAlign: 'center',
    fontSize: 'clamp(16px, 4vw, 24px)',
    padding: '10px',
    borderRadius: '8px',
    textDecoration: 'none',
    cursor: 'pointer'
  });
  bubbleButtonsDiv.appendChild(allBtn);
});
