/**
 * @file BackDrop — Semi-transparent fullscreen overlay.
 * @description
 * - Renders a fixed-position, half-opacity overlay covering the entire viewport.
 * - Accepts a `data` prop to offset the top position (below navbar when truthy).
 * - Used as a visual backdrop behind menus and mobile sidebars.
 * @param {boolean} data — When truthy, positions the overlay below the navbar (top-16); otherwise top-0.
 * @usage AdminLayout.jsx — mobile sidebar overlay; UserMenu.jsx — dropdown backdrop.
 */
import React from 'react'

const BackDrop = ({ data }) => {
  return (
    <div 
    className={`z-20 transition-all duration-200 opacity-50 w-screen h-screen bg-slate-200 fixed ${data ? "top-16" : "top-0"} left-0`}
    >
        
    </div>
  )
}

export default BackDrop