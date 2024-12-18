import React, { useEffect, useState } from 'react'
import { GetAllTheatres, UpdateTheatre } from '../../apicalls/theatres';
import { useDispatch, useSelector } from "react-redux";
import { Hideloading, Showloading } from '../../redux/loadersSlice';
import { message, Table } from "antd";


function TheatresList() {

  const [theatres = [], setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(Showloading())
      const response = await GetAllTheatres({

      })
      if (response.success) {
        setTheatres(response.data)
      } else {
        message.error(response.message)
      }
      dispatch(Hideloading())
    } catch (error) {
      dispatch(Hideloading())
      message.error(error.message)
    }
  }

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(Showloading());
      const response = await UpdateTheatre({
        theatreId: theatre._id,
        ...theatre,
        isActive: !theatre.isActive,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(Hideloading());
    } catch (error) {
      dispatch(Hideloading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Address",
      dataIndex: "address"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        if (text) {
          return "Approved";
        } else {
          return "Pending/Blocked";
        }
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isActive && <span className='underline' onClick={() => handleStatusChange(record)} >Block</span>}
            {!record.isActive && <span className='underline' onClick={() => handleStatusChange(record)} >Approve</span>}
          </div>
        )
      }
    }
  ]


  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div>
        <Table columns={columns} dataSource={theatres} />
      </div>
    </>
  )
}

export default TheatresList