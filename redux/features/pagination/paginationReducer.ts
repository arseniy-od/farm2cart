import { ACTIONS } from '@/app/constants'
import { isEmpty, jsonCopy } from '@/app/utils'
import _ from 'lodash'

export type pagination = {
    pages?: { [id: string]: { ids: number[] } }
    fetching?: boolean
    currentPage?: number
    perPage?: number
    count?: number
    pageName?: string
    filter?: Record<any, any>
}
export interface IPagerState {
    [pageName: string]: pagination
}
const initialPagerState: IPagerState = {}

export default function paginationReducer(
    state = initialPagerState,
    action: any
) {
    const { type } = action
    switch (type) {
        case 'paginator/init': {
            const { pageName } = action.payload
            return { ...state, [pageName]: {} }
        }

        case 'paginator/clear_page': {
            const { pageName } = action.payload
            const pagination = jsonCopy(state[pageName])
            pagination.pages = {}
            pagination.currentPage = 1
            pagination.count = 0
            return { ...state, [pageName]: pagination }
        }
        case 'paginator/update': {
            const { pageName, pageIds, count, pageNumber } = action.payload
            if (!pageIds?.length) {
                // console.log('Return initial')
                return state
            }
            let pagination: pagination = {}
            if (state[pageName]) {
                pagination = jsonCopy(state[pageName])
            }
            if (isEmpty(pagination) || !pagination.count) {
                pagination = {
                    pages: { [pageNumber]: { ids: pageIds } },
                    fetching: false,
                    currentPage: pageNumber,
                    perPage: pageIds.length,
                    filter: pagination.filter || {},
                    count,
                    pageName,
                }
            } else {
                pagination.count = count
                pagination.currentPage = pageNumber
                pagination.pages = {
                    ...pagination.pages,
                    [pageNumber]: { ids: pageIds },
                }
            }
            return { ...state, [pageName]: { ...pagination } }
        }

        case 'paginator/change_page': {
            const { pageName, page } = action.payload
            const pagination = jsonCopy(state[pageName])
            return {
                ...state,
                [pageName]: { ...pagination, currentPage: page },
            }
        }

        case 'paginator/set_filter': {
            const { pageName, filter } = action.payload
            if (!isEmpty(filter)) {
                const pagination = jsonCopy(state[pageName] || {})
                pagination.filter = pagination.filter || {}
                // we have to recalculate all pages with filters
                const newFilter = { ...pagination.filter, ...filter }
                if (_.isEqual(pagination.filter, newFilter)) {
                    return state
                }
                pagination.filter = newFilter

                return { ...state, [pageName]: pagination }
            }
            return state
        }
        case ACTIONS.PAGE_FETCHING: {
            const { pageName, page, isFetching, force } = action.payload
            const pagination = jsonCopy(state[pageName] || {})
            pagination.fetching = isFetching

            if (page in (pagination?.pages || {})) {
                pagination.currentPage = page

                if (force) {
                    pagination.pages = {}
                    pagination.currentPage = 1
                    pagination.count = 0
                }
            }
            // to prevent infinite loop of useEffect fetching at Paginator
            if (_.isEqual(state?.[pageName], pagination)) {
                return state
            }
            return { ...state, [pageName]: { ...pagination } }
        }
        default:
            return state
    }
}
