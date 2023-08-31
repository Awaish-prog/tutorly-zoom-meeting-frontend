import React from 'react';
import "../CSS/TableComponent.css"

const TableComponent = ({ data }) => {

    const sessionData = {
        maple : {
            singleDuration: 35
        },
        lala: {
            singleDuration: 50
        }
    }

  return (
    <table className="custom-table">
      <thead>
        <tr className='first-row'>
            <th>Sr. No</th>
            <th>Date</th>
            <th>Title</th>
            <th>Status</th>
            <th>Student Name</th>
            <th>Duration</th>
            <th>Rate</th>
            <th>Single session duration</th>
            <th>Pay</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.date}</td>
            <td>{item.type}</td>
            <td>{item.labels ? item.labels[0].name : "Scheduled"}</td>
            <td>{item.firstName + " " + item.lastName}</td>
            <td>{item.duration} minutes</td>
            <td>{item.category.toLowerCase().includes("person") ? 50 : 25}</td>
            <td>{item.type.toLowerCase().includes("lala") ? 50
                : (item.type.toLowerCase().includes("maple tutoring") ? 35
                : 60)
            } minutes</td>
            <td>{((Number(item.duration) / Number(item.type.toLowerCase().includes("lala") ? 50 : (item.type.toLowerCase().includes("maple tutoring") ? 35 : 60))) * Number(item.category.toLowerCase().includes("person") ? 50 : 25)).toFixed(2) }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
