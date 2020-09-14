# Poetree
### Overview
Poetree is an interactive words app designed to help a writer shake loose new ideas based on word association. The interface is inspired by magnetic poetry. 

### Features
* Generate random tiles for associated user inputs.
* Drag and drop functionality.
* Create custom tiles.
* Double-click to add words to saved text area.
* Ability to export saved words as .txt document.

### Technologies Used
* JavaScript
* Axios
* Node
* Datamuse API

### Design Decisions
* Instead of hitting the Datamuse API once with the same word to initialize the tree, I decided to create a series of calls that would incorporate an element of randomness by selecting a random word from the first search result and using it for a second search, which then compounded with the first. I utilized the Fisher-Yates Algorithm to achieve a truly random set of new words.
* Rather than use a library, I decided to achieve a drag effect with vanilla JavaScript.
* I wanted to give the user the ability to find words based on association and rhyme, requiring multiple avenues for the user to access.
* I also wanted to replicate the random cut-out aesthetic of magnetic poetry, and so I designed an algorithm to create random degrees with which I transformed the box containers for each word.

### Code Samples
Initialization:
```javascript
export const fetchLeft = (search) => {
  return axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=20`)
    .then((response) => response.data)
    .then((words) => arrayify(words))
    .then(async (wordsArray) => {
      const nextQuery = shuffle(wordsArray)[0];

      const secondQuery = await axios
        .get(`https://api.datamuse.com/words?rel_trg=${nextQuery}&max=20`)
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
  const right = await axios
    .get(`https://api.datamuse.com/words?rel_trg=${search}&max=40`)
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
```

Random tile generation:
```javascript
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
```

### Future Directions
* Customizability of the font, style and color of the words.

[Alt Text](https://github.com/jacobprall/Poetree/blob/master/Sep-13-2020%2017-59-42.gif)
