import container from '@/server/container'

export default container.resolve('GoodController').handler('/api/goods/:id')
