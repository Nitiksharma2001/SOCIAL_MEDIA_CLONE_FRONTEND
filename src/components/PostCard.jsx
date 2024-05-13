import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/UserSlice'
import {
  getwithAuth,
  getWithoutAuth,
  postwithAuth,
  putWithAuth,
} from '../utils/Request'
import moment from 'moment'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import { CircularProgress } from '@mui/material'

export default function PostCard(props) {
  const {
    _id,
    title,
    description,
    imageUrl,
    noOfLikes,
    createdAt,
    imageAddress,
   
  } = props.post
  const titleClickable = props.titleClickable === false ? false : true
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isLikedPost, setIsLikedPost] = useState(false)
  const [totalLikesOnPost, setTotalLikesOnPost] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addComment = async () => {
    if (!user) {
      return navigate('/signin')
    }
    const result = await postwithAuth(`comment/${_id}`, user.token, {
      commentValue: comment,
    })
    setComment('')
    setComments((prev) => [...prev, result.comment])
  }
  useEffect(() => {
    if (!user) {
      const loggedInUser = localStorage.getItem('user')
      if (loggedInUser) {
        dispatch(setUser(JSON.parse(loggedInUser)))
      }
    }
  }, [user])

  useEffect(() => {
    const checkLikedorNotAndCountLikes = async () => {
      const postLikedOrNot = await getwithAuth(`post/liked/${_id}`, user.token)
      const likeCount = await getwithAuth(`post/like/${_id}`, user.token)
      setTotalLikesOnPost(likeCount.post)
      setIsLikedPost(postLikedOrNot.message)
    }
    if (user) {
      checkLikedorNotAndCountLikes()
    }
  }, [])

  const likeOrDisLikeAPost = async () => {
    if (!user) {
      return navigate('/signin')
    }
    setTotalLikesOnPost((prev) => (isLikedPost ? prev - 1 : prev + 1))
    setIsLikedPost(!isLikedPost)
    await putWithAuth(
      `post/${isLikedPost ? 'dislike' : 'like'}/${_id}`,
      user.token
    )
  }
  const getAllComentsOfPost = async () => {
    setIsLoading(true)
    try {
      const result = await getWithoutAuth(`comment/${_id}`)
      setComments(result)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='card' style={{ maxWidth: '25rem' }}>
      <Link
        to={`/post/${_id}`}
        className={`title is-2 ${
          titleClickable && 'is-underlined'
        } has-text-primary`}
        style={{ cursor: titleClickable ? 'pointer' : 'auto' }}
      >
        {title}
      </Link>
      <div className='card-image is-relative mt-2'>
        {imageLoading && (
          <CircularProgress
            color='secondary'
            sx={{
              position: 'absolute',
              top: '42%',
              right: '45%',
              zIndex: '10',
            }}
          />
        )}
        <figure className='image is-4by3'>
          <LazyLoadImage
            src={imageAddress} // use normal <img> attributes as props
            onLoad={() => setImageLoading(false)}
            height='100%'
            width='100%'
            effect='opacity'
          />
        </figure>
      </div>
      <div className='card-content'>
        <div className='media'>
          <div className='media-left'>
            <figure className='image is-48x48'>
              <LazyLoadImage
                src={props.post.user.imageAddress} // use normal <img> attributes as props
                onLoad={() => setImageLoading(false)}
                height='100%'
                width='100%'
                effect='opacity'
              />
            </figure>
          </div>
          <div className='media-content'>
            <Link to={`/profile/${props.post.user._id}`} className='title is-4 is-underlined'>{props.post.user.name}</Link>
            <p className='subtitle is-6'>
              {moment(createdAt).format('Do MMMM YYYY HH:MM A')}
            </p>
          </div>
        </div>

        <div className='content'>
          {description}
          <br />
        </div>
        <p className='control has-icons-left has-icons-right'>
          <input
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className='input'
            type='text'
            placeholder='Comment...'
          />
          <span className='icon is-small is-left'>
            <i className='fa-solid fa-comment'></i>
          </span>
          <span
            onClick={addComment}
            className={`icon is-small is-right ${
              comment.length && 'is-clickable'
            }`}
          >
            <i className='fa-solid fa-plus is'></i>
          </span>
        </p>
        <footer className='card-footer mt-3'>
          <a
            onClick={likeOrDisLikeAPost}
            className={`card-footer-item ${
              isLikedPost && 'has-text-danger has-text-weight-bold'
            }`}
          >
            Like {totalLikesOnPost}
          </a>
          <button
            onClick={getAllComentsOfPost}
            className={`button is-link ${isLoading && 'is-loading'}`}
          >
            All Comments
          </button>
        </footer>
        <div className={`box ${comments.length === 0 && 'is-hidden'} mt-2`}>
          {comments.map((comment) => (
            <div>
              <span className='is-size-5 has-text-weight-bold'>
                {`@${comment.user.name}: `}{' '}
              </span>
              <span className='is-size-5 has-text-weight-normal'>
                {comment.commentValue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
