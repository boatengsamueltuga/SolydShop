/**
 * @file Slide-in side panel modal — reusable HeadlessUI Dialog that slides from the right.
 *
 * @description
 * - Panel slides in from the right edge, max-width 800px, full height with scroll.
 * - Displays a title bar with close (X) button, then renders `children` below.
 * - Used for create/edit forms throughout the admin panel and checkout flow.
 *
 * @param {Object}   props
 * @param {boolean}  props.open     — Controls panel visibility.
 * @param {Function} props.setOpen  — Callback to close the panel.
 * @param {ReactNode} props.children — Content rendered inside the panel body.
 * @param {string}   [props.title=""] — Panel header text.
 *
 * @usage AdminProducts, Category, Sellers, AddressInfo — wraps add/edit forms.
 */
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { RxCross1 } from "react-icons/rx";

function Globalmodal({ open , setOpen, children , title = ""}) {
  //let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data:closed:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className='fixed inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
               <DialogPanel transition
               className='pointer-events-auto relative w-screen max-w-[800px] transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700'>
                <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-2xl'>
                   <div className='px-4 sm:px-6'>
                     <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                        {/* Panel Title */}
                     </DialogTitle>
                   </div>
                   <div className='relative mt-6 flex-1 p-8'>
                       <div className='border-b pb-8 flex justify-between'>
                        <h1 className='font-montserrat font-bold text-slate-800 text-2xl pt-4'>{title}</h1>
                         <button onClick={() => setOpen(false)}>
                          <RxCross1 className='text-slate-800 text-2xl'/>
                         </button>
                       </div>
                       {children}
                   </div>
                </div>
               </DialogPanel>
            </div>
        </div>
        </div>
      </Dialog>
    </>
  )
}
export default Globalmodal;