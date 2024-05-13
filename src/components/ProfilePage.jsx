import { useEffect, useState } from 'react'
import {
  getwithAuth,
  getWithoutAuth,
  postWithoutAuth,
  putWithAuth,
} from '../utils/Request'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/UserSlice'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export default function EditButton() {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const { userId } = useParams()

  const [userDetails, setUserDetails] = useState(null)
  const [followedOrNot, setFollowedOrNot] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const getUserDetailsAndSetFollowButton = async () => {
      const updatedUser = await getwithAuth(`user/${userId}`)
      const result = await getwithAuth(`user/follow/${userId}`, user.token)
      setFollowedOrNot(result.findOrNot)
      setUserDetails(updatedUser)
    }
    getUserDetailsAndSetFollowButton()
  }, [userId])

  const followUnfollowTheUser = async () => {
    setIsLoading(true)
    try{
      await putWithAuth(
        `user/${followedOrNot ? 'unfollow' : 'follow'}/${userId}`,
        user.token
      )
      setUserDetails(prev => {
        return {
          ...prev, 
          user: {
            ...prev.user,
            followers: prev.user.followers + (followedOrNot ? -1 : 1)
          }
        }
      })
      setFollowedOrNot(!followedOrNot)
    } finally{
      setIsLoading(false)
    }
  }
  return (
    <div
      className='card'  
      style={{width: '40rem'}}    
    >
      <div className='card-content is-flex '>
        <div className='card-image'>
          <figure className='image is-96x96'>
            <LazyLoadImage
                src={userDetails && userDetails.user.imageAddress} // use normal <img> attributes as props
                height='100%'
                width='100%'
                effect='opacity'
              />
          </figure>
        </div>
        <div className='is-flex is-flex-direction-column ml-4'>
          <div className='title'>{userDetails && userDetails.user.name}</div>
          {user && user._id !== userId && (
            <button onClick={followUnfollowTheUser} className={`button is-primary ${isLoading && 'is-loading'}`}>
              {followedOrNot ? 'UnFollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <footer className='card-footer'>
        <a className={`card-footer-item`}>
          Followers {userDetails ? userDetails.user.followers : 0}
        </a>
        <a className={`card-footer-item`}>
          Followings {userDetails ? userDetails.user.followings : 0}
        </a>
      </footer>
      <div className='cart-content is-flex is-flex-wrap-wrap is-justify-content-space-evenly my-4'>
        {userDetails &&
          userDetails.posts.map((post) => {
            return <div onMouseOver={console.log(4)} className='is-flex is-flex-direction-column is-align-items-center'>
              <Link to={`/post/${post._id}`}> 
                <LazyLoadImage
                  src={post.imageAddress} // use normal <img> attributes as props
                  height='100%'
                  width='100%'
                  effect='opacity'
                />
              </Link>
              <div className='title'>{post.title}</div>
            </div>  
          })}
          
      </div>
    </div>
  )
}
