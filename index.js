const express = require('express')
const uuid = require('uuid')
const port = 3000
const server = express()
server.use(express.json())

const orders = []

const methodUrl = (request, response, next) => {
console.log(request.method, request.url)
next()
}

const checksId = (request, response, next) => {
const { id } = request.params
const index = orders.findIndex(order => order.id === id)

if (index < 0) {
return response.status(404).json({ message: "Order Not Found!!" })
}
request.orderIndex = index
request.orderId = id
next()
}


// [GET] / order: 
// Rota que lista todos os pedidos já feitos.
server.get('/orders', (request, response) => {
return response.json(orders)
})

// [POST] / order:
// A rota recebe o pedido do cliente, com nome do cliente, valor do pedido. Essas informações devem são passadas dentro do corpo(body) da requisição, com essas informações é registrado o novo pedido dentro de um array com o seguinte formato: 
//{ id: " ", order: "X- Salada, 2 batatas grandes, 1 coca-cola", clientName: "José", price: 44.50, status: "Em preparação" }. 
// O ID será gerado, dentro do código com a utilização UUID V4, assim que o pedido for criado, entrará o status do pedido como: "Em preparação".
server.post('/orders', methodUrl, (request, response) => {
const { order, clienteName, price, status } = request.body
const newOrder = { id: uuid.v4(), order, clienteName, price, status }
orders.push(newOrder)
return response.status(201).json(newOrder)
})



// [PUT] / order/ :id:
// Essa rota altera um pedido já feito, podendo alterar um ou todos os dados do pedido; O id do pedido será enviado nos parâmetros da rota.
server.put('/orders/:id', methodUrl, checksId, (request, response) => {
const id = request.orderId
const index = request.orderIndex
const { order, clienteName, price, status } = request.body
const updatedOrder = { id, order, clienteName, price, status }
orders[index] = updatedOrder
return response.json(updatedOrder)
})

// [DELETE] / order/ :id:
// Essa rota deleta um pedido já feito, com o id enviado nos parâmetros da rota.
server.delete('/orders/:id', methodUrl, checksId, (request, response) => {
const index = request.orderIndex
orders.splice(index, 1)
return response.status(204).json({ message: "order deleted" })
})

// [PATCH] / order/:id:
// Essa rota recebe o id nos parâmetros e assim que ela é chamada, altera o status do pedido recebido pelo id, para como: "Pronto".
server.patch('/orders/:id', methodUrl, checksId, (request, response) => {
const id = request.orderId
const index = request.orderIndex
const { order, clienteName, price, status } = request.body
const updatedOrder = { id, order, clienteName, price, status }
orders[index] = updatedOrder
return response.json(updatedOrder)

})


server.listen(port, () => {
console.log(` 💻 Server started on port ${port}`)
})


















