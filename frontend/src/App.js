import React, { useState } from 'react';
import './App.css';

function App() {
  const [playstyle, setPlaystyle] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const getRecommendation = async () => {
    try {
      
      const response = await fetch(`http://localhost:8000/api/recommend?playstyle=${playstyle}`);
      const data = await response.json();
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecommendation("Backend server not running!");
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#282c34', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <h1>Forge Folio: R&D Prototype</h1>
        <p>Describe your playstyle to get a class recommendation:</p>
        
        <input 
          type="text" 
          value={playstyle} 
          onChange={(e) => setPlaystyle(e.target.value)} 
          placeholder=' "I like to smash things..."'
          style={{ padding: '10px', width: '300px', fontSize: '16px', borderRadius: '5px', border: 'none' }}
        />
        
        <button 
          onClick={getRecommendation}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#61dafb', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
        >
          Analyze Playstyle
        </button>

        {recommendation && (
          <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #61dafb', borderRadius: '10px' }}>
            <h2>Recommended Class: <span style={{ color: '#61dafb' }}>{recommendation}</span></h2>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;