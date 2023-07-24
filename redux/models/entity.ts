import { call, fork, put, select, take } from 'redux-saga/effects'
import { schema, normalize } from 'normalizr'

import { METHODS } from '@/app/constants'
import {
    action,
    changeCurrentPage,
    deleteEntity,
    fetchFailed,
    pageUpdate,
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

    private static _actions = []
    protected schema: any

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
        console.log('Method is: ', method)
        if ([METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(method)) {
            if (contentType === 'multipart/form-data' && data) {
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
            return result
        } else {
            const result = await res.json()
            throw new Error(
                'Fetching error: ' + (result.message || res.statusText)
            )
        }
    }

    protected async fetchPaginated() {}

    protected normalizeData(data) {
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
            if ([METHODS.DELETE, METHODS.PATCH].includes(method)) {
                return result
            }
            // console.log('actionRequest result: ', result)
            const normalizedResult = this.normalizeData(result.result || result)
            // console.log('normalized: ', normalizedResult)
            const entities = normalizedResult.entities
            const id = normalizedResult.result
            yield put(updateEntities(normalizedResult))
            return { data: entities, id, count: result?.count }
        } catch (error) {
            yield put(fetchFailed(error.message))
        }
    }
    protected *isPageFetched(data: {
        pageName: string
        page: number
        query?: string
    }) {
        const { pageName, page } = data
        const pagination: pagination = yield select(
            (state: RootState) => state.pagination[pageName]
        )

        if (
            !(page in (pagination.pages || [])) ||
            query !== pagination.filter
        ) {
            //! rewrite
            return false
        } else {
            return true
        }
    }

    protected *readPaginated(
        pageName: string,
        url: string,
        page: number,
        query?: string
    ) {
        const isFetched = yield call(this.isPageFetched, {
            pageName,
            page,
            query,
        })
        if (isFetched) {
            yield put(changeCurrentPage(pageName, page)) // we have all data, so only changing current page
        } else {
            const { id: ids, count } = yield call(
                this.readData,
                url + '?page=' + page
            )
            yield put(pageUpdate(pageName, ids, count, page))
        }
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
}
