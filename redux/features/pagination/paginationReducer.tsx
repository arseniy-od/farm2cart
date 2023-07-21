const initialPagerState: any = {}

export default function pagination(state = initialPagerState, action: any) {
    // get result for the paginator, disable fetching
    // if (action.response && action.response.pager) {
    //     const {
    //         response: { pager, result },
    //     } = action
    //     if ('glob' in action && 'pageName' in action.data) {
    //         const pageName = action.data.pageName

    //         let pagination = state.has(pageName) // state associated with this reducer
    //             ? state.get(pageName)
    //             : Map<string, IPagination>()
    //         let pages = pagination.has('pages')
    //             ? pagination.get('pages')
    //             : Map<number, IPaginationPage>()

    //         if (result?.length === 0) {
    //             pager.page = pages.size
    //         } else {
    //             const item = fromJS({
    //                 ids: action.response.result,
    //             })

    //             pages = pages.set(pager.page, item)
    //         }
    //         const oldTouched = pagination?.get('touched')
    //         const touched = oldTouched ? oldTouched : List([])

    //         pagination = pagination
    //             .set('entityName', action.glob.entity.entityName)
    //             .set('pageName', pageName)
    //             .set('currentPage', pager.page)
    //             .set('count', pager.count)
    //             .set('perPage', action.data.perPage)
    //             .set('touched', touched)
    //             .set('pages', pages)

    //         state = state.set(pageName, pagination)
    //     }
    // }

    // prepare item for the paginator, enable fetching
    const { type } = action
    switch (type) {
        // case MODEL_CLEAR:
        //     state = initialPagerState
        //     break
        case 'paginator/page_init':
            {
                const { pageName, pageIds, count } = action.payload
                let pagination = {
                    pages: { 1: { ids: pageIds } },
                    fetching: false,
                    currentPage: 1,
                    perPage: pageIds.length,
                    count,
                    pageName,
                }
                state = { [pageName]: { ...pagination } }
            }
            break
        case 'paginator/page_fetching':
            console.log('PAGINATION')
            {
                const { pageName, page, isFetching, force } = action.payload
                let pagination = { fetching: false, pages: {}, currentPage: 1 }
                pagination.fetching = isFetching

                if (page in pagination.pages) {
                    //to avoid empty page before loading new page data
                    pagination.currentPage = page

                    // if (force) {
                    //     const pages = pagination.get('pages')?.filter((v, k) => Number.parseInt(k) < page);
                    //     pagination = pagination.set('pages', pages);
                    // }
                }

                state = { [pageName]: { ...pagination } }
            }
            break

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
