import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import DashBoard from "./components/DashBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import ProfilePage from "./components/ProfilePage";
import { useEffect, useState } from "react";
import { getwithAuth, getWithoutAuth } from "./utils/Request";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/UserSlice";
import {setPost} from "./features/PostSlice"
import SinglePostPage from "./components/SinglePostPage";
import MessagesPage from "./components/MessagesPage";
function App() {
  const user = useSelector((state) => state.user.value)
  const [notification, setNotification] = useState('')
  const dispatch = useDispatch()
  useEffect(() => {
    if (!user) {
      const loggedInUser = localStorage.getItem('user')
      if (loggedInUser) {
        dispatch(setUser(JSON.parse(loggedInUser)))
      }
    }
    const getPosts = async () => {
      const posts = await getWithoutAuth('post/')
      dispatch(setPost(posts))
    }
    getPosts()
  }, [user])
  return (
    <BrowserRouter>
      <Navbar/>
      {notification && <Notification message={notification}/>}
      <Routes>
        <Route path="/" element={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
              <DashBoard/>
            </div>}>
        </Route>
        <Route path="/profile/:userId" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ProfilePage/> 
          </div>}>
        </Route>
        
        <Route path="/post/:postId" element={ <SinglePostPage/> }/>
        <Route path="/messages" element={ <MessagesPage/> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignUpPage/> }/>
      </Routes>
    </BrowserRouter>
  );
    
}

export default App;
