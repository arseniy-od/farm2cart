export default function User(props){
  const { users } = props;

  return users.map((user, i) => {
    return (
        <div key={i}>{user.username}</div>
    );
  });
}


export async function getServerSideProps(context) {
  const usersApi = await fetch('http://localhost:3000/api/users');
  const users = await usersApi.json();

  return {
    props: {
      users,
    },
  };
}