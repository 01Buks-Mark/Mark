import { useState } from 'react';

const Ms = () => {
  const [counter,setCounter] = useState(0);
 
  return (
    <div>
    <button onClick={() => setCounter((prev) => prev - 1 )}>-</button>
    <h1>{counter}</h1>
    <button onClick= {() => setCounter((prev) => prev + 1 )} >+ </button>
</div>
    );
}
 

const App = () => {
  
    <div className="App">
<h1>Hello, Uganda</h1>

    <Ms />
      </div>
  );
}

export default App;
