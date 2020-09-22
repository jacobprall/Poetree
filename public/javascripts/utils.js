const axios = require("axios");
const d3 = require("d3-selection");

export const BASIC_WORDS = "the the the s s with as more they be we she he it and any do why ing ed that and and very I I I most have had for not it it who is are is you you you".split(
  " "
);

export const arrayify = (words) => {
  let wordsArray = [];
    words.forEach((wordObj) => {
      wordsArray.push(wordObj.word);
    });
  return wordsArray;
};

export const addNewWord = (word, i) => {
  const wordSpan = document.createElement("span");
  if (i <= 13) {
    wordSpan.className = "word green";
  }
  if (i < 34 && i >= 14) {
    wordSpan.className = "word orange";
  }

  if (i >= 34) {
    wordSpan.className = "word red";
  }
  wordSpan.innerHTML = word;

  wordSpan.id = `word-${i}`;
  wordSpan.style.zIndex = 0;
  if (i <= 13) {
    document.getElementById("word-tier-1").appendChild(wordSpan);
  } else if (i < 34) {
    document.getElementById("word-tier-2").appendChild(wordSpan);
  } else if (i >= 34) {
    document.getElementById("word-tier-3").appendChild(wordSpan);
  }
};

export const fetchLeft = (search) => {
  if (search === "") search = "tree";
  return axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=5`)
    .then((response) => response.data)
    .then((words) => arrayify(words))
    .then(async (wordsArray) => {
      const nextQuery = shuffle(wordsArray)[0];

      const secondQuery = await axios
        .get(`https://api.datamuse.com/words?rel_trg=${nextQuery}&max=5`)
        .then((response) => response.data)
        .then((words) => arrayify(words));
      const allLeft = wordsArray.concat(secondQuery);
      return allLeft.filter((word, i) => allLeft.indexOf(word) === i);
    })
    .then((wordsArray) => {
      return wordsArray.concat(BASIC_WORDS);
    });
};

export const fetchRight = async (search) => {
  if (search === "") return [];
  const right = await axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=7`)
    .then((response) => response.data)
    .then((words) => {
      let wordsArray = [];
      words.forEach((wordObj) => {
        wordsArray.push(wordObj.word);
      });
      return wordsArray;
    });
  return right;
};

export const fetchRhymes = async (search) => {
  if (search === "") search = "tree";
  const result = axios.get(
    `https://api.datamuse.com/words?rel_rhy=${search}&max=7`
  ).then((response) => response.data).then((words) => {
    let wordsArray = [];
    words.forEach(wordObj => {
      wordsArray.push(wordObj.word)
    });
    return wordsArray
  });
  return result;
}

export const generateTiles = (wordsArray) => {
  for (let i = wordsArray.length - 1; i >= 0; i--) {
    const wordRectangle = document.getElementById(`word-${i}`);
    const rectangle = wordRectangle.getBoundingClientRect();
    const degrees = -3 + Math.random() * 6;

    wordRectangle.style.position = "absolute";
    wordRectangle.style.left = rectangle.left + "px";
    wordRectangle.style.top = rectangle.top + "px";
    wordRectangle.style.transform = `rotate(${degrees}deg)`;
  }
};

export const shuffle = (wordArray) => {
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = wordArray[i];
    wordArray[i] = wordArray[j];
    wordArray[j] = temp;
  }
  return wordArray;
};

export const addCustomWord = (customForm) => {
  customForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const customWord = document.getElementById("custom-word-input").value;
    if (customWord.length === 0) {
      displayError(" Enter a Word");
      return;
    }
    const wordsDiv = document.getElementById("words");
    const lastSpanId = wordsDiv.lastElementChild.id;
    const newWordIdx = parseInt(lastSpanId.split("-")[1]) + 2;
    addNewWord(customWord, newWordIdx);
    document.getElementById("custom-word-input").value = "";
    const wordRect = document.getElementById(`word-${newWordIdx}`);
    const degrees = -3 + Math.random() * 6;
    wordRect.style.position = "absolute";
    wordRect.style.left = "50px";
    wordRect.style.top = "210px";
    wordRect.style.zIndex = 2;
    wordRect.style.transform = `rotate(${degrees}deg)`;
  });
};
const displayError = (error) => {
  const alert = dcoument.getElementById("alert");
  const alertText = document.getElementById("alert-text");
  alert.style.display = "block";
  alertText.innerHTML = error;
  const closeButton = document.getElementById("alert-close");
  closeButton.addEventListener("click", (e) => {
    alert.style.display = "none";
  });
};

export const drag = (id) => {
  const word = document.getElementById(id);

  const startMoveAt = (x, y) => {
    word.style.left = x + word.offsetX + "px";
    word.style.top = y + word.offsetY + "px";
  };

  const moveAt = (x, y) => {
    word.style.left = x - 60 + "px";
    word.style.top = (y - 50) + "px";
  };

  const onMouseMove = (e) => {
    moveAt(e.pageX, e.pageY);
    let elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) return;
  };

  const onMouseup = (e) => {
    document.removeEventListener("mousemove", onMouseMove);
    word.style.cursor = "grab";
    word.style.filter = "";
  };

  word.onmousedown = (e) => {
    word.style.position = "absolute";
    word.style.zIndex += 10;
    word.style.cursor = "grabbing";
    word.style.filter = "drop-shadow(3px 3px 3px grey)";
    startMoveAt(e.x, e.y);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseup);
  };
};

export const saveWord = (id) => {
  const savedText = document.getElementById("saved-text");
  savedText.innerHTML += " " + document.getElementById(id).textContent;
};


export const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};


