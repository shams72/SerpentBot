import React from 'react';

const Rules = ({showRules,setShowRules}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '39%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
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

        <p>
            🐍 <strong>SnakeBot</strong> uses the Breadth-First Search (BFS) algorithm to locate the nearest apple without crossing its own body.
            <br /><br />
            🍎 You can generate apples by <strong>"Clicking"</strong> anywhere in the play area or by using the <strong>"Add 10 Apples"</strong> button.
            <br /><br />
            🤖 Activate <strong>"Serpent Sense"</strong> to let the bot automatically navigate to the closest apple. Even while it's moving, you can add new apples — the bot will dynamically recalculate its path.
            <br /><br />
            🕹️ For full manual control, click <strong>"Player Control"</strong>. You can use the arrow keys at any time. If Serpent Sense is active, you can still influence direction mid-path, but full control returns once it stops.
            <br /><br />
            🔁 You can switch between <strong>Player Control</strong> and <strong>Serpent Sense</strong> at any time by clicking the toggle button.
        </p>

    </div>
  );
};

export default Rules;
