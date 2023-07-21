// //! entity

// export interface IPagerParams {
//     pageName?: string // paginator name
//     sort?: any // object with sorting key/values
//     filter?: any // object with filtering key/values
//     page?: number // page number
//     perPage: number // count items on one page
//     force?: boolean // reload data in the redux and pager
//     count?: number // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
// }

// public *pageEntity(uri: string, params: IPagerParams) {
//         const { pageName } = params;
//         const pagination = yield select((state: any) => state.pagination);

//         if (!('page' in params)) {
//             params.page = pagination.getIn([pageName, 'currentPage']);
//         }

//         // send event about starting page fetching
//         yield put(pageFetching(pageName, params.page, true, params.force));
//         // check if this page already fetched
//         if (!pagination.hasIn([pageName, 'pages', params.page]) || params.force) {
//             let count = 0;
//             if (!params.force && pagination.hasIn([pageName, 'count'])) {
//                 count = pagination.get(pageName).get('count');
//             }
//             // set filter to paginator, in case fetch from getInitProps()
//             const pFilter = params.filter ? params.filter : {};
//             const pSort = params.sort ? params.sort : {};
//             yield put(pageSetFilter(pageName, pFilter, pSort));

//             yield call(
//                 this.xRead,
//                 uri,
//                 {
//                     ...params,
//                     pageName,
//                     count,
//                 },
//                 HTTP_METHOD.POST
//             );
//         }
//         // send event about ending page fetching
//         yield put(pageFetching(pageName, params.page, false));
//     }

// //! action

// export const pageFetching = (
//   pageName: string,
//   page: number,
//   isFetching: boolean,
//   force = false
// ) => action(PAGE_FETCHING, { pageName, page, isFetching, force });

// //! reducer

// const initialPagerState: any = fromJS({});

// function pagination(state = initialPagerState, action: any) {
//     // get result for the paginator, disable fetching
//     if (action.response && action.response.pager) {
//         const { response: { pager, result } } = action;
//         if ('glob' in action && 'pageName' in action.data) {
//             const pageName = action.data.pageName;

//             let pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();
//             let pages = pagination.has('pages') ? pagination.get('pages') : Map<number, IPaginationPage>();

//             if(result?.length === 0){
//                 pager.page = pages.size;
//             }else {
//                 const item = fromJS({
//                     ids: action.response.result,
//                 });

//                 pages = pages.set(pager.page, item);
//             }
//             const oldTouched = pagination?.get('touched');
//             const touched = oldTouched? oldTouched : List([]);

//             pagination = pagination
//                 .set('entityName', action.glob.entity.entityName)
//                 .set('pageName', pageName)
//                 .set('currentPage', pager.page)
//                 .set('count', pager.count)
//                 .set('perPage', action.data.perPage)
//                 .set('touched', touched)
//                 .set('pages', pages);

//             state = state.set(pageName, pagination);
//         }
//     }
//     // prepare item for the paginator, enable fetching
//     const { type } = action;
//     switch (type) {
//     case MODEL_CLEAR:
//         state = initialPagerState;
//         break;
//     case PAGE_FETCHING: {
//         const { pageName, page, isFetching, force } = action;
//         let pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();
//         pagination = pagination.set('fetching', isFetching);

//         if (pagination.hasIn(['pages', page])) { //to avoid empty page before loading new page data
//             pagination = pagination.set('currentPage', page);

//             // if (force) {
//             //     const pages = pagination.get('pages')?.filter((v, k) => Number.parseInt(k) < page);
//             //     pagination = pagination.set('pages', pages);
//             // }
//         }

//         state = state.set(pageName, pagination);
//     }
//         break;

//     case PAGE_SELECT_ITEM: {
//         const { pageName, selectedItems } = action;
//         let pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();
//         pagination = pagination.set('touched', selectedItems);
//         state = state.set(pageName, pagination);
//     }
//         break;

//     case PAGE_SET_FILTER: {
//         const { pageName, filter, sort } = action;
//         let pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();
//         pagination = pagination.set('filter', fromJS(filter)).set('sort', fromJS(sort));
//         state = state.set(pageName, pagination);
//     }
//         break;

//     case PAGE_CLEAR:
//         {
//             const { pageName } = action;
//             // const pagination = state.has(pageName) ? state.get(pageName) : Map<string, IPagination>();

//             // state = state.set(pageName, pagination);
//         }
//         break;
//     }

//     return state;
// }

// //! view

// <AdaptiveTable
//                 fields={fields}
//                 pagerName={ATHLETES_TABLE}
//                 perPage={PAGE_SIZE_10}
//                 onLoadMore={fetchAthletes}
//                 actions={actions}
//                 onItemChange={(id: any, value: any, field: any) => {
//                     const athlete = athletes?.find(athlete => athlete.get('id') === id);
//                     saveEventAthlete({ athletes: [athlete.set(field, value)] });
//                 }}
//                 actionIsDisabled={actionIsDisabled}
//                 onActionClick={onActionClick}
//                 drawSubRow={subRow}
//                 colors={[
//                     '#7B68EE',
//                     '#ffa12f',
//                     '#07a093',
//                     '#416aff',
//                     '#ff5622',
//                     '#1db954',
//                     '#5f82ff',
//                     '#f42c2c',
//                     '#0ab6ff',
//                     '#f8306c',
//                 ]}
//             />
