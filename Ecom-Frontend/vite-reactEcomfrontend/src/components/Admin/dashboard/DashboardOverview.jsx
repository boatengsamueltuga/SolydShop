/**
 * @file DashboardOverview - Single metric card for the admin dashboard
 * @description
 * - Displays a title, a numeric value, and an icon in a styled card layout
 * - When the `revenue` flag is true, formats the value with K/M/B abbreviation via formatRevenue
 * - Supports any react-icons icon passed via the Icon prop
 * @param {Object} props
 * @param {string} props.title - The metric label (e.g. "Total Products")
 * @param {number} props.amount - The numeric value to display
 * @param {React.ComponentType} props.Icon - A react-icons icon component
 * @param {boolean} [props.revenue=false] - Whether to format the value as currency with abbreviation
 * @usage Dashboard.jsx -- one card rendered per metric (products, orders, revenue)
 */
import React from 'react'
import { formatRevenue } from '../../../utils/formatPrice'

const DashboardOverview = ({title, amount, Icon, revenue = false}) => {

    const convertedAmount = revenue ? Number(amount).toFixed(2) : amount
  return (
    <div className='xl:w-80 w-full space-y-4 text-center md:text-start px-5 py-8'>
        <div className='flex md:justify-start justify-center items-center gap-2'>
           <h3 className='uppercase text-2xl text-slate-700 font-semibold'>{title}</h3>
           <Icon className='text-slate-800 text-2xl'/>
        </div>
        
        <h1 className='font-bold text-slate-800 text-3xl'>
          {revenue ? "$" : null}
          {revenue ? formatRevenue(convertedAmount) : convertedAmount}
        </h1>
    </div>
  )
}

export default DashboardOverview