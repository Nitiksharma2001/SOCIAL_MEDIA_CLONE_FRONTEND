import React, { useEffect, useState } from 'react'
import { getwithAuth } from '../utils/Request'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from './PostCard'
import { setUser } from '../features/UserSlice'
import { Skeleton } from '@mui/material'
import SkeletonLoading from "./SkeletonLoading"

const DashBoard = () => {
  const posts = useSelector(state => state.post.value)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '1rem',
      }}
    >
      {posts.length ? posts.map((post) => (
        <div style={{minWidth: '20rem'}}> 
          <PostCard post={post} />

        </div>
      )) : <SkeletonLoading />}
    </div>
  )
}

export default DashBoard
