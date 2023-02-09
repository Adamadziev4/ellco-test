import React from "react";
import { Card } from "../../components/Card";
import { IUser } from "../../types";

import styles from "./Main.module.css";

export const Main: React.FC = () => {
  const [users, setUsers] = React.useState<IUser[]>([]);

  const getUsersData = async () => {
    const res = await fetch("https://63e27036ad0093bf29cff6e6.mockapi.io/Data");
    const json: IUser[] = await res.json();

    const data = await json.map((userData) => {
      return {
        ...userData,
        id: Number(userData.id),
      };
    });

    localStorage.setItem("UsersData", JSON.stringify(data));
    setUsers(data);
  };

  const usersDataJson = localStorage.getItem("UsersData");
  const usersData: IUser[] =
    usersDataJson !== null && JSON.parse(usersDataJson);

  React.useEffect(() => {
    getUsersData();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.getDataBtn} onClick={() => getUsersData()}>
        <button>Получить новые данные</button>
      </div>
      <div className={styles.usersCards}>
        {usersData &&
          usersData.map((userData, i) => (
            <Card
              key={i}
              userData={userData}
              usersData={usersData}
              setUsers={setUsers}
            />
          ))}
      </div>
    </div>
  );
};
