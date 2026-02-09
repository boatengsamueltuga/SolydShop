/**
 * @file Dashboard - Admin dashboard overview page
 * @description
 * - Fetches analytics data on mount via the analyticsAction dispatch
 * - Displays three DashboardOverview metric cards: Total Products, Total Orders, Total Revenue
 * - Shows Loader while data is fetching and ErrorPage on failure
 * @usage App.jsx -- route `/admin` (index route inside AdminLayout)
 */
import React, { useEffect } from 'react'
import DashboardOverview from './DashboardOverview'
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux";
import ErrorPage from '../../shared/ErrorPage';
import Loader from '../../shared/Loader';
import { analyticsAction } from '../../../store/actions';


const Dashboard = () => {

  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

    const { analytics: { productCount, totalRevenue, totalOrders }
  } = useSelector((state) => state.admin);


  useEffect(() => {
    dispatch(analyticsAction());
  }, [dispatch]);

  if(isLoading){
    return <Loader />
  }

  if(errorMessage){
     return <ErrorPage message={errorMessage}/>;
  }
  return (
    <div>
     <div className='flex md:flex-row mt-8 flex-col lg:justify-between
      border border-slate-400 rounded-lg bg-linear-to-r
      from-blue-50 to-blue-100 shadow-lg'>
    <DashboardOverview
     title="Total Products"
     amount={productCount}
     Icon={FaBoxOpen}
     />

     <DashboardOverview
     title="Total Orders"
     amount={totalOrders}
     Icon={FaShoppingCart}
     />

     <DashboardOverview
     title="Total Revenue"
     amount={totalRevenue}
     Icon={FaDollarSign}
     revenue
     />
     </div>

    </div>
  )
}

export default Dashboard