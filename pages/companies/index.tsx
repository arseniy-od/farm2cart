import {createRouter} from "next-connect";

import Layout from '@/app/layout'
import container from '@/server/container'
import { CompanyProps } from "@/app/interfaces";
import { NextApiRequest, NextApiResponse } from "next";


export default function Company(props: CompanyProps){
  const { companies } = props;
  if (props.notFound) {
    return (
      <Layout>
        <div>
          Companies not found
        </div>
      </Layout>
    )
  }

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
      const companies = await container.resolve("CompanyService").getCompanies();
      if (!companies) {
        return { props: { notFound: true } };
      }
      return { props: {companies: JSON.parse(JSON.stringify(companies))} };
    });


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
  return await router.run(req, res);
}
