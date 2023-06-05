import {createRouter} from "next-connect";
import Layout from '@/app/layout'

import {getGoods} from "../../services";

export default function Good(props){
    const { goods } = props;

    function Category({good}) {
        return (
        <div>
            Categories: {good.Categories.map((category, i) => (
            <div className="inline-block px-1" key={i}>{category.text}</div>))}
        </div>
        );
    }

    return (
        <Layout>
            {goods.map((good, i) => (
                <div key={i}>
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                        Good: {good.title}
                        <br/>
                        {good.Categories.length ? <Category good={good} /> : null}

                    </div>
                </div>
            ))
            }
        </Layout>

    );
}



const router = createRouter()
    .get(async (req, res) => {
        const goods = await getGoods();
        if (!goods) {
            return { props: { notFound: true } };
        }
        return { props: {goods: JSON.parse(JSON.stringify(goods))} };
    });


export async function getServerSideProps({ req, res }) {
    return await router.run(req, res);
}




// export async function getServerSideProps(context) {
//   const goodsApi = await fetch('http://localhost:3000/api/goods');
//   const goods = await goodsApi.json();
//
//   return {
//     props: {
//       goods,
//     },
//   };
// }