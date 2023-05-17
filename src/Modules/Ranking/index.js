import React, {useState} from 'react'
import {data} from './users'
import "./table.css"
import {FaArrowUp, FaArrowDown} from "react-icons/fa"

function Ranking() {
  const [users, setUsers] = useState(data);
  const [sorted, setSorted] = useState({sorted: "id", reversed: false});
  const [searchPhase, setSearchPhase] = useState("");

  const sortById =() => {
    setSorted({sorted: "id", reversed: !sorted.reversed});
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) =>{
      if(sorted.reversed){
        return user1.id - user2.id;
      }
      return user2.id - user1.id;
    });
    setUsers(usersCopy);
  };

  const sortByName =() => {
    setSorted({sorted: "name", reversed: !sorted.reversed});
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) =>{
      const fullnameA = `${user1.first_name} ${user2.last_name}`;
      const fullnameB = `${user2.first_name} ${user1.last_name}`;

      if (sorted.reversed){
        return fullnameB.localeCompare(fullnameA);
      }
      return fullnameA.localeCompare(fullnameB);
    });
    setUsers(usersCopy);
  };

  const search = (event) => {
    const matchedUsers = data.filter((user) => {
      return`${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(event.target.value.toLowerCase());
    });
    setUsers(matchedUsers);
    setSearchPhase(event.target.value);
  }

  const renderUser = () => {
    return users.map((user) => {
      return (
        <tr>
            <td>{user.id}</td>
            <td>{ `${user.first_name} ${user.last_name}` }</td>
            <td>{user.ingame}</td>
            <td>{user.level}</td>
        </tr>
      );
    });
  };

  const renderArrow = () => {
    if (sorted.reversed){
      return <FaArrowUp/>
    }
    return <FaArrowDown/>
  };

  return (
    <div className="app">
      <div className="search-container">
        <input 
        type = "text" 
        placeholder="Search..." 
        value = {searchPhase} 
        onChange={search}/>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={sortById}>
                <span style={{marginRight: 10}}>Id</span>
                {sorted.sorted === "id" ? renderArrow() : null}
              </th>
              <th onClick={sortByName}>
                <span style={{marginRight: 10}}>Name</span>
                {sorted.sorted === "name" ? renderArrow() : null}
              </th>
              <th>
                <span>Ingame</span>
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
  )
}

export default Ranking;