import {createRouter} from "next-connect";
import {getCompanies} from "../../services";

export default function Company(props){
  const { companies } = props;

  return companies.map((company, i) => {
    return (
        <div key={i}>{company.name}</div>
    );
  });
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



// export async function getServerSideProps(context) {
//   const companiesApi = await fetch('http://localhost:3000/api/companies');
//   const companies = await companiesApi.json();
//
//   return {
//     props: {
//       companies,
//     },
//   };
// }