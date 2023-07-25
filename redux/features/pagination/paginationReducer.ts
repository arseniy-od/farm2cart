import { isEmpty, jsonCopy } from '@/app/utils'

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
            let pagination: pagination = {}
            if (state[pageName]) {
                pagination = jsonCopy(state[pageName])
            }
            if (isEmpty(pagination) || !pagination.count) {
                console.log('pagination is empty')
                console.log('paginator: ', pagination)

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
            const pagination = jsonCopy(state[pageName])
            // we have to recalculate all pages with filters
            pagination.filter = { ...pagination.filter, ...filter }
            return { ...state, [pageName]: pagination }
        }

        // case 'paginator/page_fetching':
        //     console.log('PAGINATION')
        //     {
        //         const { pageName, page, isFetching, force } = action.payload
        //         let pagination = { fetching: false, pages: {}, currentPage: 1 }
        //         pagination.fetching = isFetching

        //         if (page in pagination.pages) {
        //             //to avoid empty page before loading new page data
        //             pagination.currentPage = page

        //             // if (force) {
        //             //     const pages = pagination.get('pages')?.filter((v, k) => Number.parseInt(k) < page);
        //             //     pagination = pagination.set('pages', pages);
        //             // }
        //         }

        //         state = { [pageName]: { ...pagination } }
        //     }
        //     break

        //     case PAGE_SELECT_ITEM:
        //         {
        //             const { pageName, selectedItems } = action
        //             let pagination = state.has(pageName)
        //                 ? state.get(pageName)
        //                 : Map<string, IPagination>()
        //             pagination = pagination.set('touched', selectedItems)
        //             state = state.set(pageName, pagination)
        //         }
        //         break

        //     case PAGE_SET_FILTER:
        //         {
        //             const { pageName, filter, sort } = action
        //             let pagination = state.has(pageName)
        //                 ? state.get(pageName)
        //                 : Map<string, IPagination>()
        //             pagination = pagination
        //                 .set('filter', fromJS(filter))
        //                 .set('sort', fromJS(sort))
        //             state = state.set(pageName, pagination)
        //         }
        //         break

        //     case PAGE_CLEAR:
        //         {
        //             const { pageName } = action
        //             // const pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();

        //             // state = state.set(pageName, pagination);
        //         }
        //         break
    }

    return state
}
