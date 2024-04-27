import PostCard from "./components/PostCard";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import ProfilePage from "./components/ProfilePage";
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
              <PostCard/>
              <PostCard/>
              <PostCard/>
              <PostCard/>
            </div>}>
        </Route>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignUpPage/> }/>
        <Route path="/profile" element={ <ProfilePage/> }/>
      </Routes>
    </BrowserRouter>
  );
    
}

export default App;
