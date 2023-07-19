import Layout from '@/app/layout'
import Link from 'next/link'
import { formatDate, isEmpty, toTitle } from '@/app/utils'
import { useAppSelector } from '@/redux/hooks'
import ErrorMessage from '@/app/components/errorMessage'

export default function User() {
    const user = useAppSelector((state) => state.user)

    if (Object.keys(user).length === 0) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">You are not logged in</h2>
            </Layout>
        )
    }

    if (!user || isEmpty(user)) {
        return (
            <Layout>
                <ErrorMessage message="You are not logged in" />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="ml-4 max-w-xs">
                <div className="mt-4 px-4 py-3 text-lg bg-gray-100 shadow-lg">
                    <div className="text-indigo-500">@{user.username}</div>
                    <p>
                        {toTitle(user.firstName || '')}{' '}
                        {toTitle(user.lastName || '')}
                    </p>
                    <p>{user.email}</p>
                    <p>
                        Registration date:{' '}
                        {formatDate(user.registrationDate || '')}
                    </p>
                </div>

                <div className="mx-4 mt-3 flex justify-between">
                    {user.role === 'seller' || 'admin' ? (
                        <Link
                            className="mt-2 px-4 py-3 block w-32 bg-gray-100 shadow-lg"
                            href="/users/me/goods"
                        >
                            My products
                        </Link>
                    ) : null}
                    <Link
                        className="mt-2 px-4 py-3 block w-32 bg-gray-100 shadow-lg"
                        href="/orders"
                    >
                        My orders
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
