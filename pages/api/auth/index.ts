import container from '@/server/container'

export default container.resolve('AuthController').handler('/api/auth')
