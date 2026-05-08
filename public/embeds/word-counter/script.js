const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const sentenceCount = document.getElementById('sentence-count');
const paraCount = document.getElementById('para-count');
const clearBtn = document.getElementById('clear-btn');

textInput.addEventListener('input', updateStats);

function updateStats() {
  const text = textInput.value;

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;

  wordCount.textContent = words;
  charCount.textContent = chars;
  sentenceCount.textContent = sentences;
  paraCount.textContent = paragraphs;
}

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  updateStats();
});
