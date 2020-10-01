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
  searchFormCallback, shake
} from "./utils";

// helpers

window.onload = async () => {
  localStorage.clear();
  const allWords = await fetchLeft("autumn").then(async (wordsArray) => {
    const right = await fetchRight("write");
    const rhymes = await fetchRhymes("log");
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
    searchFormCallback(e);
  });

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

  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", async (e) => {
    shake();
    searchFormCallback(e);
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
