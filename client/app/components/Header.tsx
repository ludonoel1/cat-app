import React from 'react'
import './Header.css';

function Header() {
  return (
      <nav className="inline-flex items-center justify-between flex-wrap bg-teal-500 p-6 w-full">
        <img src="/cat-logo.webp"/>
        <div className="flex items-center justify-center flex-1 text-white mr-6">
            <span className="font-semibold text-xl center tracking-tight">Cat Collection</span>
        </div>
    </nav>
  )
}

export default Header