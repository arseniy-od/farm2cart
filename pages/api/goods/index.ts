import container from '@/server/container'

export default container.resolve('GoodController').handler('/api/goods')

export const config = {
    api: {
        bodyParser: false,
        // { sizeLimit: '4mb' },
    },
}
