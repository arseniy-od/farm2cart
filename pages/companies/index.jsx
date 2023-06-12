import {createRouter} from "next-connect";
import {getCompanies} from "@/services/company";
import Layout from '@/app/layout'


export default function Company(props){
  const { companies } = props;

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
  );
}


const router = createRouter()
    .get(async (req, res) => {
      const companies = await getCompanies();
      if (!companies) {
        return { props: { notFound: true } };
      }
      return { props: {companies: JSON.parse(JSON.stringify(companies))} };
    });


export async function getServerSideProps({ req, res }) {
  return await router.run(req, res);
}
