function Results({ result }) {
  const { label, patterns, alerts } = result;

  const labelText = {
    safe: "Safe",
    suspicious: "Suspicious",
    spam: "Spam",
  };

  return (
    <div className="card results">
      <span className={`label ${label}`}>{labelText[label]}</span>

      <h3>Detected Patterns</h3>
      {patterns.length === 0 ? (
        <p className="empty">No suspicious patterns found.</p>
      ) : (
        <ul>
          {patterns.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}

      <h3>Security Alerts</h3>
      {alerts.length === 0 ? (
        <p className="empty">No security alerts.</p>
      ) : (
        <ul>
          {alerts.map((a, i) => (
            <li key={i} className="alert">
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Results;
