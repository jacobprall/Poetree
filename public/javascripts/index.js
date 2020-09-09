import { fetchLeft, fetchRight, arrayify, addNewWord, generateTiles, shuffle } from "./utils";
// helpers

window.onload = async () => {
  localStorage.clear();
  const allWords = await fetchLeft("tree").then(async (wordsArray) => {
    const right = await fetchRight("write");
    //sorting algorithm for random shuffle Fisher-Yates Algorithm
    const all = shuffle(wordsArray.concat(right));
    return all;
  });


  // create word dom elements
  allWords.forEach((word, idx) => {
    addNewWord(word, idx)
  });
  // format and place dom elements
  generateTiles(allWords)

  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const leftWord = document.getElementById("noun-search");
    const rightWord = document.getElementById("verb-search");
    if (!leftWord || !rightWord) {
      displayError("Please enter a word");
      return;
    } else {

      await fetchLeft(leftWord)
        .then(async (wordsArray) => {
          const right = await fetchRight(rightWord);
          const all = wordsArray.concat(right);
          return all;
        })
        .then((all) => {
          const wordsDiv = document.getElementById("words");
          while (wordsDiv.firstChild) {
           wordsDiv.removeChild(wordsDiv.firstChild);
          }
          all.forEach((word, i) => { addNewWord(word, i) });
          generateTiles(all);
        }
      )}
  }
)}

