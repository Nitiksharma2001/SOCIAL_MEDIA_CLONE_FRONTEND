import * as React from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/UserSlice'
import { getwithAuth, getWithoutAuth, postwithAuth, putWithAuth } from '../utils/Request'
import moment from 'moment'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PostCard(props) {
  const { _id, title, description, imageUrl, noOfLikes, createdAt } = props.post
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isLikedPost, setIsLikedPost] = useState(false) 
  const [totalLikesOnPost, setTotalLikesOnPost] = useState(0)

  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addComment = async () => {
    if(!user){
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
    if(user){
      checkLikedorNotAndCountLikes()
    }
  }, [])

  const likeOrDisLikeAPost = async () => {
    if(!user){
      return navigate('/signin')
    }
    setTotalLikesOnPost(prev => isLikedPost ? prev-1 : prev+1)
    setIsLikedPost(!isLikedPost)
    await putWithAuth(`post/${isLikedPost ? 'dislike' : 'like'}/${_id}`, user.token)
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
    <div class='card' style={{ maxWidth: '25rem' }}>
      <div className='title is-2 m-2'>{title}</div>
      <div class='card-image'>
        <figure class='image is-4by3'>
          <img src={imageUrl} alt='Placeholder image' />
        </figure>
      </div>
      <div class='card-content'>
        <div class='media'>
          <div class='media-left'>
            <figure class='image is-48x48'>
              <img
                src={imageUrl}
                alt='Placeholder image'
                style={{ borderRadius: '2rem' }}
              />
            </figure>
          </div>
          <div class='media-content'>
            <p class='title is-4'>{props.post.user.name }</p>
            <p class='subtitle is-6'>
              {moment(createdAt).format('Do MMMM YYYY HH:MM A')}
            </p>
          </div>
        </div>

        <div class='content'>
          {description}
          <br />
        </div>
        <p class='control has-icons-left has-icons-right'>
          <input onChange={e => setComment(e.target.value)} value={comment} class='input' type='text' placeholder='Comment...' />
          <span class='icon is-small is-left'>
            <i class='fa-solid fa-comment'></i>
          </span>
          <span
            onClick={addComment}
            class={`icon is-small is-right ${comment.length && 'is-clickable'}`}
          >
            <i class='fa-solid fa-plus is'></i>
          </span>
        </p>
        <footer class='card-footer'>
          <a href='#' onClick={likeOrDisLikeAPost} class={`card-footer-item ${isLikedPost && 'has-text-danger has-text-weight-bold'}`}>
            Like {totalLikesOnPost}
          </a>
          <button
            onClick={getAllComentsOfPost}
            class={`button is-link ${isLoading && 'is-loading'}`}
          >
            All Comments
          </button>
        </footer>

        <div class={`box ${comments.length === 0 && 'is-hidden'}`}>
          {comments.map((comment) => (
            <div>
              <span className='is-size-5 has-text-weight-bold'>{`@${comment.user.name}: `} </span>
              <span className='is-size-5 has-text-weight-normal'>{comment.commentValue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
