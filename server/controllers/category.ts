import {
    GetServerSidePropsContext,
    GetStaticPropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

import { NextApiRequestWithUser } from '@/app/types/interfaces'
import good from './good'

import session, { passportInit, passportSession } from '@/middleware/session'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import BaseController from './baseController'

import validate from '../validation/validator'
import { categorySchema } from '../validation/schemas'

@USE([session, passportInit, passportSession])
export default class CategoryController extends BaseController {
    private CategoryService = this.di.CategoryService
    private GoodService = this.di.GoodService

    @GET('/api/categories')
    async getCategories() {
        return await this.CategoryService.getCategories()
    }

    @POST('/api/categories')
    @USE(validate(categorySchema))
    async createCategory({ body }: NextApiRequestWithUser) {
        return body
        // return await this.CategoryService.createCategory(body)
    }

    @DELETE('/api/categories')
    async deleteCategory({ query }: NextApiRequestWithUser) {
        const id = query.id
        if (!id) {
            return { error: true, message: 'Category id not found' }
        }
        if (Array.isArray(id)) {
            return { error: true, message: 'Id must be integer, not array' }
        }
        return await this.CategoryService.deleteCategory(id)
    }

    @PATCH('/api/categories')
    @USE(validate(categorySchema))
    async updateCategory({ query, body }: NextApiRequestWithUser) {
        const id = query.id
        if (!id) {
            return { error: true, message: 'Category id not found' }
        }
        if (Array.isArray(id)) {
            return { error: true, message: 'Id must be integer, not array' }
        }
        return await this.CategoryService.updateCategory(id, body)
    }

    async getCategoriesWithGoods() {
        let categories = await this.CategoryService.getCategoriesWithGoods()
        categories = JSON.parse(JSON.stringify(categories))
        return { props: { data: categories } }
    }

    async getStaticPaths() {
        const paths = await this.CategoryService.getAllCategorySlugs()
        return {
            paths,
            fallback: false,
        }
    }

    async getCategoryWithGoods({
        params,
    }: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) {
        // const params = ctx.params
        if (!params) {
            console.error('No params at request')
            return { props: { category: { notFound: true } } }
        }
        const slug = params.slug
        if (!slug || slug instanceof Array) {
            console.error('No slug or slug is array')
            return { props: { category: { notFound: true } } }
        }

        const categoryData = await this.CategoryService.getCategoryByText(slug)
        const category = JSON.parse(JSON.stringify(categoryData))
        const goods: good[] = []

        // to avoid including a lot of models with functions and filtered attributes inside categories
        for (let good of category.goods) {
            goods.push(await this.GoodService.getGoodByIdExtended(good.id))
        }
        return { props: { data: { category, goods } } }
    }
}
