import React, {useState} from 'react'
import MOCK_DATA from '../Ranking/MOCK_DATA.json'
import '../Ranking/'

function Ranking() {
  const [data, setdata] = useState(MOCK_DATA);
  const [order, setorder] = useState("ASC");
  //sorting
  const sorting = (col) => {
    if(order === "ASC"){
      const sorted = [...data].sort((a,b) => 
      a[col].toLowerCase() > b[col].toLowerCase() ? 1: -1);
      setdata(sorted);
      setorder("DSC");
    }
    if(order === "DSC"){
      const sorted = [...data].sort((a,b) => 
      a[col].toLowerCase() < b[col].toLowerCase() ? 1: -1);
      setdata(sorted);
      setorder("ASC");
    }   
  }

  //searching
  const [query, setQuery] = useState("");
  return (
    <div className='container'>
      <div className='app'>
        <input type='text' placeholder='Search...' className='search' onChange={e => setQuery(e.target.value)}/>
      </div>
      <table>
        <thead>
          <th onClick = {() => sorting("first_name")}>FirstName</th>
          <th>Lastname</th>
          <th>Ingame</th>
          <th>Level</th>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key = {d.id}>
              <td>{d.first_name}</td>
              <td>{d.last_name}</td>
              <td>{d.ingame}</td>
              <td>{d.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Ranking;