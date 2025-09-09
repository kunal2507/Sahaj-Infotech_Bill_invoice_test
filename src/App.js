import React from "react";
import Invoice from "./components/Invoice";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Invoice Generator</h1>
        <p>Professional Billing System</p>
      </header>
      <main className="App-main">
        <Invoice />
      </main>
    </div>
  );
}

export default App;
