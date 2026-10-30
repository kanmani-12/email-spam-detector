const SPAM_KEYWORDS = [
  "free",
  "winner",
  "prize",
  "urgent",
  "click",
  "offer",
  "cash",
  "lottery",
];

// Build a DFA (as a transition table) that accepts a single keyword.
// States 0..n, where n is the accepting state. Any mismatch falls back
// to state 0 or 1 (the KMP-style failure rule), so overlaps are handled.
function buildDFA(word) {
  const n = word.length;
  const table = Array.from({ length: n + 1 }, () => ({}));
  const chars = [...new Set(word)];

  for (let state = 0; state <= n; state++) {
    for (const ch of chars) {
      // Longest prefix of `word` that is a suffix of (word[0..state) + ch)
      const text = word.slice(0, state) + ch;
      let next = Math.min(n, text.length);
      while (next > 0 && !text.endsWith(word.slice(0, next))) next--;
      table[state][ch] = next;
    }
  }
  return { table, accept: n };
}

// Run a DFA over the text and count how many times it reaches the accepting state.
function countMatches(text, dfa) {
  let state = 0;
  let count = 0;
  for (const ch of text.toLowerCase()) {
    state = dfa.table[state][ch] ?? 0;
    if (state === dfa.accept) count++;
  }
  return count;
}

const keywordDFAs = SPAM_KEYWORDS.map((word) => ({
  word,
  dfa: buildDFA(word),
}));

export function findSpamKeywords(message) {
  return keywordDFAs
    .map(({ word, dfa }) => ({ word, count: countMatches(message, dfa) }))
    .filter((hit) => hit.count > 0);
}

// Simple state machine that tracks runs of characters to spot abnormal sequences:
//  - the same character repeated 5+ times (e.g. "!!!!!" or "aaaaa")
//  - 5+ consecutive uppercase letters (shouting)
export function findAbnormalSequences(message) {
  const hits = [];
  let prev = "";
  let repeatRun = 0;
  let capsRun = 0;
  let repeatFlagged = false;
  let capsFlagged = false;

  for (const ch of message) {
    // Repeated character state
    if (ch === prev) {
      repeatRun++;
    } else {
      repeatRun = 1;
      repeatFlagged = false;
    }
    if (repeatRun >= 5 && !repeatFlagged && ch.trim() !== "") {
      hits.push(`Repeated character sequence: "${ch}" x5+`);
      repeatFlagged = true;
    }

    // Uppercase run state
    if (/[A-Z]/.test(ch)) {
      capsRun++;
    } else if (/[a-z]/.test(ch)) {
      capsRun = 0;
      capsFlagged = false;
    }
    if (capsRun >= 5 && !capsFlagged) {
      hits.push("Long run of uppercase letters");
      capsFlagged = true;
    }

    prev = ch;
  }

  return hits;
}
