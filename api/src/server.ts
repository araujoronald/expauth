import { app } from './app'

const start = async () => {
  console.log('Iniciando a API do experimento ...')
  
  const port = process.env.NODE_PORT

  if (!port) {
    throw new Error('Variável de ambiente NODE_PORT precisa ser definida.')
  }

  if (!process.env.DB_NAME) {
    throw new Error('Variável de ambiente DB_NAME precisa ser definida.')
  }

  app.listen(port, () => {
    console.log(`API do experimento iniciada na porta ${port} ...`)
  })
}

start()
