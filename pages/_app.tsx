import '../app/globals.css'
import { AppProps } from 'next/app'
import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from 'react-redux'
import { wrapper } from '@/redux/store'

function MyApp({ Component, pageProps }: AppProps) {
    const store: any = useStore()
    return (
        // <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        <Component {...pageProps} />
        // </PersistGate>
    )
}

export default wrapper.withRedux(MyApp)
