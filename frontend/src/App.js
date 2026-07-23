import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // pulling the saved name from local storage so it survives page refreshes! if it's empty, default to unknown.
  const [character, setCharacter] = useState(() => {
    const savedName = localStorage.getItem('playerName');
    return {
      name: savedName || "Unknown Adventurer",
      race: "Human",
      avatar: "",
      level: 1,
      hp: 100,
      spellslots: 4,
      stats: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }, 
      pointsRemaining: 27
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

  // NEW: Image Upload Logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacter({ ...character, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- REAL D&D DATA FETCHING ---
  const [apiRaces, setApiRaces] = useState([]);
  const [apiClassDetails, setApiClassDetails] = useState(null);

   //D&D5e API has a list of races, we fetch it
  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/races')
      .then(response => response.json()) // Converts the server response to readable data
      .then(data => setApiRaces(data.results)) // Saves the list of races to our app
      .catch(error => console.error("Error fetching D&D races:", error));
  }, []); 

  // the class roller state. user types in what they like, we spit out a classic D&D class.
  const [playstyle, setPlaystyle] = useState('');
  const [recommendation, setRecommendation] = useState('Novice Adventurer');

  const rollClass = () => {
    // checking basic keywords to assign a normal class name.
    const input = playstyle.toLowerCase();
    

    let newRecommendation = 'Novice Adventurer';


    if (input.includes('logic') || input.includes('chaos') || input.includes('smart') || input.includes('magic') || input.includes('wizard') || input.includes('mage') || input.includes('sorcerer') || input.includes('spell')) {
      newRecommendation = 'Wizard';
    } else if (input.includes('smash') || input.includes('strong') || input.includes('front') || input.includes('tank') || input.includes('melee') || input.includes('warrior')) {
      newRecommendation = 'Barbarian';
    } else if (input.includes('sneak') || input.includes('stealth') || input.includes('rogue') || input.includes('rouge') || input.includes('thief') || input.includes('assassin')) {
      newRecommendation = 'Rogue';
    } else if (input.includes('shoot') || input.includes('bow') || input.includes('range') || input.includes('archer') || input.includes('ranged')) {
      newRecommendation = 'Ranger';
    } else if (input.includes('heal') || input.includes('support') || input.includes('cleric') || input.includes('priest') || input.includes('paladin')) {
      newRecommendation = 'Cleric';
    } else if (input.includes('summon') || input.includes('beast') || input.includes('animal') || input.includes('druid')) {
      newRecommendation = 'Druid';
    } else if (input.includes('fighter') || input.includes('combat') || input.includes('martial') || input.includes('duelist')) {
      newRecommendation = 'Fighter';
    } else if (input.includes('monk') || input.includes('ki') || input.includes('martial arts') || input.includes('meditation')) {
      newRecommendation = 'Monk';
    } else if (input.includes('warlock') || input.includes('pact') || input.includes('dark magic') || input.includes('cursed')) {
      newRecommendation = 'Warlock';
    } else if (input.includes('paladin') || input.includes('holy') || input.includes('divine') || input.includes('oath')) {
      newRecommendation = 'Paladin';
    } else if (input.includes('bard') || input.includes('music') || input.includes('song') || input.includes('performance')) {
      newRecommendation = 'Bard'  ;
    } else if (input.includes('sorcerer') || input.includes('innate magic') || input.includes('bloodline') || input.includes('wild magic')) {
      newRecommendation = 'Sorcerer';
    } else if (input.includes('artificer') || input.includes('invention') || input.includes('gadgetry') || input.includes('mechanical')) {
      newRecommendation = 'Artificer';
    } else if (input.includes('echo') || input.includes('time') || input.includes('duplicate') || input.includes('shadow')) {
      newRecommendation = 'Echo Knight';
    }  
      // default recommendation if no keywords match
      setRecommendation(newRecommendation);

      // 2. The API Safety Net
    // This is the list of classes the official D&D API actually has data for
    const validAPIClasses = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
    const searchParam = newRecommendation.toLowerCase();

    if (validAPIClasses.includes(searchParam)) {
      // If it's a core class, go grab the data!
      fetch(`https://www.dnd5eapi.co/api/classes/${searchParam}`)
        .then(response => response.json())
        .then(data => setApiClassDetails(data))
        .catch(error => console.error("Error fetching class details:", error));
    } else {
     
      setApiClassDetails(null);
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

  const completeQuest = (indexToRemove) => {
    setQuests(quests.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="App">
      <h1>Forge & Folio</h1>
      
      <div className="dashboard"> 
     
        {/* left side: my actual character sheet */}
        <div className="left-column">
          <h2>Character Sheet</h2>

          {/* Portrait Display */}
          <div style={{ width: '150px', height: '150px', margin: '0 auto 15px', border: '2px solid #555', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1a1614' }}>
            {character.avatar ? (
              <img src={character.avatar} alt="Character Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ padding: '50px 0', color: '#888', fontSize: '0.9rem' }}>No Portrait</div>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: '#aaa', width: '180px' }} />
          </div>
          <h3>{character.name}</h3>
          <h4 style={{ color: '#a0a0a0', fontStyle: 'italic' }}>
            Level {character.level}, {character.race} {recommendation}
          </h4>
          

          {/* Displays the real Hit Die */}
          {apiClassDetails && (
            <p style={{ color: '#ff4d4d', fontSize: '0.9rem', marginTop: '-10px', fontStyle: 'italic' }}>
              Official Hit Die: d{apiClassDetails.hit_die}
            </p>
          )}


          {/* Editable HP and Spell Slots */}
          <div style={{ margin: '25px 0', display: 'flex', flexDirection: 'column',gap: '15px', fontSize: '1.2rem' }}>
            <div>
              <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>HP: </span>
            <input 
                type="number" 
                min="0"
                max="100"
                value={character.hp} 
                onChange={(e) => {
                  let val = e.target.value;
                  if (val > 100) val = 100; // cap at 100 (will implment different for each class later)
                  if (val < 0) val = 0;     // Prevents negative HP
                  setCharacter({...character, hp: val});
                }}
                style={{ width: '60px', background: '#2a2421', color: '#fff', border: '1px solid #555', textAlign: 'center', fontSize: '1.1rem' }} 
              />
              <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}> / 100</span>
            </div>
            <div>
              <span style={{ color: '#4da6ff', fontWeight: 'bold' }}>Spell Slots: </span>
             <input 
                type="number" 
                min="0"
                max="4"
                value={character.spellSlots} 
                onChange={(e) => {
                  let val = e.target.value;
                  if (val > 4) val = 4; //  cap at 4 (will implement different for each class later)
                  if (val < 0) val = 0; // Prevents negative slots
                  setCharacter({...character, spellSlots: val});
                }}
                style={{ width: '60px', background: '#2a2421', color: '#fff', border: '1px solid #555', textAlign: 'center', fontSize: '1.1rem' }} 
              />
              <span style={{ color: '#4da6ff', fontWeight: 'bold' }}> / 4</span>
            </div>
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

{/* Race Selector Using Real API Data */}
          <p>Choose your race:</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <select 
              value={character.race} 
              onChange={(e) => setCharacter({...character, race: e.target.value})}
              className="input-field"
              style={{ width: '50%', cursor: 'pointer', padding: '10px', background: '#1a1614', color: '#fff' }}
            >
              {/* If the API is still loading, show a loading message. Otherwise, map out the races! */}
              {apiRaces.length > 0 ? (
                apiRaces.map((race) => (
                  <option key={race.index} value={race.name}>{race.name}</option>
                ))
              ) : (
                <option>Consulting the archives...</option>
              )}
            </select>
          </div>

          <hr style={{ borderColor: '#444', borderStyle: 'dashed', margin: '20px 0' }} />

          {/* Class Roller */}
          <p>Describe your desired playstyle to roll your class:</p>
          <input 
            className="input-field"
            type="text" 
            value={playstyle} 
            onChange={(e) => setPlaystyle(e.target.value)} 
            placeholder=' e.g."I like to smash things..."'
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
              <li key={index} style={{ background: '#1f1b18', margin: '10px 0', padding: '15px', border: '1px solid #555', borderRadius: '4px', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>⚔️ {quest}</span>
                <button 
                  onClick={() => completeQuest(index)} 
                  style={{ background: '#8b0000', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Clear
                </button>
              </li>
            ))}
          </ul>
          
        </div>

      </div>
    </div>
  );
}

export default App;