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
    <div class={`modal ${isActive && 'is-active'}`}>
      <div class='modal-background'></div>
      <div class='modal-card'>
        <header class='modal-card-head'>
          <p class='modal-card-title'>Add a Post</p>
          <button
            onClick={() => setIsActive(false)}
            class='delete'
            aria-label='close'
          ></button>
        </header>
        <section class='modal-card-body'>
          <div class='field'>
            <label class='label'>Title</label>
            <div class='control'>
              <input
                class='input'
                name='title'
                value={formData.title}
                onChange={formDataChange}
                type='text'
                placeholder='e.g Nature'
              />
            </div>
          </div>
          <div class='field'>
            <label class='label'>Description</label>
            <div class='control'>
              <input
                class='input'
                name='description'
                value={formData.description}
                onChange={formDataChange}
                type='text'
                placeholder='e.g Beautiful Place'
              />
            </div>
          </div>

          <div class='field'>
            <label class='label'>Image URL</label>
            <div class='control'>
              <input
                class='input'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={formDataChange}
                type='text'
              />
            </div>
          </div>
        </section>
        <footer class='modal-card-foot'>
          <div class='buttons'>
            <button
              onClick={handleSubmit}
              class={`button is-success ${isLoading && 'is-loading'}`}
            >
              Submit
            </button>
            <button onClick={() => setIsActive(false)} class='button'>
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
