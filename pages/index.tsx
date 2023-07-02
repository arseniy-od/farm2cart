import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Layout from '@/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import { connect, ConnectedProps } from 'react-redux'

import container from '@/server/container'
import { GoodProps, GoodsProps, category, good } from '@/app/types/interfaces'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useStore } from 'react-redux'
import App from '@/app/components/app'

function Goods(props: { goods: good[]; categories: category[] }) {
    const goods = props.goods
    // const dispatch = useAppDispatch()
    // const goodsSelector = useAppSelector((state) => state.goods)
    const catSelector = useAppSelector((state) => state.categories)

    useEffect(() => {
        console.log('init: ', props.isInitialGoods)
        props.addInitial(goods)
    }, [goods])

    // useEffect(() => {
    //     dispatch({ type: 'goods/add_initial', payload: goods })
    // }, [dispatch, goods])

    return (
        <App
            goods={props.isInitialGoods ? goods : props.reduxGoods}
            categories={catSelector.length ? catSelector : props.categories}
        />
    )
}

const mapState = (state) => ({
    isInitialGoods: state.goods.initial,
    reduxGoods: state.goods.data,
    reduxCategories: state.categories,
})

const mapDispatch = {
    addInitial: (goods: good[]) => ({
        type: 'goods/add_initial',
        payload: goods,
    }),
}

const connector = connect(mapState, mapDispatch)
export default connector(Goods)

export async function getStaticProps(ctx) {
    ctx.routeName = '/'
    //todo: refactor to one call
    const goods = await container.resolve('GoodController').run(ctx)
    const categories = await container
        .resolve('CategoryController')
        .getCategories()
    console.log('categories', categories)

    return {
        props: { goods: goods.props.data, categories },
    }
}
