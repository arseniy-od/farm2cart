import '../app/globals.css'
import { AppProps } from 'next/app'

import clientContainer from '@/redux/container'

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default clientContainer.resolve('redux').wrapper.withRedux(MyApp)
