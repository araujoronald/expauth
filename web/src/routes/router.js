import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'
import BoasVindas  from '@/pages/BoasVindas'
import Password  from '@/pages/Password'
import CodigoAcesso  from '@/pages/CodigoAcesso'
import Face  from '@/pages/Face'
import SegundoFator  from '@/pages/SegundoFator'
import Feedback  from '@/pages/Feedback'
import Agradecimento  from '@/pages/Agradecimento'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/:codLink',
        component: BoasVindas
    },
    {
        path: '/auth/password',
        component: Password
    },
    {
        path: '/auth/codigoAcesso',
        component: CodigoAcesso
    },
    {
        path: '/auth/face',
        component: Face
    },
    {
        path: '/auth/password_codigo_acesso',
        component: SegundoFator
    },
    {
        path: '/auth/feedback',
        component: Feedback
    },
    {
        path: '/auth/agradecimento',
        component: Agradecimento
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router