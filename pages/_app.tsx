import '../app/globals.css'
import { AppProps } from 'next/app'
import { FC } from 'react'
import { Provider } from 'react-redux'

import { clientDi } from '@/redux/container'

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
    const { store, props } = clientDi('redux').wrapper.useWrappedStore(rest)
    const { pageProps } = props
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp
// function MyApp({ Component, pageProps }: AppProps) {
//     return <Component {...pageProps} />
// }

// export default clientContainer.resolve('redux').wrapper.withRedux(MyApp)
