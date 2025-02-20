import React, { useState } from 'react';

const Row = ({ data, onDelete, onEdit }) => (
  <tr>
    <td>{data.id}</td>
    <td>{data.name}</td>
    <td>{data.age}</td>
    <td>
      <button onClick={() => onEdit(data.id)}>Edit</button>
      <button onClick={() => onDelete(data.id)}>Delete</button>
    </td>
  </tr>
);

const DataTable = ({ rows, onDelete, onEdit }) => (
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Action  sdads</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <Row key={row.id} data={row} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </tbody>
  </table>
);


const EditableTable = () => {
    const [data, setData] = useState([
      { id: 1, name: 'John Doe', age: 25 },
      { id: 2, name: 'Jane Doe', age: 30 },
      // ... other rows
    ]);
  
    const handleDelete = (id) => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    };
  
    const handleEdit = (id) => {
      // Implement edit functionality
      //console.log(`Editing row with ID: ${id}`);
    };
  
    const handleAdd = () => {
      // Implement add functionality
      const newRow = { id: data.length + 1, name: 'New Person', age: 25 };
      setData((prevData) => [...prevData, newRow]);
    };
  
    return (
      <div>
        <h1>Data Table</h1>
        <button onClick={handleAdd}>Add Row</button>
        <DataTable rows={data} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    );
  };
  
  export default EditableTable;
