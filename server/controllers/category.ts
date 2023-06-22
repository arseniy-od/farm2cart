import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import BaseContext from '../baseContext'
import { ParsedUrlQuery } from 'querystring'
import good from './good'

export default class CategoryController extends BaseContext {
    private CategoryService = this.di.CategoryService
    private GoodService = this.di.GoodService

    async getCategories() {
        const result = await this.CategoryService.getCategories()
        const categories = JSON.parse(JSON.stringify(result))
        if (!categories || !categories.length) {
            return { notFound: true }
        }
        return { categories }
    }

    async getCategoriesWithGoods() {
        const result = await this.CategoryService.getCategoriesWithGoods()
        const categories = JSON.parse(JSON.stringify(result))
        if (!categories || !categories.length) {
            return { notFound: true }
        }
        return { categories }
    }

    async getStaticPaths() {
        const paths = await this.CategoryService.getAllCategorySlugs()
        return {
            paths,
            fallback: false,
        }
    }

    async getCategoryWithGoods(
        ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    ) {
        const params = ctx.params
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
        console.log('=====================')
        console.log(category)

        const goods: good[] = []
        for (const good of category.goods) {
            goods.push(await this.GoodService.getGoodById(good.id))
        }
        return { category, goods }
    }
}
