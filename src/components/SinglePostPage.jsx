import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from './PostCard'
import { getWithoutAuth } from '../utils/Request'

const SinglePostPage = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  useEffect(() => {
    const getPostFromPostId = async () => {
      const result = await getWithoutAuth(`post/${postId}`)
      setPost(result)
    }
    getPostFromPostId()
  }, [])

  return <div className='is-flex is-justify-content-center'>{post && <PostCard post={post} titleClickable={false}/>}</div>
}

export default SinglePostPage
