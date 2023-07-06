import container from '@/server/container'

export default container.resolve('ReviewController').handler('/api/reviews')
