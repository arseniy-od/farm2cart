import BaseContext from '../baseContext'

export default class CategoryService extends BaseContext {
    private Good = this.di.Good
    private User = this.di.User
    private Category = this.di.Category

    async getCategoryByText(slug?: string | string[]) {
        if (!slug || slug instanceof Array) {
            return { error: true, message: 'No slug or slug is array' }
        }
        return await this.Category.findOne({
            where: { text: slug },
            attributes: ['id', 'text'],
            // include: [
            //     {
            //         model: this.Good,
            //         attributes: ['id'],
            //         through: { attributes: ['id', 'goodId', 'categoryId'] },
            //         where: { active: 1 },
            //         // include : [
            //         //     {model: this.User, as: "seller"},
            //         //     {model: this.Category, as: "categories"}
            //         // ]
            //     },
            // ],
        })
    }

    async getAllCategorySlugs() {
        const categories = await this.Category.findAll()
        return categories.map((category) => {
            return {
                params: {
                    slug: category.text.toLowerCase(),
                },
            }
        })
    }

    async getCategories() {
        return await this.Category.findAll()
    }

    async getCategoriesWithGoods() {
        return await this.Category.findAll({
            include: [
                {
                    model: this.Good,
                    through: { attributes: ['id', 'goodId', 'categoryId'] },
                },
            ],
        })
    }

    async createCategory(categoryData: { text: string }) {
        return await this.Category.create(categoryData)
    }

    async deleteCategory(id?: string | string[]) {
        if (!id) {
            return { error: true, message: 'Category id not found' }
        }
        if (Array.isArray(id)) {
            return { error: true, message: 'Id must be integer, not array' }
        }
        return await this.Category.destroy({ where: { id } })
    }

    async updateCategory(
        categoryData: { text: string },
        id?: string | string[]
    ) {
        if (!id) {
            return { error: true, message: 'Category id not found' }
        }
        if (Array.isArray(id)) {
            return { error: true, message: 'Id must be integer, not array' }
        }
        const category = await this.Category.findOne({ where: { id } })
        if (!category) {
            return { error: true, message: 'Category not found' }
        }
        return await category.update(categoryData)
    }
}
