import BaseContext from '../baseContext'
import { createRouter } from 'next-connect'
import {
    NextApiResponse,
    NextApiRequest,
    GetServerSidePropsContext,
    PreviewData,
} from 'next'
// import { INextApiRequestExtended } from '../interfaces/common'
import 'reflect-metadata'
import {
    ContextDynamicRoute,
    NextApiRequestWithUser,
} from '@/app/types/interfaces'
import { schema } from 'normalizr'
import { normalizeResponse } from '@/app/normalizeResponse'
import { pageUpdate, updateEntities } from '@/redux/actions'
import { jsonCopy } from '@/app/utils'
import { ParsedUrlQuery } from 'querystring'
import { clientDi } from '@/redux/container'
import { CODES } from '@/app/constants'

export default class BaseController extends BaseContext {
    protected schema: any
    protected successMessage: string = ''
    protected failMessage: string = ''
    protected successCode: string = ''
    protected failCode: string = ''

    protected createMessage({
        successMessage,
        failMessage,
        successCode = CODES.TOAST,
        failCode = CODES.TOAST,
    }) {
        this.successMessage = successMessage
        this.failMessage = failMessage
        this.successCode = successCode
        this.failCode = failCode
    }

    private clearMessage() {
        this.successMessage = ''
        this.failMessage = ''
        this.successCode = ''
        this.failCode = ''
    }

    protected normalizeData(data) {
        return normalizeResponse(
            data,
            Array.isArray(data) ? [this.schema] : this.schema
        )
    }

    private useClassMiddleware(router) {
        const classMiddleware = Reflect.getMetadata(
            this.constructor.name,
            this.constructor
        )
        const classArgs = Array.isArray(classMiddleware) ? classMiddleware : []

        for (let i = 0; i < classArgs.length; i++) {
            router.use(classArgs[i])
        }
        return classArgs
    }

    private useMethodMiddleware(methodName: string) {
        const key = this.constructor.name + '_' + methodName
        const methodMiddleware = Reflect.getMetadata(key, this.constructor)
        const methodArgs = Array.isArray(methodMiddleware)
            ? methodMiddleware
            : []
        return methodArgs
    }

    public run = async (
        context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
        store,
        routeName
    ) => {
        try {
            const method = 'SSR'
            const members: any = Reflect.getMetadata(routeName, this)
            const [firstMethod] = members[method]
            const callback = this[firstMethod].bind(this)
            let data = await callback({
                params: context?.params,
            } as any)

            if (data.notFound || !data) {
                return {
                    data: [],
                    message: data?.message || this.failMessage,
                    code: this.failCode,
                }
            }
            data = jsonCopy(data)
            const normalizedResult = this.normalizeData(data.result || data)

            if (data.pageName) {
                store.dispatch(
                    pageUpdate(
                        data.pageName,
                        normalizedResult.result,
                        data.count
                    )
                )
            }

            store.dispatch(updateEntities(normalizedResult))
        } catch (error: any) {
            console.error('[BaseController] error:', error)
            return {
                props: {
                    error: true,
                    message: error.message ? error.message : error,
                },
            }
        }
    }

    public handler(routeName: string) {
        const router = createRouter<NextApiRequest, NextApiResponse>()
        const classArgs = this.useClassMiddleware(router)
        const members: any = Reflect.getMetadata(routeName, this)
        Object.keys(members).map((method) => {
            for (let i = 0; i < members[method].length; i++) {
                const methodName: string = method.toLowerCase()
                if (typeof router[methodName] === 'function') {
                    const methodArgs = this.useMethodMiddleware(
                        members[method][i]
                    )
                    const callback = this[members[method][i]].bind(this)
                    const action = async (req, res, next) => {
                        try {
                            // console.log('[BaseController] req:', req)
                            let data = await callback({
                                body: req?.body,
                                params: req?.params,
                                session: req?.session,
                                identity: req?.session.user,
                                query: req?.query,
                                file: req?.file,
                            } as any)
                            data = jsonCopy(data)
                            if (!data || data.notFound || data?.count === 0) {
                                const response = {
                                    data: [],
                                    message: this.failMessage,
                                    code: this.failCode,
                                }
                                this.clearMessage()
                                return res.status(404).json(response)
                            }
                            if (data.error) {
                                console.error(data.message || data)
                                const response = {
                                    data: [],
                                    message:
                                        data.message ||
                                        this.failMessage ||
                                        'Data not found',
                                    code: this.failCode,
                                }
                                this.clearMessage()
                                return res.status(500).json(response)
                            }
                            delete data.pageName
                            const response = {
                                data,
                                message: this.successMessage || 'Ok',
                                code: this.successCode,
                            }
                            this.clearMessage()
                            return res.status(200).json(response)
                        } catch (err: any) {
                            const message = err?.message ? err.message : err
                            return res.status(500).json({
                                data: [],
                                message,
                                code: CODES.TOAST,
                            })
                        }
                    }
                    const args = [...methodArgs, action]
                    // console.log('method args: ', methodArgs)
                    router[methodName](routeName, ...args)
                }
            }
        })
        return router.handler()
    }
}
