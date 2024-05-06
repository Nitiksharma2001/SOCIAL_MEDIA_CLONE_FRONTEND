export const getWithoutAuth = async (getUrl) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND}/${getUrl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
export const getwithAuth = async (getUrl, auth) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND}/${getUrl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + auth
    },
  })
  return await response.json()
}
export const postwithAuth = async (postUrl, auth, data) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND}/${postUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + auth
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}
export const postWithoutAuth = async (postUrl, data) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND}/${postUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export const putWithAuth = async (putUrl, auth, body = 'random') => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND}/${putUrl}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + auth
    },
  })
  return await response.json()
}