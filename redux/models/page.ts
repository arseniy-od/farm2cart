// import { call, put, select } from 'redux-saga/effects'
// import Entity from './entity'
// import action from '../decorators/action'
// import {
//     changeCurrentPage as changeCurrentPage,
//     fetchGoods,
//     pageUpdate,
// } from '../actions'
// import { RootState } from '../store'
// import {
//     IPagerState,
//     pagination,
// } from '../features/pagination/paginationReducer'

// export interface IPagerParams {
//     pageName: string // paginator name
//     sort?: any // object with sorting key/values
//     filter?: any // object with filtering key/values
//     page?: number // page number
//     perPage: number // count items on one page
//     force?: boolean // reload data in the redux and pager
//     count?: number // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
// }

// export default class PageEntity extends Entity {
//     constructor(opts) {
//         super(opts)
//     }
//     private pageToEntity = {
//         GoodsTable: fetchGoods,
//     }

//     @action()
//     public *fetchPage(data: { pageName: string; page: number }) {
//         console.log('fetchPage called with data:', data)
//         const { pageName, page } = data
//         const pagination: pagination = yield select(
//             (state: RootState) => state.pagination[pageName]
//         )

//         if (!(page in (pagination.pages || []))) {
//             const fetchAction = this.pageToEntity[pageName]
//             yield put(fetchAction(page))
//         } else {
//             yield put(changeCurrentPage(pageName, page)) // we have all data, so only changing current page
//         }
//     }
// }
