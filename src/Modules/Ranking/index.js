import React, { useEffect, useState } from "react";
import { data } from "./users";
import "./table.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import { LEVEL_MINE } from "../StartGame/constants";

function Ranking() {
  const [users, setUsers] = useState([]);
  const [sorted, setSorted] = useState({ sorted: "id", reversed: false });
  const [searchPhase, setSearchPhase] = useState("");

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("listUserPlay"));
    setUsers(list);
  }, []);
  console.log("users", users);

  const sortByPoint = () => {
    setSorted({ sorted: "point", reversed: !sorted.reversed });
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) => {
      if (sorted.reversed) {
        return user1.point - user2.point;
      }
      return user2.point - user1.point;
    });
    setUsers(usersCopy);
  };

  const sortByName = () => {
    setSorted({ sorted: "name", reversed: !sorted.reversed });
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) => {
      const fullnameA = `${user1.user}`
      const fullnameB = `${user2.user}`

      if (sorted.reversed) {
        return fullnameB.localeCompare(fullnameA);
      }
      return fullnameA.localeCompare(fullnameB);
    });
    setUsers(usersCopy);
  };

  const search = (event) => {
    const matchedUsers = users.filter((user) => {
      return `${user.user}`
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setUsers(matchedUsers);
    setSearchPhase(event.target.value);
  };

  const renderArrow = () => {
    if (sorted.reversed) {
      return <FaArrowUp />;
    }
    return <FaArrowDown />;
  };

  const renderUser = () => {
    return users?.map((user) => {
      return (
        <tr>
          <td>{user.id}</td>
          <td>{user.user}</td>
          <td>{user.point}</td>
          <td>
            {LEVEL_MINE?.find((item) => item.value === user.level)?.label}
          </td>
        </tr>
      );
    });
  };

  /*const renderPlayer = () => {
    let listCreate = localStorage.getItem("listUserPlay") ? JSON.parse(localStorage.getItem("listUserPlay")) : []
    let table = `<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Points</th>
    <th>Level</th>
    </tr>`

    listCreate.map(data, index => {
       table += `<tr>
      <td>${index + 1 }</td>
      <td>${data.user}</td>
      <td>${data.point}</td>
      <td>${data.level}</td>
      </tr>`
    });
    document.getElementById('tableContent').innerHTML = table;
  }

  return(
    <div className="container">
      <table className="table-container" id='tableContent'>
        {renderPlayer()}
      </table>
    </div>
  )*/

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchPhase}
          onChange={search}
        />
      </div>
      <div className="table-container">
        <table id="crudTable">
          <thead>
            <tr>
              <th>
                <span>Id</span>
              </th>
              <th onClick={sortByName}>
                <span style={{ marginRight: 10 }}>Name</span>
                {sorted.sorted === "name" ? renderArrow() : null}
              </th>
              <th onClick={sortByPoint}>
                <span style={{ marginRight: 10 }}>Point</span>
                {sorted.sorted === "point" ? renderArrow() : null}
              </th>
              <th>
                <span>Level</span>
              </th>
            </tr>
          </thead>
          <tbody>{renderUser()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Ranking;
