import * as awilix from 'awilix'

import entities, { IEntityContainer } from './models'
import ReduxStore from './store'

export interface IClientContextContainer extends IEntityContainer {
    redux: ReduxStore
}

const clientContainer = awilix.createContainer<IClientContextContainer>({
    injectionMode: awilix.InjectionMode.PROXY,
})

clientContainer.register({
    ...entities,
    redux: awilix.asClass(ReduxStore).singleton(),
})

export default clientContainer
