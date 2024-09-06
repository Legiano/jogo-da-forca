
const words = [
    { word: "maracuja", clue: "Fruta tropical" },
    { word: "nanotecnologia", clue: "Manipulação de materiais em escala atômica" },
    { word: "computador", clue: "Dispositivo eletrônico" },
    { word: "chocolate", clue: "Doce feito de cacau" },
    { word: "bicicleta", clue: "Veículo de duas rodas" },
    { word: "escola", clue: "Lugar de aprendizado" },
    { word: "carro", clue: "Veículo de quatro rodas" },
    { word: "robótica", clue: "Campo que envolve a criação de robôs" },
    { word: "montanha", clue: "Grande elevação natural" },
    { word: "avião", clue: "Meio de transporte aéreo" },
    { word: "internet", clue: "Rede mundial de computadores" },
    { word: "biblioteca", clue: "Lugar com muitos livros" },
    { word: "telefone", clue: "Dispositivo de comunicação" },
    { word: "vacina", clue: "Prevenção de doenças" },
    { word: "cachorro", clue: "Melhor amigo do homem" },
    { word: "telemedicina", clue: "Atendimento médico à distância" },
  ];
  
  const usedWords = [];
  
  function getRandomWord() {
    let availableWords = words.filter(wordObj => !usedWords.includes(wordObj.word));
    
    if (availableWords.length === 0) {
      usedWords.length = 0;
      availableWords = words;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    
    usedWords.push(selectedWord.word);
    
    return selectedWord;
  }
  
  const contentBtns = document.getElementById("buttons");
  const contentGuessWord = document.getElementById("guess-word");
  const img = document.getElementById("hangman-img");
  const contentClue = document.getElementById("clue");
  const btnNew = document.getElementById("new-game");
  const btnClearRanking = document.getElementById("clear-ranking");
  const scoreElement = document.getElementById("score");
  const rankingList = document.getElementById("ranking-list");
  
  let indexImg;
  let score = 0;
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  
  btnNew.onclick = () => init();
  btnClearRanking.onclick = () => clearRanking();
  
  function init() {
    indexImg = 1;
    img.src = `images/img1.png`;
    generateGuessSection();
    generateButtons();
  }
  
  function generateGuessSection() {
    contentGuessWord.textContent = "";
    const { word, clue } = getRandomWord();
    const wordWithoutAccent = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    Array.from(wordWithoutAccent).forEach(letter => {
      const span = document.createElement("span");
      span.textContent = "_";
      span.setAttribute("data-letter", letter.toUpperCase());
      contentGuessWord.appendChild(span);
    });
  
    contentClue.textContent = `Dica: ${clue}`;
  }
  
  function generateButtons() {
    contentBtns.textContent = "";
    for (let i = 97; i < 123; i++) {
      const btn = document.createElement("button");
      const letter = String.fromCharCode(i).toUpperCase();
      btn.textContent = letter;
      btn.onclick = () => {
        btn.disabled = true;
        btn.style.backgroundColor = "red"; 
        verifyLetter(letter);
      };
      contentBtns.appendChild(btn);
    }
  }
  
  function verifyLetter(letter) {
    const arr = document.querySelectorAll(`[data-letter="${letter}"]`);
    if (!arr.length) {
      wrongAnswer();
    } else {
      arr.forEach(e => { e.textContent = letter; });
      score += 10;
      updateScore();
    }
  
    const spans = document.querySelectorAll(`.guess-word span`);
    const won = !Array.from(spans).find(span => span.textContent === "_");
  
    if (won) {
      setTimeout(() => {
        alert(`Você Ganhou \u{1F920}`);
        updateRanking(score);
        score = 0;
        updateScore();
        init();
      }, 100);
    }
  }
  
  function wrongAnswer() {
    indexImg++;
    img.src = `images/img${indexImg}.png`;
    if (indexImg === 7) {
      setTimeout(() => {
        alert(`Você Perdeu \u{1F61E}`);
        updateRanking(score);
        score = 0;
        updateScore();
        init();
      }, 100);
    }
  }
  
  function updateScore() {
    scoreElement.textContent = score;
  }
  
  function updateRanking(newScore) {
    ranking.push(newScore);
    ranking.sort((a, b) => b - a);
    ranking = ranking.slice(0, 5);
    localStorage.setItem("ranking", JSON.stringify(ranking));
    displayRanking();
  }
  
  function displayRanking() {
    rankingList.innerHTML = "";
    ranking.forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${score} pontos`;
      rankingList.appendChild(li);
    });
  }
  
  function clearRanking() {
    ranking = [];
    localStorage.removeItem("ranking");
    displayRanking();
  }
  
  displayRanking();
  