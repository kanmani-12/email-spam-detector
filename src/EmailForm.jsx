import { useState } from "react";

function EmailForm({ onAnalyze }) {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze({ sender, subject, message });
  };

  return (
    <form className="card email-form" onSubmit={handleSubmit}>
      <label htmlFor="sender">Sender</label>
      <input
        id="sender"
        type="text"
        placeholder="name@example.com"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />

      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        type="text"
        placeholder="Email subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        placeholder="Paste the email content here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="submit">Analyze</button>
    </form>
  );
}

export default EmailForm;
