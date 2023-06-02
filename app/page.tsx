import {Sequelize} from "sequelize";


export default function Home() {

  const sequelize = new Sequelize('farm2cart', 'root', 'qwerty', {
    host: 'localhost',
    dialect: 'mysql'
  });

  sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });

  return (
    <div>
      Hi
    </div>
  );
}
