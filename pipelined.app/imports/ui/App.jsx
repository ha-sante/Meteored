import React, { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { Mongo, MongoInternals } from 'meteor/mongo'
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data'
import { TrashIcon } from '@radix-ui/react-icons'

import { PipelinesCollection } from '../api/list'

export const Index = () => {
  const [pipeline, setPipeline] = useState()
  const [list, setList] = useState([])
  // const subscription = useFind(() => PipelinesCollection.find())

  const CreatePipeline = () => {
    if (pipeline?._id) {
      Meteor.call('todos.update', { ...pipeline }, (err, res) => {
        if (err) {
          alert(err)
        } else {
          // success!
          alert('Update Success')
          console.log('todos.update', res)
          setList(res)
          setPipeline()
        }
      })
    } else {
      Meteor.call(
        'todos.create',
        {
          title: pipeline?.title,
        },
        (err, res) => {
          if (err) {
            alert(err)
          } else {
            // success!
            alert('Create Success')
            console.log('todos.create', res)
            setList(res)
            setPipeline()
          }
        },
      )
    }
  }

  const DeletePipeline = (id) => {
    Meteor.call(
      'todos.delete',
      {
        id,
      },
      (err, res) => {
        if (err) {
          alert(err)
        } else {
          // success!
          alert('Delete Success')
          console.log('todos.delete', res)
          setList(res)
          setPipeline()
        }
      },
    )
  }

  useEffect(() => {
    Meteor.call('todos.get', { }, (err, res) => {
      if (err) {
        alert(err)
      } else {
        console.log('todos.get', res)
        setList(res)
        setPipeline()
      }
    })
  }, [])

  return (
    <div className="border text-center self-center min-h-screen bg-blue-100 flex items-top justify-start pt-10 flex-col polka">
      <div className="pt-5 w-full lg:w-[50%] mx-auto">
        <div className="flex flex-col lg:w-[70%] mx-auto p-5">
          <div className="flex flex-row w-[100%] mx-auto mt-5 items-center justify-between">
            <div className="w-[50%] text-right flex justify-start items-center">
              <h2 className="text-3xl font-bold">Pipelined</h2>
            </div>
            <button
              className="border p-2 pr-3 pl-3 bg-red-300 text-white rounded"
              onClick={() => {
                pipeline == null
                  ? setPipeline({
                      title: '',
                    })
                  : setPipeline()
              }}
            >
              {pipeline == null ? 'New Pipeline' : 'Cancel'}
            </button>
          </div>

          {pipeline != null && (
            <div className="p-2 border rounded bg-red-300 mt-3">
              <input
                type="text"
                className="p-3 w-[100%] bg-red-300 border-red-200 border-b focus:outline-none text-white placeholder-slate-100"
                placeholder="Press enter to add"
                value={pipeline?.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    console.log('Enter key pressed')
                    CreatePipeline()
                  }
                }}
                onChange={(e) => {
                  let value = e.target.value
                  setPipeline({ ...pipeline, title: value })
                }}
              />
            </div>
          )}

          <div className="w-[100%] mx-auto mt-2">
            {list.map((section, index) => {
              return (
                <div
                  key={index}
                  className="mb-2 mt-2 rounded text-start pt-3 pb-3 pr-5 pl-5  border bg-white flex justify-between align-middle items-center"
                >
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      setPipeline(section)
                    }}
                  >
                    {section.title}
                  </p>
                  <span
                    onClick={() => {
                      DeletePipeline(section._id)
                    }}
                    className="cursor-pointer"
                  >
                    <TrashIcon />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
