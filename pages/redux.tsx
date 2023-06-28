import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Layout from '@/app/layout'
// import store from '@/redux/main'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export default function Home() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user)

    function handleUser() {
        dispatch({ type: 'user/fetch_request' })
    }

    return (
        <Layout>
            <button onClick={handleUser} className="bg-gray-200">
                fetch user
            </button>
            <div>User: {user.username}</div>
        </Layout>
    )
}
