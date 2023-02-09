import React from "react";

import { IUser } from "../../types";

import styles from "./Card.module.css";

type CardProps = {
  userData: IUser;
  usersData: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
};

type SelectOptions = "name" | "surname" | "age" | "hobbies" | "work" | "phone";

export const Card: React.FC<CardProps> = ({
  userData,
  usersData,
  setUsers,
}) => {
  const findUserData = usersData.find((user) => user.id === userData.id);

  const [isEditMode, setIsEditMode] = React.useState<boolean>(false); // Включен ли мод редактирования
  const [editUserData, setEditUserData] = React.useState<IUser>(findUserData!); // Отредактированный объект юзера
  const [isHideCard, setIsHideCard] = React.useState<boolean>(false);
  const [choosenSelect, setChooseSelect] =
    React.useState<SelectOptions>("name"); // Выбранный select

  const onChangeSelect = (value: string) => {
    (value === "name" ||
      value === "surname" ||
      value === "age" ||
      value === "hobbies" ||
      value === "work" ||
      value === "phone") &&
      setChooseSelect(value);
  };

  const onChangeInputValue = (value: string) => {
    setEditUserData((prev) => {
      return {
        ...prev,
        [choosenSelect]: choosenSelect === "hobbies" ? value.split(",") : value,
      };
    });
  };

  const onClickSaveData = () => {
    const newUsersData = usersData.map((user) => {
      if (user.id !== userData.id) return user;

      return editUserData;
    });

    localStorage.setItem("UsersData", JSON.stringify(newUsersData));

    fetch(
      `https://63e27036ad0093bf29cff6e6.mockapi.io/Data/${editUserData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUserData),
      }
    );

    setIsEditMode(false);
    setEditUserData(editUserData);
  };

  const onClickDeleteCard = () => {
    const deleteCard: boolean = window.confirm(
      "Вы уверены, что хотите удалить публикацию?"
    );

    if (!deleteCard) return;

    const newUsersData = usersData.filter((user) => user.id !== userData.id);

    fetch(`https://63e27036ad0093bf29cff6e6.mockapi.io/Data/${userData.id}`, {
      method: "DELETE",
    });

    localStorage.setItem("UsersData", JSON.stringify(newUsersData));
    setUsers(newUsersData);
  };

  const selectOptions: SelectOptions[] = [
    "name",
    "surname",
    "age",
    "hobbies",
    "work",
    "phone",
  ];

  return (
    <>
      <div className={`${styles.card} ${isHideCard ? styles.hide : null}`}>
        <div
          className={`${styles.cardData} ${isHideCard ? styles.hide : null}`}
        >
          <div>
            <strong>Name: </strong> <span>{userData.name}</span>
          </div>
          <div>
            <strong>Surname: </strong> {userData.surname}
          </div>
          <div>
            <strong>Age: </strong> {userData.age}
          </div>
          <div>
            <strong>Hobbies: </strong>
            {userData.hobbies.map((hobbie, i) => {
              // Если элемент последний, выводим его без запятой и последующего пробела
              if (i === userData.hobbies.length - 1) {
                return <span key={i}>{hobbie}</span>;
              }
              return <span key={i}>{hobbie}, </span>;
            })}
          </div>
          <div>
            <strong>Work: </strong> {userData.work}
          </div>
          <div>
            <strong>Phone: </strong> {userData.phone}
          </div>
        </div>
        <div
          className={`${styles.editCard} ${isHideCard ? styles.hide : null}`}
        >
          {isEditMode ? (
            <div className={styles.editMode}>
              <select
                value={choosenSelect}
                onChange={(e) => {
                  onChangeSelect(e.target.value);
                }}
              >
                {selectOptions.map((item, i) => {
                  return (
                    <option key={i} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  );
                })}
              </select>
              <input
                value={editUserData[choosenSelect]}
                onChange={(e) => onChangeInputValue(e.target.value)}
              />
              <div className={styles.resetSaveBtns}>
                {/* Сбрасываем изменения */}
                <button
                  onClick={() => setEditUserData(findUserData!)}
                  className={styles.resetBtn}
                >
                  Сбросить
                </button>
                <button
                  onClick={() => onClickSaveData()}
                  className={styles.saveBtn}
                >
                  Сохранить
                </button>
              </div>
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className={styles.enoughBtn}
              >
                Перестать редактировать
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditMode((prev) => !prev)}
              className={styles.editDataBtn}
            >
              Редактировать данные
            </button>
          )}
        </div>
        <div className={styles.hideDeleteBtns}>
          <button onClick={() => onClickDeleteCard()}>✕</button>
          <button
            className={styles.hideCard}
            onClick={() => setIsHideCard((prev) => !prev)}
          >
            <svg
              fill="#000000"
              height="15px"
              width="15px"
              viewBox="0 0 330 330"
            >
              <path
                id="XMLID_2_"
                d="M325.607,304.394l-63.479-63.479c38.57-29.035,63.522-64.92,65.247-67.437c3.501-5.11,3.501-11.846,0-16.956 c-2.925-4.269-72.659-104.544-162.371-104.544c-25.872,0-50.075,8.345-71.499,20.313L25.607,4.394 c-5.857-5.858-15.355-5.858-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l63.478,63.478C29.299,118.12,4.35,154.006,2.625,156.523 c-3.5,5.109-3.5,11.845,0,16.955c2.925,4.268,72.65,104.546,162.378,104.546c25.868,0,50.069-8.345,71.493-20.314l67.897,67.898 C307.323,328.536,311.161,330,315,330c3.839,0,7.678-1.464,10.606-4.394C331.465,319.749,331.465,310.252,325.607,304.394z M165.003,81.977c60.26,0,113.408,60.338,131.257,83.022c-9.673,12.294-29.705,35.629-55.609,54.439L115.673,94.461 C131.079,86.902,147.736,81.977,165.003,81.977z M165.003,248.023c-60.285,0-113.439-60.364-131.273-83.037 c9.651-12.303,29.652-35.658,55.574-54.47l124.99,124.99C198.884,243.084,182.236,248.023,165.003,248.023z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
