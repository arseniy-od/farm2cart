import {createRouter} from "next-connect";
import Link from "next/link";

import Layout from '@/app/layout'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from "next";


export default function Category(props: {categories: {id: number, text: string}[]}){
  const { categories } = props;

  return (
      <Layout>
          {categories.map((category, i) => (
              <div key={i}>
                  <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                      <Link href={"/categories/" + category.text.toLowerCase()}>
                        Category: {category.text}
                      </Link>
                      
                  </div>
              </div>
          ))}
      </Layout>
  );
}


const router = createRouter()
    .get(async (req, res) => {
      const categories = await container.resolve("CategoryService").getCategories();
      if (!categories) {
        return { props: { notFound: true } };
      }
      return { props: {categories: JSON.parse(JSON.stringify(categories))} };
    });


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
  return await router.run(req, res);
}