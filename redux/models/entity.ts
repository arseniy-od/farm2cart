import { call, fork, put, select, take } from 'redux-saga/effects'
import { schema, normalize } from 'normalizr'
import { toast } from 'react-toastify'

import { CODES, METHODS } from '@/app/constants'
import {
    action,
    changeCurrentPage,
    clearPage,
    deleteEntity,
    fetchFailed,
    initPage,
    pageFetching,
    pageUpdate,
    setPageFilter,
    updateEntities,
} from '../actions'
import 'reflect-metadata'
import { ISagaMethods } from '@/app/types/common'
import BaseClientContext from '../baseClientContext'
import clientContainer from '../container'
import { RootState } from '../store'
import {
    IPagerState,
    pagination,
} from '../features/pagination/paginationReducer'
import { isEmpty } from '@/app/utils'

interface IOptions {
    method: string
    headers?: Record<string, string>
    body?: string | FormData
}

export default class Entity extends BaseClientContext {
    constructor(opts) {
        super(opts)
        this.fetchApi = this.fetchApi.bind(this)
        this.readData = this.readData.bind(this)
        this.readPaginated = this.readPaginated.bind(this)
        this.saveData = this.saveData.bind(this)
        this.updateData = this.updateData.bind(this)
        this.patchData = this.patchData.bind(this)
        this.deleteData = this.deleteData.bind(this)
    }

    public static _actions: string[] = []
    public schema: any

    protected initSchema(entityName = '', attributes: any = {}) {
        this.schema = entityName
            ? new schema.Entity(entityName, attributes)
            : null
    }

    protected async fetchApi(
        url: string,
        method: string,
        data?: Record<string, any> | FormData,
        contentType: string = 'application/json'
    ) {
        const options: IOptions = {
            method: method,
        }
        if ([METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(method)) {
            if (
                contentType === 'multipart/form-data' &&
                data instanceof FormData
            ) {
                options.body = data
            } else {
                options.headers = {
                    'Content-Type': contentType,
                }
                options.body = JSON.stringify(data)
            }
        }
        let res = await fetch(url, options)
        if (res.ok) {
            const result = await res.json()
            if (result.code === CODES.TOAST) {
                toast.success(result.message)
            }
            if (result.code === CODES.DEBUG) {
                console.log('[fetch]:', result.message)
            }
            return result.data
        } else {
            const result = await res.json()
            if (result.code === CODES.TOAST) {
                toast.error(result.message)
            }
            if (result.code === CODES.ERROR) {
                throw new Error(
                    'Fetching error: ' + (result.message || res.statusText)
                )
            }
            if (result.code === CODES.DEBUG) {
                console.error(
                    'Fetching error: ' + (result.message || res.statusText)
                )
            }
            return result.data
        }
    }

    protected async fetchPaginated() {}

    public normalizeData(data) {
        return normalize(
            data,
            Array.isArray(data) ? [this.schema] : this.schema
        )
    }

    protected *actionRequest(
        url: string,
        method: string,
        data?: Record<string, any>,
        contentType: string = 'application/json'
    ) {
        try {
            const result = yield this.fetchApi(url, method, data, contentType)
            // const result = resultFull.data
            if ([METHODS.DELETE, METHODS.PATCH].includes(method)) {
                return result
            }

            const normalizedResult = this.normalizeData(result.result || result)
            const entities = normalizedResult?.entities
            const id = normalizedResult?.result
            yield put(updateEntities(normalizedResult))
            return { data: entities, id, count: result?.count }
        } catch (error) {
            yield put(fetchFailed(error.message))
        }
    }
    protected isPageFetched(pagination: pagination, page: number) {
        if (!pagination) {
            return false
        }
        if (!(page in (pagination.pages || []))) {
            return false
        } else {
            return true
        }
    }
    private getFilters(pagination: pagination) {
        if (!pagination) {
            return ''
        }
        const filter = pagination.filter
        const entries = Object.entries(filter || {})
        let filtersArr: string[] = []
        if (entries.length) {
            entries.forEach((entry) =>
                filtersArr.push(`&${entry[0]}=${entry[1]}`)
            )
            return filtersArr.join('')
        } else {
            return ''
        }
    }

    protected *readPaginated(
        pageName: string,
        url: string,
        page: number,
        filter?: Record<string, string>,
        force?: boolean
    ) {
        let pageFilter = filter || {}

        if (!isEmpty(filter)) {
            yield put(setPageFilter(pageName, pageFilter))
        }

        const pagination: pagination = yield select(
            (state: RootState) => state.pagination?.[pageName]
        )

        yield put(pageFetching(pageName, page, true, force))
        const isFetched = this.isPageFetched(pagination, page)
        // if (!force) {
        //     isFetched = this.isPageFetched(pagination, page)
        // }
        const filterString = this.getFilters(pagination)
        if (!isFetched) {
            const { id: ids, count } = yield call(
                this.readData,
                url + '?page=' + page + filterString
            )
            yield put(pageUpdate(pageName, ids, count, page))
        }
        yield put(pageFetching(pageName, page, false))
    }

    protected readData(url: string) {
        return this.actionRequest(url, METHODS.GET)
    }

    protected saveData(
        url: string,
        data: Record<string, any>,
        contentType: string = 'application/json'
    ) {
        console.log('saveData, data: ', data)
        return this.actionRequest(url, METHODS.POST, data, contentType)
    }

    protected updateData(
        url: string,
        data: Record<string, any>,
        contentType: string = 'application/json'
    ) {
        return this.actionRequest(url, METHODS.PUT, data, contentType)
    }

    protected patchData(url: string, data: Record<string, any>) {
        return this.actionRequest(url, METHODS.PATCH, data)
    }

    protected deleteData(url: string) {
        return this.actionRequest(url, METHODS.DELETE)
    }

    public static sagas() {
        const objects: ISagaMethods[] = Reflect.getMetadata('sagas', Entity)
        return objects.map((obj) => {
            const actionName = obj.className + '_' + obj.methodName
            // console.log('Action name: ', actionName)
            const classInstance = clientContainer.resolve(obj.className)
            const method = classInstance[obj.methodName].bind(classInstance)
            
            // NEW
            if (!classInstance.actions) {
                classInstance.actions = {}
            }
            classInstance.actions[obj.methodName] = actionName
            
            const saga = function* () {
                while (true) {
                    const { payload } = yield take(actionName)
                    yield call(method, payload)
                }
            }
            Entity._actions = {
                ...Entity._actions,
                [actionName]: (data) => action(actionName, data),
            }
            return fork(saga)
        })
    }

    // not used
    public action(methodName, data?) {
        return Entity._actions[this.constructor.name + '_' + methodName](data) // _actions['categories_']
    }
    public myAction() {
        return Entity._actions
    }
}
