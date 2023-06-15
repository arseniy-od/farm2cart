import BaseContext from "../baseContext"

export default class CategoryService extends BaseContext {
    private Good = this.di.Good;
    private User = this.di.User;
    private Category = this.di.Category;

    async getCategoryByText(text:string) {
        return await this.Category.findOne(
            {
                where: {text},
                include: [
                    {
                        model: this.Good,
                        include : [
                            {model: this.User, as: "seller"},
                            {model: this.Category, as: "Categories"}
                        ]
                    }
                ]
            })
    }
    
    
    async getAllCategorySlugs() {
        const categories = await this.Category.findAll()
        return categories.map(category => {
            return {
                params: {
                slug: category.text.toLowerCase()
            }}
        })    
    }
    
    
    async getCategories() {
        return (
            await this.Category.findAll({
                include: [
                    {
                        model: this.Good,
                    }
                ]
            })
        );
    }
    
    async createCategory(categoryData) {
        return await this.Category.create(categoryData);
    }
    
    async deleteCategory(id) {
        return await this.Category.destroy({where: { id }})
    }
    
    async updateCategory(id, categoryData) {
        const category = await this.Category.findOne({where: {id}})
        if (!category) {
            return {error: true, message: "Category not found"}
        }
        return await category.update(categoryData)
    }
}