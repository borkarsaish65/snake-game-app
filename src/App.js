import './App.css';
import {useState,useEffect} from 'react';
let length = 20,breadth = 30;
let timeOutIdForFoodGeneration;
let snakeMovementInterval;

function returnFood(i,j,foodCordinate)
{
        if(i == foodCordinate[0] && j == foodCordinate[1])
        return 'food';
        else return 'notFood';
}
function returnFoodEmoticon(i,j,foodCordinate){
        if(i == foodCordinate[0] && j == foodCordinate[1])
        return <span>&#127813;</span>;
        else return '';
}
function createBoard(length,breadth,headCoordinate)
{       
        let container = [];
        for(let i=0;i<length;i++)
        {       
                let innerArray = []
                for(let j=0;j<breadth;j++)
                {       if(j == headCoordinate.breadth && i == headCoordinate.length)
                        {
                                innerArray.push(<div data-item-column={i} data-item-row={j} className="tile start head"></div>) 
                                continue;  
                        }
                        else if (headCoordinate.snakeTail.some(pos => pos[0] === i && pos[1] === j)) {
                                innerArray.push(<div id={returnFood(i,j,headCoordinate.foodCordinate)} data-item-column={i} data-item-row={j} className="tile start tail">{returnFoodEmoticon(i,j,headCoordinate.foodCordinate)}</div>) 
                                continue;  
                        }

                        innerArray.push(<div id={returnFood(i,j,headCoordinate.foodCordinate)} data-item-column={i} data-item-row={j} className="tile">{returnFoodEmoticon(i,j,headCoordinate.foodCordinate)}</div>)
                }
                container.push(innerArray);
        }
        
        return container;
}


