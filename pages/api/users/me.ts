import container from '@/server/container'

export default container.resolve('UserController').handler('/api/users/me')
