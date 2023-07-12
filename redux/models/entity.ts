import { call, fork, put, take } from 'redux-saga/effects'
import { schema, normalize } from 'normalizr'

import { METHODS } from '@/app/constants'
import { action, fetchFailed, fetchSucceeded } from '../actions'
import 'reflect-metadata'
import { ISagaMethods } from '@/app/types/common'
import CategoryEntity from './category'

interface IOptions {
    method: string
    headers?: Record<string, string>
    body?: string
}

export default class BaseEntity {
    constructor() {
        this.fetchApi = this.fetchApi.bind(this)
        this.readData = this.readData.bind(this)
        this.saveData = this.saveData.bind(this)
    }

    private schema: any
    private static _actions = []

    protected initSchema(entityName = '', attributes: any = {}) {
        this.schema = entityName
            ? new schema.Entity(entityName, attributes)
            : null
    }

    protected async fetchApi(
        url: string,
        method: string,
        data?: Record<string, any>,
        contentType: string = 'application/json'
    ) {
        const options: IOptions = {
            method: method,
        }
        if (method === METHODS.POST) {
            options.headers = {
                'Content-Type': contentType,
            }
            options.body = JSON.stringify(data)
        }
        let res = await fetch(url, options)
        if (res.ok) {
            const result = await res.json()
            return result
        } else {
            throw new Error('Fetching error: ' + res.statusText)
        }
    }

    protected normalizeData(data) {
        return normalize(
            data,
            Array.isArray(data) ? [this.schema] : this.schema
        )
    }

    protected *actionRequest(
        url: string,
        method: string,
        data?: Record<string, any>
    ) {
        try {
            const result = yield this.fetchApi(url, method, data)
            const normalizedResult = this.normalizeData(result)
            yield put(fetchSucceeded(normalizedResult))
        } catch (error) {
            yield put(fetchFailed(error.message))
        }
    }

    protected readData(url: string) {
        return this.actionRequest(url, METHODS.GET)
    }

    protected saveData(url: string, data: Record<string, any>) {
        return this.actionRequest(url, METHODS.POST, data)
    }

    // metadata is written is @action() at entity class
    public static sagas() {
        const objects: ISagaMethods[] = Reflect.getMetadata('sagas', BaseEntity)
        return objects.map((obj) => {
            const actionName = obj.className + '_' + obj.methodName // 'CategoryEntity_fetchCategories'

            const classInstance = CategoryEntity //! replace

            const method = classInstance[obj.methodName].bind(classInstance)
            const saga = function* () {
                while (true) {
                    const data = yield take(actionName)
                    yield call(method, data)
                }
            }
            BaseEntity._actions = {
                ...BaseEntity._actions,
                [actionName]: (data) => action(actionName, data),
            }
            return fork(saga)
        })
    }

    public action(methodName, data?) {
        return BaseEntity._actions[this.constructor.name + '_' + methodName](
            data
        ) // _actions['categories_']
    }
}
