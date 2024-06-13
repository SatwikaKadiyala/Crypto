import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import Coinpage from './Pages/Coinpage';
import { makeStyles } from '@material-ui/core';

function App() {

  const useStyles=  makeStyles(()=>({
    App:{
     backgroundColor:"#14161a",
     color:"white",
     height:"100vh",
    }
  }));
  const classes=useStyles()
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" Component={Homepage} exact/>
          <Route path="/coins/:id" Component={Coinpage} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

