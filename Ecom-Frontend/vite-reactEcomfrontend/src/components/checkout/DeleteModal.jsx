/**
 * @file Address delete confirmation modal — centered dialog for confirming address deletion.
 *
 * @param {Object}   props
 * @param {boolean}  props.open            — Controls dialog visibility.
 * @param {Function} props.setOpen         — Callback to close the dialog.
 * @param {Function} props.onDeleteHandler — Called when the user confirms deletion.
 * @param {boolean}  [props.loader=false]  — Disables buttons and shows "Deleting..." when true.
 *
 * @usage AddressInfo.jsx — triggered by the delete button on an address card.
 */
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import React from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

const DeleteAddressModal = ({
  open,
  setOpen,
  onDeleteHandler,
  loader = false,
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/50" />

      {/* Centered container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md mx-auto transform overflow-hidden bg-white rounded-lg shadow-xl transition-all">

          {/* Close icon */}
          <div className="absolute right-4 top-3">
            <button onClick={() => setOpen(false)} type="button">
              <FaTimes className="text-slate-700" size={22} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 text-center">
            <div className="flex justify-center mb-4">
              <FaTrash className="text-red-600" size={40} />
            </div>

            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete Address
            </DialogTitle>

            <Description className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this address?  
              This action cannot be undone.
            </Description>

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onDeleteHandler}
                disabled={loader}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loader ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteAddressModal;
