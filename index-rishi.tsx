
import React, { useState } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const sendPrompt = async () => {
    if (!userInput) {
      setErrorMessage("⚠️ Please enter a prompt before submitting.");
      return;
    }

    setLoading(true);
    setApiResponse(null);
    setErrorMessage("");

    try {
      const response = await fetch("https://rishy-py.onrender.com/chat-openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setErrorMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (apiResponse) {
      navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
      alert("Response copied to clipboard!");
    }
  };

  const styles = {
    body: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: darkMode
        ? "#121212"
        : "linear-gradient(135deg, #ece9e6, #ffffff)",
      margin: 0,
      padding: "50px",
      color: darkMode ? "#e0e0e0" : "#333",
      minHeight: "100vh",
      transition: "0.3s",
    },
    chatContainer: {
      maxWidth: "700px",
      margin: "auto",
      background: darkMode ? "#1e1e1e" : "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: darkMode
        ? "0 6px 20px rgba(0,0,0,0.6)"
        : "0 6px 20px rgba(0,0,0,0.15)",
      position: "relative",
    },
    heading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "28px",
      marginBottom: "20px",
      color: darkMode ? "#ffffff" : "#222",
    },
    input: {
      width: "100%",
      padding: "14px",
      margin: "12px 0",
      border: darkMode ? "2px solid #3a3a3a" : "2px solid #0078d7",
      borderRadius: "8px",
      fontSize: "16px",
      background: darkMode ? "#2a2a2a" : "#fff",
      color: darkMode ? "#e0e0e0" : "#333",
      outline: "none",
      transition: "0.3s",
    },
    button: {
      background: darkMode
        ? "linear-gradient(135deg, #00bfff, #0078d7)"
        : "linear-gradient(135deg, #0078d7, #005a9e)",
      color: "#fff",
      border: "none",
      padding: "14px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "transform 0.2s ease, background 0.3s ease",
      display: "block",
      margin: "10px auto",
    },
    responseBox: {
      marginTop: "25px",
      padding: "20px",
      background: darkMode ? "#2a2a2a" : "#f9fafc",
      border: darkMode ? "1px solid #3a3a3a" : "1px solid #ddd",
      borderRadius: "8px",
      fontFamily: "Consolas, monospace",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      fontSize: "15px",
      color: darkMode ? "#b0e0e6" : "#333",
    },
    loading: {
      textAlign: "center",
      color: darkMode ? "#00bfff" : "#0078d7",
      marginTop: "15px",
      fontStyle: "italic",
      fontWeight: "bold",
    },
    error: {
      textAlign: "center",
      color: "#ff4c4c",
      marginTop: "15px",
      fontWeight: "bold",
    },
    toggle: {
      position: "absolute",
      top: "20px",
      right: "20px",
      cursor: "pointer",
      fontWeight: "bold",
      color: darkMode ? "#00bfff" : "#0078d7",
    },
    copyButton: {
      background: darkMode
        ? "linear-gradient(135deg, #444, #666)"
        : "linear-gradient(135deg, #ddd, #bbb)",
      color: darkMode ? "#fff" : "#333",
      border: "none",
      padding: "10px 18px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.chatContainer}>
        <div style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </div>
        <h2 style={styles.heading}>⚡ Chat with API ⚡</h2>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your prompt here..."
          style={styles.input}
        />
        <button onClick={sendPrompt} style={styles.button}>
          Submit
        </button>

        {loading && <div style={styles.loading}>Fetching response...</div>}
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        {apiResponse && (
          <div>
            <div style={styles.responseBox}>
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
            <button onClick={copyToClipboard} style={styles.copyButton}>
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
