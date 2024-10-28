/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import './App.css';
// import About from './Components/About';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
// import About from './Components/About';


function App() {
  const [mode, setMode] = useState('Dark');

  const toggleMode = ()=>{
    if(mode ==='light'){
      setMode = ('dark');
      document.body.style.backgroundColor = 'black';
  }else{
      setMode = ('light');
      document.body.style.backgroundColor = 'white';
  }
}
  return (
    <>
    <Navbar title="TextUtils"  mode={mode}  toggleMode={toggleMode} />
    {/* {<Navbar title="TextUtils" />} */}
    <div className="container my-3"> 
    {<TextForm heading="Enter the text to Analyze below"/>}
    {/* <About /> */}
    </div>
    
    </>
  );
}

export default App;
