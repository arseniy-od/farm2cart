import { createRouter } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import container from '@/server/container'

export default container.resolve('CompanyController').handler('/api/companies')
