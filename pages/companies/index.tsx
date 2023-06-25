import { createRouter } from 'next-connect'

import Layout from '@/app/layout'
import container from '@/server/container'
import { CompanyProps } from '@/app/interfaces'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

export default function Company({ data }: CompanyProps) {
    const companies = data
    if (data.notFound) {
        return (
            <Layout>
                <div>Companies not found</div>
            </Layout>
        )
    }

    return (
        <Layout>
            {companies.map((company, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                        Company: {company.name}
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    return await container.resolve('CompanyController').run(ctx)
}
