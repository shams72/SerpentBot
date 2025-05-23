import React, { useEffect, useState, useRef } from 'react';
import './Snake.css';
import Rules from './rules';


const Snake = () => {
  const playArea = useRef(null);
  const snakeRef = useRef([]);
 
  const applesRef = useRef([]);
  const gridSize = 20; 
  const [_, setRenderTick] = useState(0);
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });
  const [showRules, setShowRules] = useState(false);
  const autoMoveIntervalRef = useRef(null);
  const gridRef = useRef(gridDimensions);


  useEffect(()=>{
   const updateGridDimensions = () => {
      if (playArea.current) {
        const width = playArea.current.clientWidth;
        const height = playArea.current.clientHeight;
        const cols = Math.floor(width / gridSize);
        const rows = Math.floor(height / gridSize);
        setGridDimensions({ cols, rows });
        gridRef.current = {cols,rows};
        const centerX = Math.floor(cols / 2);
        const centerY = Math.floor(rows / 2);

        snakeRef.current = [
          { x: centerX, y: centerY },
          { x: centerX - 1, y: centerY },
          { x: centerX - 2, y: centerY },
        ];
      }
    };

    updateGridDimensions();
    window.addEventListener('resize', updateGridDimensions);
    return () => window.removeEventListener('resize', updateGridDimensions);
  },[])

  const findPathToApple = (start,target,snakeBody) => {
    const { cols, rows } = gridDimensions;
    const grid=[];
  
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = true;
      }
    }

    for (let i = 0; i < snakeBody.length; i++) {
      const segment = snakeBody[i];
      grid[segment.x][segment.y] = false;
    }

    const queue = [{ ...start, path: [] }];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);
    const directions = [ { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
    
    while (queue.length > 0) {
      const current = queue.shift();

      if (current.x === target.x && current.y === target.y) {
        if (current.path.length > 0) {
          return current.path[0];
        } else {
          return null;
        }       
      }

      for (const dir of directions) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny]&& !visited.has(`${nx},${ny}`))  {
          visited.add(`${nx},${ny}`);
          queue.push({x: nx, y: ny, path: [...current.path, dir]});
        }
      }
    }

    return null
  }

  const calculateNextMove =() => {

    if (applesRef.current.length === 0) return null;
    
    const head = snakeRef.current[0];
    const body = snakeRef.current.slice(1);
    const targetApple =  findNearestApple();
    const pathDirection = findPathToApple(head, targetApple[0], body);
    
    if (pathDirection) return pathDirection;

  }

  const toggleAutoPilot = () => {
    if (autoMoveIntervalRef.current) {
      clearInterval(autoMoveIntervalRef.current);
      autoMoveIntervalRef.current = null;
      setRenderTick(t => t + 1);
    } else {
      autoMoveIntervalRef.current = setInterval(() => {
        const direction = calculateNextMove();
        direction ? moveSnake(direction) : setRenderTick(t => t + 1);

      }, 200);
    }
  };

  const moveSnake = (direction) => {

    const snake = snakeRef.current;
    const head = snake[0];
    let ateApple = false;
    const newHead = { x: head.x + direction.x, y: head.y + direction.y};  
    
    applesRef.current = applesRef.current.filter(apple => {
      if (apple.x === newHead.x && apple.y === newHead.y) {
        ateApple = true;
        apple.element.remove();
        return false;
      }
      return true;
    });

    snakeRef.current = [newHead, ...(ateApple ? snake : snake.slice(0, -1))];
    setRenderTick(t => t + 1);

  }

  const findNearestApple = () => {
    const snakeHead = snakeRef.current[0]; 
    const routePoints = applesRef.current
      .slice() 
      .sort((a, b) => {
        const distanceA = Math.abs(a.x - snakeHead.x) + Math.abs(a.y - snakeHead.y);
        const distanceB = Math.abs(b.x - snakeHead.x) + Math.abs(b.y - snakeHead.y);
        return distanceA - distanceB;
      });

    return routePoints; 
  }

  const handleKeyPress = (e) => {

    const snake = snakeRef.current;
    const head = snake[0];
    const direction = getDirection(e.key);
    if(!direction) return;
        
    const newHead = {x: head.x + direction.x , y: head.y + direction.y};
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) return; 

    const { cols, rows } = gridRef.current;
    if ( newHead.x < 0 || newHead.x >= cols ||  newHead.y < 0 || newHead.y >= rows) return;

    let ateApple = false;
    applesRef.current = applesRef.current.filter((apple) => {
      
      const hit = apple.x === newHead.x && apple.y === newHead.y;
        if (hit) {
          ateApple = true;
          apple.element.parentNode.removeChild(apple.element);
          return false; 
        }

        return true;
    });
    
    if (ateApple) {
      snakeRef.current = [newHead, ...snake];
    } else {
      snakeRef.current = [newHead, ...snake.slice(0, -1)];
    }
    setRenderTick((t) => t + 1);
    
  };

  const getDirection = (key) => {
    switch (key) {
      case 'ArrowUp':
        return { x: 0, y: -1 };
      case 'ArrowDown':
        return { x: 0, y: 1 };
      case 'ArrowLeft':
        return { x: -1, y: 0 };
      case 'ArrowRight':
        return { x: 1, y: 0 };
      default:
        return null;
    }
  }

  const createApple = (x,y) => {
    
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = `${y*gridSize}px`;
    div.style.left = `${x*gridSize}px`;
    div.style.width = '20px';
    div.style.height = '20px';
    div.style.borderRadius = '50%';
    div.style.background = 'radial-gradient(circle at 30% 30%, #ff4d4d, #b30000)';
    div.style.boxShadow = '0 0 10px #ff4d4d, inset 0 0 4px #ff9999';
    div.style.border = '1px solid #ffcccc';
    div.style.transition = 'transform 0.2s ease';
    div.style.zIndex = '1';

    playArea.current.appendChild(div);
    applesRef.current.push({ x, y, element: div });

  }

  const handleClick = (e) => {
    const rect = playArea.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left)/20) ;
    const y = Math.floor((e.clientY - rect.top)/20) ;
    if (e.target.tagName === 'BUTTON') return;
    if (snakeRef.current.some(segment => segment.x === x && segment.y === y)) return;
    if (applesRef.current.some(segment => segment.x === x && segment.y === y)) return;
    
    const { cols, rows } =  gridRef.current;
    if ( x < 0 || x >= cols ||  y < 0 || y >= rows) return;

    createApple(x,y);
    setRenderTick((t) => t + 1); 
  };

  const generateMultipleApples = (count = 10) => {
    const { cols, rows } = gridRef.current;
    let generated = 0;

    while (generated < count) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);

      if (applesRef.current.some(apple => apple.x === x && apple.y === y) || snakeRef.current.some(segment => segment.x === x && segment.y === y)) {
        continue;
      }

      createApple(x,y);
      generated++;
    }

    setRenderTick(t => t + 1);
  };

  const preventDefaultScroll = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {

    window.addEventListener("click", handleClick); 
    window.addEventListener('keydown', preventDefaultScroll);
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('wheel', (e) => { e.preventDefault();}, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', preventDefaultScroll);
      window.removeEventListener('keydown', handleKeyPress);
      window.addEventListener('wheel', (e) => { e.preventDefault();}, { passive: false });

    };
  }, []);

  return (
    <>
    <div
      style={{
        position: 'fixed',
        top: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 1000,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {/* 📜 dAh Rulez */}
      <button
        onClick={() => setShowRules(!showRules)}
        style={{
          padding: "14px 30px",
          background: "linear-gradient(145deg, #00ff88, #007bff)",
          border: "none",
          borderRadius: "30px",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          fontFamily: "'Orbitron', sans-serif",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 12px rgba(0, 255, 136, 0.5)",
        }}
        onMouseOver={e => {
          e.currentTarget.style.boxShadow = "0 0 20px #00ffaa";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 255, 136, 0.5)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        📜 dAh Rulez
      </button>

      {/* 🚀 Auto Move */}
      <button
        onClick={toggleAutoPilot}
        style={{
          padding: '14px 30px',
          background: 'linear-gradient(135deg, #00f260, #0575e6)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(0, 255, 150, 0.5), 0 0 10px rgba(0, 120, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 200, 0.8), 0 0 15px rgba(0, 120, 255, 0.6)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 150, 0.5), 0 0 10px rgba(0, 120, 255, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
         {autoMoveIntervalRef.current ?  '⌨️ Keyboard Control' : '👽 Serpent Sense'}
      </button>

      {/* 🔴 Add 10 Prey */}
      <button
        onClick={() => generateMultipleApples(10)}
        style={{
          padding: '14px 30px',
          background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 8px 15px rgba(255, 75, 43, 0.4)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
          e.currentTarget.style.boxShadow = '0 12px 20px rgba(255, 75, 43, 0.6)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
          e.currentTarget.style.boxShadow = '0 8px 15px rgba(255, 75, 43, 0.4)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🔴 Add 10 Prey
      </button>

      <a
        href="https://github.com/shams72/SnakeBot.git"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "14px 30px",
          background: "linear-gradient(145deg, #6f42c1, #8a63d2)",
          color: "#fff",
          borderRadius: "30px",
          fontWeight: "bold",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "16px",
          textDecoration: "none",
          textAlign: "center",
          lineHeight: "22px",
          border: "2px solid #d0b3ff",
          boxShadow: "0 0 12px rgba(208, 179, 255, 0.5)",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseOver={e => {
          e.currentTarget.style.boxShadow = "0 0 20px #d0b3ff";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.boxShadow = "0 0 12px rgba(208, 179, 255, 0.5)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        📦 GitHub Repo
      </a>
    </div>


    <div ref={playArea} className={"play-area"} onClick={handleClick}>   
      <div className="game-area">
        {snakeRef.current.map((segment, index) => (
        <div
          key={index}
          className="snake-body"
          style={{
            left: `${segment.x*20}px`,
            top: `${segment.y*20}px`,
            width: '20px',
            height: '20px',
            position: 'absolute',
            backgroundColor: index === 0 ? '#00f7ff' : '#0aff9d',
            borderRadius: '4px',
            border: '1px solid #111',
            boxShadow: index === 0
              ? '0 0 12px #00f7ff, inset 0 0 4px #00f7ff'
              : '0 0 6px #0aff9d44',
            zIndex: index === 0 ? 2 : 1,
          }}
        >          
        </div>
        ))}
      </div>
    </div>
    <p style={{
      position: "fixed",
      top: "93.5%",
      left: "45%",
      color: "white",
      fontFamily: "sans-serif",
      borderBottomRightRadius: "12px",
      fontSize: "15px", 
      zIndex: 1000
    }}>
      Built with ❤️ using React.js
    </p>
    
    {showRules && <Rules showRules={showRules} setShowRules={setShowRules} />}

    </>
  );
};

export default Snake;