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
import { pageFetching, pageInit, updateEntities } from '@/redux/actions'
import { jsonCopy } from '@/app/utils'

export default class BaseController extends BaseContext {
    protected schema: any

    protected initSchema(entityName = '', attributes: any = {}) {
        this.schema = entityName
            ? new schema.Entity(entityName, attributes)
            : null
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
        // console.log('class args: ', classArgs)

        for (let i = 0; i < classArgs.length; i++) {
            // console.log('use: ', classArgs[i])
            router.use(classArgs[i])
        }
        return classArgs
    }

    private useMethodMiddleware(methodName: string) {
        const key = this.constructor.name + '_' + methodName
        // console.log('key: ', key)

        const methodMiddleware = Reflect.getMetadata(key, this.constructor)
        const methodArgs = Array.isArray(methodMiddleware)
            ? methodMiddleware
            : []
        return methodArgs
    }

    public run = async (context: ContextDynamicRoute, store, routeName) => {
        try {
            // const routeName = context.routeName || context.req.url
            const method = 'SSR'
            // console.log('[BaseController] route', routeName)

            const members: any = Reflect.getMetadata(routeName, this)
            // console.log('Members: ', members)

            const [firstMethod] = members[method]
            // for (let i = 0; i < members[method].length; i++) {
            const callback = this[firstMethod].bind(this)
            let data = await callback({
                params: context?.params,
            } as any)
            data = jsonCopy(data)
            if (data.notFound || !data) {
                console.error('[BaseController] Data not found')
                return { notFound: true }
            }
            // console.log('[BaseController] data before normalization:\n', data)

            const normalizedResult = this.normalizeData(data.result || data)
            if (data.pageName) {
                console.log('[BaseController] pageName:', data.pageName)
                store.dispatch(
                    pageInit(data.pageName, normalizedResult.result, data.count)
                )
            }
            // console.log(
            //     '[BaseController] data after normalization:\n',
            //     normalizedResult
            // )
            store.dispatch(updateEntities(normalizedResult))
            return {
                props: {
                    query: context?.query || {},
                    params: context?.params || {},
                },
            }
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
    // })
    // .run(context.req, context.res)

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
                            let data = await callback({
                                body: req?.body,
                                params: req?.params,
                                session: req?.session,
                                identity: req?.session.user,
                                query: req?.query,
                                file: req?.file,
                            } as any)
                            data = JSON.parse(JSON.stringify(data))
                            if (!data) {
                                return res.status(500).json({
                                    error: true,
                                    message: 'Data not found',
                                })
                            }
                            if (data.error || data.notFound) {
                                console.error(data.message || data)
                                return res.status(500).json({
                                    error: true,
                                    message: data.message || 'Data not found',
                                })
                            }
                            return res.status(200).json(data)
                        } catch (err: any) {
                            const message = err?.message ? err.message : err
                            return res
                                .status(400)
                                .json({ error: true, message })
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
