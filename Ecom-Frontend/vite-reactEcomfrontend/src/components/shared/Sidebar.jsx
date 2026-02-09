/**
 * @file Admin/Seller sidebar navigation — role-aware vertical nav rendered inside AdminLayout.
 *
 * @description
 * - Renders `adminNavigation` (5 links) for ROLE_ADMIN or `sellerNavigation` (2 links) for ROLE_SELLER.
 * - Active link is highlighted using `classNames` based on current pathname.
 * - Displays "Admin Panel" or "Seller Panel" title depending on role.
 *
 * @param {Object}  props
 * @param {boolean} [props.isProfilelayout=false] — Reserved prop (currently unused).
 *
 * @usage AdminLayout.jsx — persistent sidebar in the admin panel.
 */
import React from 'react'
import { useSelector } from 'react-redux';
import { FaTachometerAlt } from "react-icons/fa";
import { adminNavigation, sellerNavigation } from '../../utils';
import { Link, useLocation } from 'react-router-dom';
import classNames from "classnames";

const Sidebar = ({isProfilelayout = false}) => {
    const pathName = useLocation().pathname;
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
     
    const sideBarLayout = isAdmin ? adminNavigation : sellerNavigation;

  return (
    <div className='flex grow flex-col gap-y-7 overflow-y-auto bg-custom-gradient px-6 pb-4'>
        <div className='flex h-16 shrink-0 gap-x-3 pt-2'>
             <FaTachometerAlt className='h-8 w-8 text-indigo-500' />
             <h1 className='text-white text-xl font-bold'>
                {isAdmin ? "Admin Panel" : "Seller Panel"} 
             </h1>
        </div>
         <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-4'>
                     {sideBarLayout.map((item) =>(
                        <li key={item.href}>
                            <Link
                            to={item.href}
                            className={classNames(
                                pathName === item.href
                                ? "bg-custom-blue text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}>

                                <item.icon className='text-2xl' />
                                {item.name}
                            </Link>
                        </li>
                     ))}
                </ul>
              </li>
            </ul>

         </nav>
        </div>
  )
}

export default Sidebar