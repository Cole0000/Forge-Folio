import React, { useState } from 'react';
import './App.css';

function App() {
  // pulling the saved name from local storage so it survives page refreshes! if it's empty, default to unknown.
  const [character, setCharacter] = useState(() => {
    const savedName = localStorage.getItem('playerName');
    return {
      name: savedName || "Unknown Adventurer",
      level: 1,
      hp: 100,
      mana: 50,
      stats: { strength: 14, intelligence: 18, dexterity: 12 }
    };
  });

  // state for the name input box
  const [inputName, setInputName] = useState('');

  const saveName = () => {
    // updates the UI right now
    setCharacter({ ...character, name: inputName });
    // saves it to the browser memory so it doesn't get wiped on refresh
    localStorage.setItem('playerName', inputName);
    setInputName(''); // clears the box after signing
  };

  // the class roller state. user types in what they like, we spit out a classic D&D class.
  const [playstyle, setPlaystyle] = useState('');
  const [recommendation, setRecommendation] = useState('Novice Adventurer');

  const rollClass = () => {
    // checking basic keywords to assign a normal class name.
    const input = playstyle.toLowerCase();
    
    if (input.includes('logic') || input.includes('chaos') || input.includes('smart') || input.includes('magic') || input.includes('wizard') || input.includes('mage') || input.includes('sorcerer') || input.includes('spell')) {
      setRecommendation('Wizard');
    } else if (input.includes('smash') || input.includes('strong') || input.includes('front') || input.includes('tank') || input.includes('melee') || input.includes('warrior')) {
      setRecommendation('Barbarian');
    } else if (input.includes('sneak') || input.includes('stealth') || input.includes('rogue') || input.includes('rouge') || input.includes('thief') || input.includes('assassin')) {
      setRecommendation('Rogue');
    } else if (input.includes('shoot') || input.includes('bow') || input.includes('range') || input.includes('archer') || input.includes('ranged')) {
      setRecommendation('Ranger');
    } else if (input.includes('heal') || input.includes('support') || input.includes('cleric') || input.includes('priest') || input.includes('paladin')) {
      setRecommendation('Cleric');
    } else if (input.includes('summon') || input.includes('beast') || input.includes('animal') || input.includes('druid')) {
      setRecommendation('Druid');
    } else if (input.includes('fighter') || input.includes('combat') || input.includes('martial') || input.includes('duelist')) {
      setRecommendation('Fighter');
    } else if (input.includes('monk') || input.includes('ki') || input.includes('martial arts') || input.includes('meditation')) {
      setRecommendation('Monk');
    } else if (input.includes('warlock') || input.includes('pact') || input.includes('dark magic') || input.includes('cursed')) {
      setRecommendation('Warlock');
    } else if (input.includes('paladin') || input.includes('holy') || input.includes('divine') || input.includes('oath')) {
      setRecommendation('Paladin');
    } else if (input.includes('bard') || input.includes('music') || input.includes('song') || input.includes('performance')) {
      setRecommendation('Bard');
    } else if (input.includes('sorcerer') || input.includes('innate magic') || input.includes('bloodline') || input.includes('wild magic')) {
      setRecommendation('Sorcerer');
    } else if (input.includes('artificer') || input.includes('invention') || input.includes('gadgetry') || input.includes('mechanical')) {
      setRecommendation('Artificer');
    } else if (input.includes('echo') || input.includes('time') || input.includes('duplicate') || input.includes('shadow')) {
      setRecommendation('Echo Knight');
    } else { 
      // default recommendation if no keywords match
      setRecommendation('Novice Adventurer');
    } 
  };

  const [quests, setQuests] = useState([]);
  const [newQuest, setNewQuest] = useState('');
  
  const addQuest = () => {
    if (newQuest.trim() !== '') {
      setQuests([...quests, newQuest]);
      setNewQuest('');
    }
  };

  return (
    <div className="App">
      <h1>Forge & Folio</h1>
      
      <div className="dashboard"> 
        
        {/* left side: my actual character sheet */}
        <div className="left-column">
          <h2>Character Sheet</h2>
          <h3>{character.name}</h3>
          <h4 style={{ color: '#a0a0a0', fontStyle: 'italic' }}>
            Level {character.level} {recommendation}
          </h4>
          
          <div style={{ margin: '25px 0', fontSize: '1.2rem' }}>
            <div style={{ color: '#ff4d4d', fontWeight: 'bold', marginBottom: '10px' }}>HP: {character.hp} / 100</div>
            <div style={{ color: '#4da6ff', fontWeight: 'bold' }}>Mana: {character.mana} / 50</div>
          </div>

          <div className="stats-container">
            <div className="stat-block"><span>Strength:</span> <span>{character.stats.strength}</span></div>
            <div className="stat-block"><span>Intelligence:</span> <span>{character.stats.intelligence}</span></div>
            <div className="stat-block"><span>Dexterity:</span> <span>{character.stats.dexterity}</span></div>
          </div>
        </div>

        {/* right side: the tavern. getting user input and rolling classes */}
        <div className="right-column">
          <h2>The Tavern</h2>
          
          {/* Character Creation / Name Save */}
          <p>Sign the ledger to begin your journey:</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <input 
              className="input-field"
              style={{ marginBottom: '0', width: '50%' }}
              type="text" 
              value={inputName} 
              onChange={(e) => setInputName(e.target.value)} 
              placeholder="Enter your name..."
            />
            <button className="btn-action" onClick={saveName}>
              Sign
            </button>
          </div>

          <hr style={{ borderColor: '#444', borderStyle: 'dashed', margin: '20px 0' }} />

          {/* Class Roller */}
          <p>Describe your dev playstyle to roll your class:</p>
          <input 
            className="input-field"
            type="text" 
            value={playstyle} 
            onChange={(e) => setPlaystyle(e.target.value)} 
            placeholder='e.g. "I like to smash things..."'
          />
          <br />
          <button className="btn-action" onClick={rollClass}>
            Roll Your Class
          </button>
          
          <hr style={{ borderColor: '#444', borderStyle: 'dashed', margin: '20px 0' }} />

          {/* The Quest Log (To-Do List) */}
          <h2>Active Quests</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <input 
              className="input-field"
              style={{ marginBottom: '0', width: '50%' }}
              type="text" 
              value={newQuest} 
              onChange={(e) => setNewQuest(e.target.value)} 
              placeholder="Add a new task..."
            />
            <button className="btn-action" onClick={addQuest}>
              Accept Quest
            </button>
          </div>

          {/* Mapping out the array of quests into a bullet list */}
          <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left', width: '80%', margin: '0 auto' }}>
            {quests.map((quest, index) => (
              <li key={index} style={{ background: '#1f1b18', margin: '10px 0', padding: '15px', border: '1px solid #555', borderRadius: '4px', fontSize: '1.2rem' }}>
                ⚔️ {quest}
              </li>
            ))}
          </ul>
          
        </div>

      </div>
    </div>
  );
}

export default App;