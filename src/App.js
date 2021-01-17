import './logo.svg'
import MainMenu from "./components/MainMenu";
import { BrowserRouter, Route } from 'react-router-dom';
import Test from './components/Test';
import Login from "./components/Login";
import SignUp from './components/SignUp';
import Settings from './components/Settings';
import GlobalState from './components/GlobalState';
import MainSection from "./components/MainSection/MainSection";

function App() {
  return (
        <BrowserRouter>
          <GlobalState >
            <Route exact path="/me">
              <MainMenu/>
              <MainSection/>
            </Route>

            <Route path="/me/edit">
              <MainMenu/>
              <Settings/>
            </Route>

            <Route path="/login" component={Login}/>
            <Route path="/sign-up" component={SignUp}/>

        </GlobalState>

      </BrowserRouter>
  );
}

export default App;
