import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import { App } from '/imports/ui/App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Index } from '../imports/ui/App';

import "./main.css"

Meteor.startup(() => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index/>,
    },
  ])

  render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
    document.getElementById('react-target'),
  )
})
