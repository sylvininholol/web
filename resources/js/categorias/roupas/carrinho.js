window.addToCart = (event, id) => {
  event.preventDefault()

  fetch('/api/carrinho/adicionar', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      quantity: 1,
    }),
  })
    .then((response) => response.ok && window.location.reload())
    .catch((error) => alert('Erro ao adicionar ao carrinho'))
}

window.removeFromCart = (event, id) => {
  event.preventDefault()

  fetch('/api/carrinho/remover', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  })
    .then((response) => response.ok && window.location.reload())
    .catch((error) => alert('Erro ao remover do carrinho'))
}

window.checkout = (event) => {
  event.preventDefault()

  fetch('/api/carrinho/finalizar-compra', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(
      (response) =>
        response.ok && window.location.reload()
    )
    .catch(() => alert('Erro ao finalizar compra'))
}
