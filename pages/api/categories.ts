import container from '@/server/container'

export default container
    .resolve('CategoryController')
    .handler('/api/categories')
