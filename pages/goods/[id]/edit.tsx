import { ConnectedProps, connect } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { RootState, wrapper } from '@/redux/store'
import { categoriesSchema, goodSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'

import GoodForm from '@/app/components/goods/goodForm'
import Layout from '@/app/layout'
import ErrorMessage from '@/app/components/errorMessage'

import { ContextDynamicRoute } from '@/app/types/interfaces'

function EditGood({ good, categories }: Props) {
    if (!good) {
        return (
            <Layout>
                <ErrorMessage message="Good not found" />
            </Layout>
        )
    }
    return <GoodForm good={good} categories={categories} method="put" />
}

const mapState = (state: RootState, ownProps) => ({
    good: state.entities.goods?.[ownProps.id],
    categories: state.entities.categories,
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number; error?: boolean; message?: string }

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (ctx: ContextDynamicRoute) => {
        ctx.routeName = '/goods/:id'
        const res = await container.resolve('GoodController').run(ctx)
        const good = res.props?.data.good
        const categories = res.props?.data.categories
        const normGood = normalize(good, goodSchema)
        const normCategories = normalize(categories, categoriesSchema)
        store.dispatch(updateEntities(normGood))
        store.dispatch(updateEntities(normCategories))

        return {
            props: { id: good.id },
        }
    }
)

export default connector(EditGood)
