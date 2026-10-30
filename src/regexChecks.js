// Basic email format: something@something.tld
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function validateSender(sender) {
  return EMAIL_REGEX.test(sender.trim());
}

export function checkSubject(subject) {
  const flags = [];

  // ALL CAPS subject (at least 6 letters, no lowercase)
  if (
    /[A-Z]/.test(subject) &&
    !/[a-z]/.test(subject) &&
    subject.replace(/[^A-Za-z]/g, "").length >= 6
  ) {
    flags.push("Subject is written in ALL CAPS");
  }

  // Three or more exclamation marks
  if (/!{3,}/.test(subject)) {
    flags.push("Subject has excessive exclamation marks");
  }

  // Money or urgency words
  if (
    /\b(urgent|act now|winner|congratulations|free|limited time)\b/i.test(
      subject,
    )
  ) {
    flags.push("Subject contains urgency or prize wording");
  }

  return flags;
}

export function checkContent(message) {
  const flags = [];

  // Links
  if (/https?:\/\/\S+/i.test(message)) {
    flags.push("Message contains a link");
  }

  // Shortened URLs
  if (/\b(bit\.ly|tinyurl\.com|goo\.gl|t\.co)\/\S+/i.test(message)) {
    flags.push("Message contains a shortened URL");
  }

  // Money amounts like $1000 or 5,000 USD
  if (/\$\s?\d[\d,]*|\b\d[\d,]*\s?(usd|dollars)\b/i.test(message)) {
    flags.push("Message mentions money amounts");
  }

  // Requests for sensitive info
  if (/\b(password|otp|pin|ssn|credit card|bank account)\b/i.test(message)) {
    flags.push("Message asks for or mentions sensitive information");
  }

  return flags;
}
