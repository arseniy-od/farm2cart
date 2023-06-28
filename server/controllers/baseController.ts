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
import { ParsedUrlQuery } from 'querystring'

export default class BaseController extends BaseContext {
    private UserService = this.di.UserService

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

    public run = (context: ContextDynamicRoute) =>
        createRouter()
            .get(async (req, res) => {
                try {
                    const routeName = context.routeName || context.req.url
                    const method = 'SSR'
                    console.log('[BaseController] route', routeName)

                    const members: any = Reflect.getMetadata(routeName, this)
                    console.log('Members: ', members)

                    const [firstMethod] = members[method]
                    // for (let i = 0; i < members[method].length; i++) {
                    const callback = this[firstMethod].bind(this)
                    let data = await callback({
                        params: context?.params,
                        query: context?.query,
                    } as any)
                    data = JSON.parse(JSON.stringify(data))

                    return {
                        props: { data },
                    }
                    // }
                } catch (error: any) {
                    console.error('ERROR in getServerSideProps:', error)
                    return {
                        props: {
                            error: true,
                            message: error.message ? error.message : error,
                        },
                    }
                }
            })
            .run(context.req, context.res)

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
                            // console.log('[handler] req.session: ', req.session)
                            // console.log('[handler] req.user: ', req.user)

                            return res.status(200).json(data)
                        } catch (err: any) {
                            const message = err?.message ? err.message : err
                            return res.status(400).json({ message })
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
