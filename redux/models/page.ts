import { call, put, select } from 'redux-saga/effects'
import { pageFetching } from '../actions'
import Entity from './entity'
import action from '../decorators/action'
import {
    categorySchema,
    orderGoodsSchema,
    reviewSchema,
    userSchema,
} from '../normalSchemas'

export interface IPagerParams {
    pageName: string // paginator name
    sort?: any // object with sorting key/values
    filter?: any // object with filtering key/values
    page?: number // page number
    perPage: number // count items on one page
    force?: boolean // reload data in the redux and pager
    count?: number // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
}

export default class PageEntity extends Entity {
    constructor(opts) {
        super(opts)
        opts.GoodEntity
        this.initSchema('goods', {
            seller: userSchema,
            categories: [categorySchema],
            reviews: [reviewSchema],
            OrderGood: orderGoodsSchema,
        })
    }

    @action()
    public *fetchPage(data) {
        console.log('fetchPage called with data:', data)
        const { pageName } = data
        const pagination = yield select((state: any) => state.pagination)

        if (!data.page) {
            data.page = pagination[pageName].currentPage || 1
        }

        // send event about starting page fetching
        // yield put(pageFetching(pageName, params.page, true, params.force))
        // check if this page already fetched
        if (!(data.page in pagination[pageName].pages)) {
            let count = 0
            if (pagination[pageName]?.count) {
                count = pagination[pageName]?.count
            }
            // set filter to paginator, in case fetch from getInitProps()
            // const pFilter = params.filter ? params.filter : {};
            // const pSort = params.sort ? params.sort : {};
            // yield put(pageSetFilter(pageName, pFilter, pSort));

            yield call(this.readData, '/api/goods?page=' + data.page)
        }
        // send event about ending page fetching
        // yield put(pageFetching(pageName, params.page, false))
    }
}
