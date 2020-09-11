import {
  fetchLeft,
  fetchRight,
  drag,
  saveWord,
  addNewWord,
  addCustomWord,
  generateTiles,
  shuffle,
  downloadToFile,
  fetchRhymes,
} from "./utils";

// helpers

window.onload = async () => {
  localStorage.clear();
  const allWords = await fetchLeft("plant").then(async (wordsArray) => {
    const right = await fetchRight("write");
    const rhymes = await fetchRhymes("tree")
    //sorting algorithm for random shuffle Fisher-Yates Algorithm
    const all = shuffle(wordsArray.concat(right).concat(rhymes));
    return all;
  });

  // create word dom elements
  allWords.forEach((word, idx) => {
    addNewWord(word, idx);
  });
  // format and place dom elements
  generateTiles(allWords);
  const customWordForm = document.getElementById("custom-word-form");
  addCustomWord(customWordForm);
  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const leftWord = document.getElementById("noun-search").value;
    const rightWord = document.getElementById("verb-search").value;
    const rhymeWord = document.getElementById("rhyme-search").value
      await fetchLeft(leftWord)
        .then(async (wordsArray) => {
          const right = await fetchRight(rightWord);
          const rhymes = await fetchRhymes(rhymeWord);
          const all = wordsArray.concat(right).concat(rhymes);
          return all;
        })
        .then((all) => {
          const wordsDiv = document.getElementById("words");
          while (wordsDiv.firstChild) {
            wordsDiv.removeChild(wordsDiv.firstChild);
          }
          all.forEach((word, i) => {
            addNewWord(word, i);
          });
          all = shuffle(all);
          generateTiles(all);
        });
    })
  

  // movement functions

  document.addEventListener("mouseover", (e) => {
    if (e.target.className.split(" ")[0] === "word") {
      drag(e.target.id);
    }
  });

  document.addEventListener("dblclick", (e) => {
    if (e.target.className.split(" ")[0] === "word") {
      saveWord(e.target.id);
    }
  });

  const clearButton = document.getElementById("clear-saved-words");
  const savedArea = document.getElementById("saved-text");
  clearButton.addEventListener("click", (e) => {
    savedArea.innerHTML = "";
  });
  document.getElementById("download-words").addEventListener("click", () => {
    const textArea = document.getElementById("saved-text");
    downloadToFile(textArea.value, "poetree.txt", "text/plain");
  });
};