function App() {

  let [headCoordinate,setHeadCoordinate] = useState({
        length:0,
        breadth:4,
        snakeTail:[
                [0,0],
                [0,1],
                [0,2],
                [0,3],

        ],
        foodCordinate:[],
        score:0,
        highScore:0,
        gameOver:false
  })
  let [direction,setDirection] = useState('right');
  let [gameOver,setGameOver] = useState(false);
  function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
  
  const regenerateFoodIfNotEaten = ()=>{

        setHeadCoordinate((oldCoordinate)=>{
                if(oldCoordinate.foodCordinate.length != 0)
                {
                        generateFood(length,breadth);
                }
                return {...oldCoordinate}
        })
  }
  const generateFood = (length,breadth)=>{
        clearTimeout(timeOutIdForFoodGeneration);
        let lengthCoordinate = getRandomNumber(0,length-1);
        let breadthCoordinate = getRandomNumber(0,breadth-1);

        setHeadCoordinate((oldCoordinate)=>{
                
                return {...oldCoordinate,foodCordinate:[lengthCoordinate,breadthCoordinate],foodTimer:Date.now()}
        })

        timeOutIdForFoodGeneration = setTimeout(()=>{
        regenerateFoodIfNotEaten();
        },50000)

  }
  
  function checkIfFoodIsMet(stateContainer){
   
        if(stateContainer.length == stateContainer.foodCordinate[0] && stateContainer.breadth == stateContainer.foodCordinate[1])
        {       
                let foodGeneratedTime = stateContainer.foodTimer;
                let currentTime = Date.now();
                
                let timeDifference = currentTime - foodGeneratedTime;
                
                let percentage = timeDifference * 100 /50000;

                let newScore;
                if(percentage < 5)
                newScore = 10;
                if(percentage > 5 && percentage < 10)
                newScore = 8;
                if(percentage > 10 && percentage < 12)
                newScore = 7;
                if(percentage > 12 && percentage < 15)
                newScore = 6;
                if(percentage > 15 && percentage < 20)
                newScore = 5;
                if(percentage > 20 && percentage < 40)
                newScore = 4;
                if(percentage > 40 && percentage < 60)
                newScore = 3;
                if(percentage > 60 && percentage < 80)
                newScore = 2;
                if(percentage > 80 && percentage <= 100)
                newScore = 1;


                stateContainer = {...stateContainer,snakeTail:[stateContainer.foodCordinate,...stateContainer.snakeTail],foodCordinate:[],score:stateContainer.score+newScore}   
                setTimeout(()=>{
                        generateFood(length,breadth)
                },3000)
        }

        return stateContainer
  }

  const endGameNow = ()=>{
        
        clearInterval(snakeMovementInterval);
        
        setGameOver(true)
        setHeadCoordinate((oldCoordinate)=>{
                let currentScore = oldCoordinate.score;
                console.log(currentScore,'currscore')
                let currentHighScore = oldCoordinate.highScore
                console.log(currentHighScore,'currHighscore')
                let newHighScore = currentHighScore;
                if(currentScore > currentHighScore)
                {
                        newHighScore = currentScore;
                }
                console.log(newHighScore,'newHighScore')
                return {...oldCoordinate,highScore:newHighScore}
        })
  }
  const fecilitateSnakeMovement = (direction)=>
  {     
     setDirection((currentDirection)=>{
        
        
        
        
        switch(currentDirection)
        {       
                case "left":{
                
                         setHeadCoordinate((oldCoordinate)=>{
                                
                                let holder;
                                let newBreadth = oldCoordinate.breadth -1;
                                if(newBreadth < 0)
                                {
                                        endGameNow();
                                        
                                        holder =  {...oldCoordinate,gameOver:true}
                                        
                                }
                                else 
                                {
                                        holder =  {...oldCoordinate,breadth:newBreadth,snakeTail:[...oldCoordinate.snakeTail.slice(1), [oldCoordinate.length, oldCoordinate.breadth]]}
                                        
                                        let filteredArray = holder.snakeTail.filter((array)=>{
                                                if(array[0] == holder.length && array[1] == newBreadth)
                                                {
                                                        return true;
                                                }
                                        })
                                        if(filteredArray.length>0)
                                        endGameNow()
                                      
                                }
           
                                holder = checkIfFoodIsMet(holder)
                                return holder;
                        })


                }
                break;
                case "right":{

                         setHeadCoordinate((oldCoordinate)=>{
                                
                                let holder;
                                let newBreadth = oldCoordinate.breadth +1;
                                if(newBreadth >= breadth)
                                {
                                        endGameNow();
                                        holder =  {...oldCoordinate,gameOver:true}
                                        
                                }
                                else 
                                {
                                        holder =  {...oldCoordinate,breadth:newBreadth,snakeTail:[...oldCoordinate.snakeTail.slice(1), [oldCoordinate.length, oldCoordinate.breadth]]}
                                        
                                        let filteredArray = holder.snakeTail.filter((array)=>{
                                                if(array[0] == holder.length && array[1] == newBreadth)
                                                {
                                                        return true;
                                                }
                                        })
                                        if(filteredArray.length>0)
                                        endGameNow()
                                }

                                holder = checkIfFoodIsMet(holder)
                                return holder;
                        })

                }
                break;
                case "down":{

                setGameOver((old)=>{
                        
                        return old;
                })
                 setHeadCoordinate((oldCoordinate)=>{
                        
                        let holder;
                        let newLength = oldCoordinate.length +1;
                        if(newLength >= length)
                        {
                                endGameNow();
                                holder =  {...oldCoordinate,gameOver:true}
                                
                        }
                        else 
                        {
                                holder =  {...oldCoordinate,length:newLength,snakeTail:[...oldCoordinate.snakeTail.slice(1), [oldCoordinate.length, oldCoordinate.breadth]]}
                                
                                let filteredArray = holder.snakeTail.filter((array)=>{
                                        if(array[0] == newLength && array[1] == holder.breadth)
                                        {
                                                return true;
                                        }
                                })
                                if(filteredArray.length>0)
                                endGameNow()
                        }

                        holder = checkIfFoodIsMet(holder)
                        return holder;
                })



                }
                break;
                case "up":{

                         setHeadCoordinate((oldCoordinate)=>{
                                
                                let holder;
                                let newLength = oldCoordinate.length -1;
                                if(newLength < 0)
                                {
                                        endGameNow();
                                        holder =  {...oldCoordinate,gameOver:true}
                                        
                                }
                                else 
                                {
                                        holder =  {...oldCoordinate,length:newLength,snakeTail:[...oldCoordinate.snakeTail.slice(1), [oldCoordinate.length, oldCoordinate.breadth]]}
                                        
                                        let filteredArray = holder.snakeTail.filter((array)=>{
                                                if(array[0] == newLength && array[1] == holder.breadth)
                                                {
                                                        return true;
                                                }
                                        })
                                        if(filteredArray.length>0)
                                        endGameNow()
                                }

                                holder = checkIfFoodIsMet(holder)
                                return holder;
                        })
                }
                break;
                case "gameover":{
                        clearInterval(snakeMovementInterval);
               }
               break;
                default:{

                }
        }
        return currentDirection;
     })

  }
  
  
  

  useEffect(()=>{
        
        function handleKeyPress(event) {
                
                if (event.key === 'ArrowUp') {
                        
                        setDirection((old)=>{
                                if(old == 'down')
                                return 'down';
                                
                                return 'up'
                        })
                } else if (event.key === 'ArrowDown') {
                        
                        setDirection((old)=>{
                                if(old == 'up')
                                return 'up';

                                return 'down'
                        })
                }
                else if(event.key === 'ArrowRight') {
                        setDirection((old)=>{
                                if(old == 'left')
                                return 'left';

                                return 'right'
                        })  
                }
                else if(event.key === 'ArrowLeft')
                {
                        setDirection((old)=>{
                                if(old == 'right')
                                return 'right';

                                return 'left'
                        })       
                }
              }
          
        document.addEventListener('keydown', handleKeyPress);
        let generateFoodTimeOut
         if(gameOver == false)
         {
                snakeMovementInterval = setInterval(() => {
                        fecilitateSnakeMovement(direction);
                     }, 100);
         
                 generateFoodTimeOut = setTimeout(() => {
                           generateFood(length,breadth);
                     }, 3000);
         }

            
        return () =>{
                document.removeEventListener('keydown', handleKeyPress);
                clearTimeout(generateFoodTimeOut);
                clearInterval(snakeMovementInterval)
            } 

   },[gameOver])

   const playAgain = ()=>{
        
        setHeadCoordinate((oldCoordinate)=>{
              return  {...oldCoordinate,
                        length:0,
                        breadth:4,
                        snakeTail:[
                                [0,0],
                                [0,1],
                                [0,2],
                                [0,3],
                
                        ],
                        foodCordinate:[],
                        score:0,
                        gameOver:false
                  }
        })
        setDirection(old=>'right')
        setGameOver(oldValue=>false)
   }
  return (
    <div className="App">
    <div className='playground-container'>
        <h1>Score:{headCoordinate.score}</h1>
      {createBoard(length,breadth,headCoordinate).map((innerArray, outerIndex) => (
        <div className='outerDiv' key={outerIndex}>
          {innerArray.map((item, innerIndex) => (
            <div key={innerIndex}>{item}</div>
          ))}
    </div>
      ))}
    </div>
    {gameOver ?     <div className='play-again-popup'>
                <div className='score-container'>
                     <h1>Game Over</h1>   
                </div>
                <div className='score-container'>
                        <h2>High Score:{headCoordinate.highScore}</h2>      
                </div>
                <div className='score-container'>
                        <h2>Score:{headCoordinate.score}</h2>      
                </div>
                <div>
                        <div className='btn-container'>
                                <button className='btn play-again-btn' onClick={playAgain}>
                                        Play Again
                                </button>
                        </div>
                </div>
    </div> : ""

    }
    </div>
  );
}

export default App;
