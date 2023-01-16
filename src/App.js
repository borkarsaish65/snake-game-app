import './App.css';
import {useState,useEffect} from 'react';
let length = 30,breadth = 20;

function createBoard(length,breadth,selectedTilebreadth,selectedTileLength)
{
        let container = [];
        for(let i=0;i<length;i++)
        {       
                let innerArray = []
                for(let j=0;j<breadth;j++)
                {       if(j == selectedTilebreadth && i ==selectedTileLength)
                        {
                                innerArray.push(<div data-item-column={i} data-item-row={j} className="tile start"></div>) 
                                continue;  
                        }
                        innerArray.push(<div data-item-column={i} data-item-row={j} className="tile"></div>)
                }
                container.push(innerArray);
        }
        
        return container;
}


function App() {

  let [selectedTilebreadth,setSelectedTilebreadth] = useState(0)
  let [selectedTileLength,setSelectedTileLength] = useState(0)
  let [direction,setDirection] = useState('right');
  
  
  
  
  const fecilitateSnakeMovement = (direction)=>
  {
        switch(direction)
        {
                case "left":{
                        
                        setSelectedTilebreadth((currentBreadth)=>{
                                currentBreadth = currentBreadth-1;
                                if(currentBreadth < 0)
                                 return breadth
                                 else 
                                 return currentBreadth;
                         }) 
                }
                break;
                case "right":{
                        setSelectedTilebreadth((currentBreadth)=>{
                                currentBreadth = currentBreadth+1;
                                if(currentBreadth >= breadth)
                                 return 0
                                 else 
                                 return currentBreadth;
                         }) 
                }
                break;
                case "down":{
                                       
                       setSelectedTileLength((currentBreadth)=>{                  
                        currentBreadth = currentBreadth+1;
                        if(currentBreadth >= length)
                         return 0
                         else 
                         return currentBreadth;
                 }) 
                }
                break;
                case "up":{
                        setSelectedTileLength((currentLength)=>{                  
                                currentLength = currentLength-1;
                                if(currentLength < 0)
                                 return length
                                 else 
                                 return currentLength;
                         }) 
                }
                break;
                default:{

                }
        }
  }
  
  
  

  useEffect(()=>{
        function handleKeyPress(event) {
                console.log(direction,event.key,'<==handleKeypress')
                if (event.key === 'ArrowUp') {
                        console.log('up')
                        setDirection((old)=>{
                                return 'up'
                        })
                } else if (event.key === 'ArrowDown') {
                        console.log('down')
                        setDirection((old)=>{
                                console.log(old,'<===')
                                return 'down'
                        })
                }
                else if(event.key === 'ArrowRight') {
                        setDirection((old)=>{
                                console.log(old,'<===')
                                return 'right'
                        })  
                }
                else if(event.key === 'ArrowLeft')
                {
                        setDirection((old)=>{
                                console.log(old,'<===')
                                return 'left'
                        })       
                }
              }
          
        document.addEventListener('keydown', handleKeyPress);
  

        //setTimeout(() => {
          //      console.log(direction,'current direction')
            //    fecilitateSnakeMovement(direction)
        ///}, 1000);

        let id = setInterval(() => {
                fecilitateSnakeMovement(direction);
            }, 500);
            return () =>{
                document.removeEventListener('keydown', handleKeyPress);
                clearInterval(id);
            } 

   },[direction])

   
  return (
    <div className="App">
    <div className='playground-container'>
      {createBoard(length,breadth,selectedTilebreadth,selectedTileLength).map((innerArray, outerIndex) => (
        <div className='outerDiv' key={outerIndex}>
          {innerArray.map((item, innerIndex) => (
            <div key={innerIndex}>{item}</div>
          ))}
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;
