import { call, fork, put, take } from 'redux-saga/effects'
import { schema, normalize } from 'normalizr'

import { METHODS } from '@/app/constants'
import { action, deleteEntity, fetchFailed, updateEntities } from '../actions'
import 'reflect-metadata'
import { ISagaMethods } from '@/app/types/common'
import CategoryEntity from './category'

interface IOptions {
    method: string
    headers?: Record<string, string>
    body?: string
}

export default class Entity {
    constructor() {
        this.fetchApi = this.fetchApi.bind(this)
        this.readData = this.readData.bind(this)
        this.saveData = this.saveData.bind(this)
    }

    protected schema: any
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
            const result = await res.json()
            throw new Error(
                'Fetching error: ' + (result.message || res.statusText)
            )
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
            if (method === METHODS.DELETE) {
                yield this.fetchApi(url, method)
                yield put(deleteEntity(data?.id))
                return
            }
            const result = yield this.fetchApi(url, method, data)
            const normalizedResult = this.normalizeData(result)
            const id = normalizedResult.result
            yield put(updateEntities(normalizedResult))
            return { data: normalizedResult.entities, id: id }
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

    protected deleteData(url: string, id: number) {
        return this.actionRequest(url, METHODS.DELETE, { id })
    }

    // not used now
    // metadata is written is @action() at entity class
    public static sagas() {
        const objects: ISagaMethods[] = Reflect.getMetadata('sagas', Entity)
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
