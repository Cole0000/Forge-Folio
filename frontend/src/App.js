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

  // --- STAT GENERATOR LOGIC ---
  const [statMode, setStatMode] = useState('pointBuy'); 

  const updateStat = (statName, amount) => {
    const currentVal = character.stats[statName];
    if (amount > 0 && character.pointsRemaining > 0 && currentVal < 15) {
      setCharacter({
        ...character,
        stats: { ...character.stats, [statName]: currentVal + 1 },
        pointsRemaining: character.pointsRemaining - 1
      });
    } else if (amount < 0 && currentVal > 8) {
      setCharacter({
        ...character,
        stats: { ...character.stats, [statName]: currentVal - 1 },
        pointsRemaining: character.pointsRemaining + 1
      });
    }
  };

  const rollStats = () => {
    const roll4d6DropLowest = () => {
      let rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      rolls.sort((a, b) => a - b);
      return rolls[1] + rolls[2] + rolls[3];
    };

    setCharacter({
      ...character,
      stats: {
        str: roll4d6DropLowest(),
        dex: roll4d6DropLowest(),
        con: roll4d6DropLowest(),
        int: roll4d6DropLowest(),
        wis: roll4d6DropLowest(),
        cha: roll4d6DropLowest()
      },
      pointsRemaining: 0 
    });
  };

  const resetStats = () => {
    setCharacter({
      ...character,
      stats: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
      pointsRemaining: 27
    });
  };

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


  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // Starting gear
  const [inventory, setInventory] = useState([
    ' Longsword',
    ' Iron Shield',
    ' Explorer\'s Pack',
    ' Rations (5)'
  ]);
  const [newItem, setNewItem] = useState('');

  // Inventory logic
  const addItem = () => {
    if (newItem.trim() !== '') {
      setInventory([...inventory, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (indexToRemove) => {
    setInventory(inventory.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="App">

      {showSplash ? (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#1a1614', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          color: '#fff', textAlign: 'center', padding: '20px'
        }}>
          
          {/* Fantasy Image */}

          <div style={{
            width: '600px', 
            height: 'auto', 
            border: '3px double #8b0000',
            borderRadius: '12px', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center', 
            marginBottom: '30px', 
            backgroundColor: '#0f0c0b',
            boxShadow: '0 0 20px rgba(139, 0, 0, 0.5)',
            overflow: 'hidden' 
          }}>
            <img 
              src="/forge.png" 
              alt="Forge & Folio Realm of Creation" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>

          <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', color: '#ffcc00', textShadow: '2px 2px 4px #000' }}>
            Welcome, Adventurer
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#aaa', fontStyle: 'italic', marginBottom: '40px', maxWidth: '500px' }}>
            The ledger awaits. Step inside the guild hall to forge your destiny.
          </p>
          <button 
            className="btn-action" 
            onClick={() => setShowSplash(false)}
            style={{ padding: '15px 40px', fontSize: '1.3rem', cursor: 'pointer' }}
          >
            Enter the Tavern
          </button>

        </div>
      ) : null}

      <h1>Forge & Folio</h1>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            background: activeTab === 'dashboard' ? '#8b0000' : '#2a2421',
            color: '#fff', border: '1px solid #555', padding: '10px 25px',
            fontSize: '1.1rem', cursor: 'pointer', borderRadius: '4px'
          }}
        >
           Character Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          style={{
            background: activeTab === 'inventory' ? '#8b0000' : '#2a2421',
            color: '#fff', border: '1px solid #555', padding: '10px 25px',
            fontSize: '1.1rem', cursor: 'pointer', borderRadius: '4px'
          }}
        >
           Equipment & Inventory
        </button>
      </div>
      
      {activeTab === 'dashboard' ? (
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
            {Object.keys(character.stats).map((stat) => (
              <div key={stat} className="stat-block" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px', borderBottom: '1px solid #333' }}>
                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{stat}:</span> 
                <span>{character.stats[stat]}</span>
              </div>
            ))}
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


          {/* Stat Generation */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginTop: 0 }}><strong>Determine Your Attributes</strong></p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => { setStatMode('pointBuy'); resetStats(); }} style={{ background: statMode === 'pointBuy' ? '#8b0000' : '#333', color: '#fff', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Point Buy</button>
              <button onClick={() => setStatMode('roll')} style={{ background: statMode === 'roll' ? '#8b0000' : '#333', color: '#fff', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Roll 4d6</button>
            </div>

            {statMode === 'pointBuy' ? (
              <div>
                <p style={{ color: '#4da6ff', margin: '5px 0' }}>Points Remaining: {character.pointsRemaining}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.keys(character.stats).map((stat) => (
                    <div key={stat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '5px', border: '1px solid #555' }}>
                      <span style={{ textTransform: 'uppercase' }}>{stat}</span>
                      <div>
                        <button onClick={() => updateStat(stat, -1)} style={{ background: '#444', color: '#fff', border: 'none', cursor: 'pointer', padding: '2px 8px' }}>-</button>
                        <span style={{ margin: '0 10px' }}>{character.stats[stat]}</span>
                        <button onClick={() => updateStat(stat, 1)} style={{ background: '#444', color: '#fff', border: 'none', cursor: 'pointer', padding: '2px 8px' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Rolls 4d6 and drops the lowest die for each attribute.</p>
                <button className="btn-action" onClick={rollStats}>Cast The Dice</button>
              </div>
            )}
          </div>
          
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

    ) : (
        /* --- INVENTORY TAB INTERFACE --- */
        <div style={{ 
          background: '#1a1614', border: '2px solid #333', borderRadius: '8px', 
          padding: '30px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' 
        }}>
          <h2>Vault & Equipment Log</h2>
          <p style={{ color: '#aaa', fontStyle: 'italic' }}>Manage the gear, relics, and treasures carrying you through the quest.</p>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '30px 0' }}>
            <input 
              className="input-field"
              style={{ marginBottom: '0', width: '60%' }}
              type="text" 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)} 
              placeholder="Forge new equipment ..."
            />
            <button className="btn-action" onClick={addItem}>
              Stash Item
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
            {inventory.length > 0 ? (
              inventory.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    background: '#0f0c0b', border: '1px solid #555', padding: '15px', 
                    borderRadius: '4px', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', fontSize: '1.1rem' 
                  }}
                >
                  <span>{item}</span>
                  <button 
                    onClick={() => removeItem(index)}
                    style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Drop Item"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', color: '#888', padding: '20px' }}>Your packs are completely empty, traveler.</p>
            )}
          </div>
        </div>
      
      )}
    </div>
  );
}

export default App; 