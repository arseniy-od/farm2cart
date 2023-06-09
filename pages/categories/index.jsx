import {createRouter} from "next-connect";
import {getCategories} from "../../services/category";
import Layout from '@/app/layout'


export default function Category(props){
  const { categories } = props;

  return (
      <Layout>
          {categories.map((category, i) => (
              <div key={i}>
                  <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                      Category: {category.text}
                  </div>
              </div>
          ))}
      </Layout>
  );
}


const router = createRouter()
    .get(async (req, res) => {
      const categories = await getCategories();
      if (!categories) {
        return { props: { notFound: true } };
      }
      return { props: {categories: JSON.parse(JSON.stringify(categories))} };
    });


export async function getServerSideProps({ req, res }) {
  return await router.run(req, res);
}