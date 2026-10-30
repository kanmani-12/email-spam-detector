# Email Security Analyzer

A small web application that analyzes sample emails for spam and suspicious patterns. It checks the sender address, subject line, and message content, then shows a classification (Safe, Suspicious, or Spam) along with the detected patterns and security alerts.

Built with React and Vite using plain JavaScript (JSX only, no TypeScript).

## Features

- **Regular expressions** validate the sender email format and flag suspicious wording in the subject and message, such as ALL CAPS subjects, excessive exclamation marks, links, shortened URLs, money amounts, and requests for sensitive information.
- **Finite automata (DFA)** scan the message for repeated spam keywords and abnormal character sequences, such as a character repeated five or more times or long runs of uppercase letters.
- **Scoring** combines all findings into a single score that maps to a label:
  - Safe: score 0 to 2
  - Suspicious: score 3 to 5
  - Spam: score 6 or more
- **Results view** displays the classification, the detected patterns, and any security alerts.

## Project Structure

```
email-spam-detector/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # mounts <App /> and imports index.css
    ├── index.css         # global styles and color variables
    ├── App.jsx           # holds state, runs analysis, scoring, layout
    ├── App.css           # component and layout styles
    ├── EmailForm.jsx     # sender, subject, and message inputs
    ├── Results.jsx       # classification, patterns, and alerts
    ├── regexChecks.js    # regex checks for email format and suspicious text
    └── automata.js       # DFA keyword matching and sequence detection
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL that Vite prints, usually `http://localhost:5173`.

### Other scripts

```bash
npm run build     # create a production build in dist/
npm run preview   # preview the production build locally
```

## How It Works

1. The user enters a sender, subject, and message, then clicks **Analyze**.
2. `regexChecks.js` validates the sender and returns flags for the subject and content.
3. `automata.js` builds a DFA for each spam keyword and walks the message one character at a time, counting every time the accepting state is reached. A separate state machine tracks repeated characters and uppercase runs.
4. `App.jsx` adds up the score, assigns a label, and passes the result to `Results.jsx`.

## Sample Inputs

**Spam**

- Sender: `winner@promo`
- Subject: `CONGRATULATIONS!!! YOU WON`
- Message: `FREE cash prize! Click http://bit.ly/abc now!!!!! free free free. Send your password.`

**Suspicious**

- Sender: `support@bank-alerts.com`
- Subject: `Urgent: verify your account`
- Message: `Please verify your account. Click the link https://bank-alerts.com/verify and enter your password.`

**Safe**

- Sender: `hr@company.com`
- Subject: `Meeting notes`
- Message: `Hi team, attaching the notes from today's meeting.`

## Customization

- Add or remove spam keywords in the `SPAM_KEYWORDS` array in `src/automata.js`.
- Add or edit regex rules in `src/regexChecks.js`.
- Change the score thresholds (3 and 6) in `src/App.jsx`.

## Limitations

This is a learning project built around regular expressions and finite automata. It uses simple rules, not machine learning, so it can produce false positives and false negatives and should not be used as a real email security filter.