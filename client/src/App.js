import './App.css';
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from "./components/Navbar"
import {BrowserRouter,Routes,Route,useNavigate} from "react-router-dom"
import Home from "./components/screens/Home"
import SignIn from "./components/screens/Login"
import Profile from "./components/screens/Profile"
import SignUp from "./components/screens/Signup"
import CreatePost from "./components/screens/CreatePost"
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribesUserPosts'
export const UserContext = createContext()

const Routing =()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      /*navigate("/")    we remove this because if we have token then is not requrie that we redirect only on "/" we can move /profile and other */
    }else{
      navigate("/login")
    }
  },[])
  return (

<Routes>
        <Route   exact path="/" element={<Home />} />    
        <Route path="/login" element={<SignIn />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/createpost" element={<CreatePost />} />     
        <Route path="/myfollowingpost" element={<SubscribedUserPosts/>} />     
        <Route path="/profile/:userid" element={<UserProfile />} />  
      </Routes>

  )
}


function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing/>     
     </BrowserRouter>
    </UserContext.Provider>
   );
}

export default App;




/* <Route exact path="/" element={<Home />} />    here we use exact path for showing only home page once on "/" */