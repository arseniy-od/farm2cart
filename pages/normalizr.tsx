import Layout from '@/app/layout'
import { RootState } from '@/redux/store'
import { schema, normalize } from 'normalizr'
import { connect } from 'react-redux'

function Normalizr({ goods }) {
    console.log('Redux goods: ', goods)
    const categoryGood = new schema.Entity('categoryGoods')
    const category = new schema.Entity('categories', {
        CategoryGood: categoryGood,
    })
    const seller = new schema.Entity('sellers')
    const goodSchema = new schema.Entity('goods', {
        seller: seller,
        categories: [category],
    })
    const goodsSchema = [goodSchema]
    const normGoods = normalize(goods, goodsSchema)
    console.log('Normalized:', JSON.stringify(normGoods))

    return (
        <Layout>
            <div>Normalizr</div>
        </Layout>
    )
}

const mapState = (state: RootState) => ({
    goods: state.goods,
})

const connector = connect(mapState, null)
export default connector(Normalizr)
