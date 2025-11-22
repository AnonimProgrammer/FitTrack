import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/test")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Fit Track Client</h1>
      <p>Server says: {message}</p>
    </div>
  );
}

export default App;
