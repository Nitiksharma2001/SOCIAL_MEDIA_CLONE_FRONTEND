import * as React from 'react'
import AddPostModal from './AddPostModal'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { removeUser, setUser } from '../features/UserSlice'
import { useEffect } from 'react'
import { useState } from 'react'

function ResponsiveAppBar() {
  const [isActive, setIsActive] = useState(false)
  const [isHamburgerActive, setIsHamburgerActive] = useState(false)
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
      <nav
        className='navbar'
        role='navigation'
        aria-label='main navigation'
      >
        <div
          className='navbar-brand'
          style={{ marginLeft: '1rem' }}
        >
          <Link to='/' className='navbar-item'>
            Social Media
          </Link>
          <a
            role='button'
            class={`navbar-burger ${isHamburgerActive && 'is-active'}`}
            data-target='navMenu'
            aria-label='menu'
            aria-expanded='false'
            onClick={() => setIsHamburgerActive(!isHamburgerActive)}
          >
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </a>
        </div>

        <div className={`navbar-menu ${isHamburgerActive && 'is-active'}`}>
          {!user && (
            <div className='navbar-end'>
              <div className='navbar-item'>
                <Link to='/signup' className='navbar-item'>
                  Sign up
                </Link>
              </div>
              <div className='navbar-item'>
                <Link to='/signin' className='navbar-item'>
                  Log in
                </Link>
              </div>
            </div>
          )}
          {user && (
            <>
              <div className='navbar-start'>
                <div className='navbar-item'>
                  <a
                    onClick={() => setIsActive(!isActive)}
                    className='navbar-item'
                  >
                    Add Post
                  </a>
                </div>
              </div>
              <div className='navbar-end'>
                <div className='navbar-item'>
                  <a onClick={onLogOut} className='navbar-item'>
                    Log Out
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        
      </nav>
      <AddPostModal isActive={isActive} setIsActive={setIsActive} />
    </>
  )
}
export default ResponsiveAppBar
