import * as React from 'react'
import AddPostModal from './AddPostModal'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { removeUser, setUser } from '../features/UserSlice'
import { useEffect } from 'react'

function ResponsiveAppBar() {
  const [isActive, setIsActive] = React.useState(false)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const onLogOut = () => {
    localStorage.removeItem('user')
    dispatch(removeUser())
    navigate('/signin')
  }

  useEffect(() => {
    if (!user) {
      const loggedInUser = localStorage.getItem('user')
      if (loggedInUser) {
        dispatch(setUser(JSON.parse(loggedInUser)))
      }
    }
  }, [user])

  return (
    <>
    <nav class='navbar' role='navigation' aria-label='main navigation'>
      <div class='navbar-brand' style={{ marginLeft: '1rem' }}>
        <Link to='/' class='navbar-item'>
          Social Media
        </Link>
      </div>
      

      <AddPostModal isActive={isActive} setIsActive={setIsActive} />

      <div id='navbarBasicExample' class='navbar-menu'>
          {user && (
            <a
              onClick={() => setIsActive(!isActive)}
              class='navbar-item is-size-5'
            >
              Add Post
            </a>
          )}
        

        {!user && (
          <div class='navbar-end'>
            <div class='navbar-item'>
              <div class='buttons'>
                <Link to='/signup' class='button is-primary'>
                  <strong>Sign up</strong>
                </Link>
                <Link to='/signin' class='button is-light'>
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )}
        {user && (
          <div class='navbar-end'>
            <div class='navbar-item'>
              <div class='buttons'>
                <button onClick={onLogOut} class='button is-danger'>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </nav>
    
    </>
    
  )
}
export default ResponsiveAppBar
