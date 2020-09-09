const axios = require("axios");

export const BASIC_WORDS = "the the the s s with as more they be we she he it and any do why ing ed that and and very I I I most have had for not it it who is are is you you you".split(
  " "
);

export const arrayify = (words) => {
  let wordsArray = [];
  while (wordsArray.length <= 20) {
    words.forEach((wordObj) => {
      wordsArray.push(wordObj.word);
    });
  }
  return wordsArray;
};

export const addNewWord = (word, i) => {
  const wordSpan = document.createElement("span");
  if (i < 50) {
    wordSpan.className = "word green";
  }
  if (i < 70 && i >= 50) {
    wordSpan.className = "word red";
  }

  if (i > 70) {
    wordSpan.className = "word orange";
  }
  wordSpan.innerHTML = word;

  wordSpan.id = `word-${i}`;
  wordSpan.style.zIndex = 0;
  // if (localStorage.getItem("fontSize")) {
  //   wordSpan.style.fontSize = localStorage.getItem("fontSize");
  // }
  // if (localStorage.getItem("fontFamily")) {
  //   wordSpan.style.fontFamily = localStorage.getItem("fontFamily");
  // }
  // if (localStorage.getItem("color")) {
  //   wordSpan.style.color = localStorage.getItem("color");
  // }
  // if (localStorage.getItem("background-color")) {
  //   wordSpan.style.backgroundColor = localStorage.getItem("background-color");
  // }
  console.log(wordSpan);
  document.getElementById("words").appendChild(wordSpan);
};

export const fetchLeft = (search) => {
  return axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=20`)
    .then((response) => response.data)
    .then((words) => arrayify(words))
    .then(async (wordsArray) => {
      const nextQuery = wordsArray[Math.floor(20 * Math.random())];
      console.log(nextQuery);
      const secondQuery = await axios
        .get(`https://api.datamuse.com/words?rel_trg=${nextQuery}&max=20`)
        .then((response) => response.data)
        .then((words) => arrayify(words));
      const allLeft = wordsArray.concat(secondQuery);
      //filter results to remove duplicates
      return allLeft.filter((word, i) => allLeft.indexOf(word) === i);
    })
    .then((wordsArray) => {
      return wordsArray.concat(BASIC_WORDS);
    });
};

export const fetchRight = async (search) => {
  const right = await axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=20`)
    .then((response) => response.data)
    .then((words) => {
      let wordsArray = [];
      while (wordsArray.length <= 20) {
        words.forEach((wordObj) => {
          wordsArray.push(wordObj.word);
        });
      }
      return wordsArray;
    });
  return right;
};

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
