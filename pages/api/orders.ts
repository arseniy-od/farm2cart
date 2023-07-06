import container from '@/server/container'

export default container.resolve('OrderController').handler('/api/orders')
