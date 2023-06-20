import BaseContext from '../baseContext'

export default class StoreController extends BaseContext {
    public findStoreByIdServerSideProps = async (
        req: INextApiRequestExtended
    ) => {
        const { StoreService } = this.di
        const id = req.params.id
        const result = await StoreService.findStoreOwnerReviews(id)
        const store = JSON.parse(JSON.stringify(result))
        return { props: { store } }
    }

    public findStoreById = async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {
        const { StoreService } = this.di
        const { query } = req
        const id = parseInt(query.id as string, 10)
        const result = await StoreService.findStoreOwnerReviews(id)
        const store = JSON.parse(JSON.stringify(result))
        res.status(200).json(store)
    }
}
