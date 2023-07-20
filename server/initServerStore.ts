import { IControllerContainer } from '@/server/controllers'

type ControllerType = IControllerContainer[keyof IControllerContainer]

export default function initServerStore(
    controllers: ControllerType | ControllerType[],
    url: string
) {
    return (store) => async (ctx) => {
        if (controllers instanceof Array) {
            for (let controller of controllers) {
                await controller.run(ctx, store, url)
            }
        } else {
            await controllers.run(ctx, store, url)
        }

        return {
            props: {
                query: ctx?.query || {},
                params: ctx?.params || {},
            },
        }
    }
}
