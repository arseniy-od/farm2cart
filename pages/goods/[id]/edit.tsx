import { ConnectedProps, connect } from 'react-redux'
import { normalize } from 'normalizr'

import container from '@/server/container'
import { RootState } from '@/redux/store'
import { categoriesSchema, goodSchema } from '@/redux/normalSchemas'
import { updateEntities } from '@/redux/actions'

import GoodForm from '@/app/components/goods/goodForm'
import Layout from '@/app/layout'
import ErrorMessage from '@/app/components/utils/errorMessage'

import { ContextDynamicRoute } from '@/app/types/interfaces'
import clientContainer from '@/redux/container'
import initServerStore from '@/server/initServerStore'

function EditGood({ good }: Props) {
    if (!good) {
        return (
            <Layout>
                <ErrorMessage message="Good not found" />
            </Layout>
        )
    }
    return <GoodForm good={good} method="put" />
}

const mapState = (state: RootState, ownProps) => ({
    good: state.entities.goods?.[ownProps.query.id],
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { id: number; error?: boolean; message?: string }

export const getServerSideProps = clientContainer
    .resolve('redux')
    .wrapper.getServerSideProps(
        initServerStore(
            [
                container.resolve('GoodController'),
                container.resolve('CategoryController'),
            ],
            '/goods/:id'
        )
    )

export default connector(EditGood)
