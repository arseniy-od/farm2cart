import {createRouter} from "next-connect";
import {getCategories} from "../../services";

export default function Category(props){
  const { categories } = props;

  return categories.map((category, i) => {
    return (
        <div key={i}>{category.text}</div>
    );
  });
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