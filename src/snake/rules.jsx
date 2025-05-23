import React from 'react';

const Rules = ({gridDimensions, showRules,setShowRules}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -46.5%)',
        backgroundColor: '#121212',
        color: '#fff',
        border: '2px solid #00ff88',
        borderRadius: '16px',
        padding: '1.5rem',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
        zIndex: 999,
        fontSize: '16px',
        lineHeight: '1.6',
        textAlign: 'left',
      }}
    >
        <button
            onClick={() => setShowRules(!showRules)}
            aria-label="Close Rules"
            style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            lineHeight: 1,
            }}
        >
            ✖️
        </button>

        <p style={{ marginTop: '0px', }}>The <strong>SerpentBot</strong> utilizes a <strong>Breadth-First Search (BFS) algorithm</strong> enhanced with the <strong>Manhattan distance heuristic</strong> to efficiently locate the nearest prey without crossing its own body. If no valid moves remain, it will halt to avoid collision.</p>      
        <p style={{ marginTop: '0px', }}>🔴 You can generate prey by <strong>"Clicking"</strong> anywhere in the <strong>"Play Area"</strong> or by using the <strong>"Add 10 Prey"</strong> button.</p> 
        <p>👽 Click <strong>"Serpent Sense"</strong> to let the bot automatically navigate to the closest prey. Even while it's moving, you can add new prey — the bot will dynamically recalculate its path.</p>
        <p>⌨️ For full manual control, click <strong>"Keyboard Control"</strong>. You can use the arrow keys at any time. If <strong>"Serpent Sense"</strong> is active, you can still influence direction mid-path, but full control returns once it stops.</p>
        <p style={{ marginBottom: '0px' }}>🔁 You can switch between <strong>Keyboard Control</strong> and <strong>Serpent Sense</strong> at any time by clicking the corresponding button.   </p>

    </div>
  );
};

export default Rules;
