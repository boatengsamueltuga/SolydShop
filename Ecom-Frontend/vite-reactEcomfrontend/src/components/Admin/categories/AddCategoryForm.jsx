/**
 * @file AddCategoryForm - Category name form (add/update)
 * @description
 * - Uses react-hook-form with a single InputField for the category name
 * - In add mode, dispatches createCategoryDashboardAction
 * - In update mode, pre-fills the name from the category prop and dispatches updateCategoryDashboardAction
 * - Cancel and Save/Update buttons with loading state
 * @param {Object} props
 * @param {Object} [props.category] - Category object for edit mode (null for add mode)
 * @param {boolean} [props.update=false] - Whether the form is in update mode
 * @param {Function} props.setOpen - Callback to close the parent modal
 * @param {boolean} props.open - Loading state flag (disables buttons when true)
 * @usage Category.jsx -- rendered inside Globalmodal for add/edit category
 */
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createCategoryDashboardAction, updateCategoryDashboardAction } from "../../../store/actions";
import { useEffect } from "react";
import InputField from "../../shared/InputField";
import toast from "react-hot-toast";


const AddCategoryForm = ({ setOpen, open, category, update = false }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const addNewCategoryHandler = (data) => {
    if (!update) {
      //dispatch createCategoryDashboardAction
      dispatch(createCategoryDashboardAction(data, setOpen, reset, toast));
    } else {
      //dispatch updateCategoryDashboardAction
      dispatch(
        updateCategoryDashboardAction(data, setOpen, category.id, reset, toast)
      );
    }
  };
  useEffect(() => {
    if (update && category) {
      setValue("categoryName", category?.categoryName);
    }
  }, [update, category]);

  return (
    <div className="py-5 relative h-full ">
      <form
        className="space-y-4 "
        onSubmit={handleSubmit(addNewCategoryHandler)}
      >
        <div className="flex md:flex-row flex-col gap-4 w-full ">
          <InputField
            label="Category Name"
            required
            id="categoryName"
            type="text"
            message="This field is required*"
            placeholder="Category Name"
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex  w-full justify-between items-center absolute bottom-14">
          <button
            disabled={open}
            onClick={() => setOpen(false)}
            type="button"
            className={`border border-borderColor rounded-[5px] font-metropolis  text-textColor py-[10px] px-4 text-sm font-medium`}
          >
            Cancel
          </button>
          <button
            disabled={open}
            type="submit"
            className={`font-metropolis rounded-[5px]  bg-custom-blue hover:bg-blue-800 text-white  py-[10px] px-4 text-sm font-medium`}
          >
            {open ? "Loading.." : update ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;