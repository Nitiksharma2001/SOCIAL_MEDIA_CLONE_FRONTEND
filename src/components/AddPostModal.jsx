import { useState } from 'react'
import { postwithAuth } from '../utils/Request'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from '../features/PostSlice'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
}

export default function BasicModal({ isActive, setIsActive }) {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  })

  const formDataChange = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await postwithAuth('post/', user.token, formData)
      dispatch(addPost(result.post))
      setFormData({ title: '', description: '', imageUrl: '' })
      if ((result.message = 'post created')) {
        setIsActive(false)
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={`modal ${isActive && 'is-active'}`}>
      <div className='modal-background'></div>
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Add a Post</p>
          <button
            onClick={() => setIsActive(false)}
            className='delete'
            aria-label='close'
          ></button>
        </header>
        <section className='modal-card-body'>
          <div className='field'>
            <label className='label'>Title</label>
            <div className='control'>
              <input
                className='input'
                name='title'
                value={formData.title}
                onChange={formDataChange}
                type='text'
                placeholder='e.g Nature'
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Description</label>
            <div className='control'>
              <input
                className='input'
                name='description'
                value={formData.description}
                onChange={formDataChange}
                type='text'
                placeholder='e.g Beautiful Place'
              />
            </div>
          </div>

          <div className='field'>
            <label className='label'>Image URL</label>
            <div className='control'>
              <input
                className='input'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={formDataChange}
                type='text'
              />
            </div>
          </div>
        </section>
        <footer className='modal-card-foot'>
          <div className='buttons'>
            <button
              onClick={handleSubmit}
              className={`button is-success ${isLoading && 'is-loading'}`}
            >
              Submit
            </button>
            <button onClick={() => setIsActive(false)} className='button'>
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
