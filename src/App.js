import './logo.svg'
import MainMenu from "./components/MainMenu";
import { BrowserRouter, Route } from 'react-router-dom';
import SearchBar from './components/MainSection';
import Test from './components/Test';
import Login from "./components/Login";
import SignUp from './components/SignUp';
import Settings from './components/Settings';
import GlobalState from './components/GlobalState';

function App() {
  return (
        <BrowserRouter>
          <GlobalState >
            <Route exact path="/">
              <MainMenu/>
              <SearchBar/>
            </Route>

            <Route path="/me/edit">
              <MainMenu/>
              <Settings/>
            </Route>

            <Route path="/test" component={Test} />
            <Route path="/login" component={Login}/>
            <Route path="/sign-up" component={SignUp}/>

        </GlobalState>

      </BrowserRouter>
  );
}

export default App;
