import express from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import { infoRoutes } from './info.routes'
import { passwordRoutes } from './password.routes'
import { otpRoutes } from './otp.routes'
import { facialRoutes } from './facial.routes'
import { segundoFatorRoutes } from './segundoFator.routes'
import { feedbackRoutes } from './feedback.routes'
import { configRoutes } from './config.routes'
import { notificacaoRoutes } from './notificacao.routes'

const app = express()

app.use(cors())

app.use(json())
app.use(infoRoutes)
app.use(passwordRoutes)
app.use(otpRoutes)
app.use(facialRoutes)
app.use(segundoFatorRoutes)
app.use(feedbackRoutes)
app.use(configRoutes)
app.use(notificacaoRoutes)

export { app }
