import React, { useEffect,useState,useContext} from "react";
import SellerLayout from "../components/SellerLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ProfileSchema } from "../Validation/ProfileValidation";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import api from "../services/Api";

const SellerProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { 
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();    
      formData.append("name", profile.name);
      formData.append("phone_no", profile.phone);
      if (imageFile) {
        formData.append("image", imageFile);
      } 
      const res = await api.put("/profile/seller", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      login(res.data.user); // Update auth context with new user info
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
  if (user) {
    setProfile({
      name: user.name,
      email: user.email,
      phone: user.phone_no,
      role: user.role,
    });
  }
}, [user]);
  return (
    <SellerLayout>
      <div className="flex justify-center items-start w-full min-h-screen p-6 bg-gray-100 dark:bg-[#0d1117]">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage your Seller account information.
          </p>

          <div className="bg-white dark:bg-[#161b22] shadow rounded-lg p-6 max-w-3xl">
            {/* IMAGE */}
            <div className="flex items-center gap-6">
              <img
                src={
                  imagePreview ? imagePreview :
                  user?.image
                    ? `${process.env.REACT_APP_API_URL}${user.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full border shadow"
              />

              {editMode && (
                <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                  Change Photo
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* FORM */}
            <Formik
              initialValues={{
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
  }}
              validationSchema={ProfileSchema}
              enableReinitialize
              onSubmit={handleSave}
            >
              {({ values, handleChange }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    <div>
                      <label className="font-semibold">Full Name</label>

                      <Field
                        type="text"
                        name="name"
                        disabled={!editMode}
                        value={values.name}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 rounded border dark:bg-[#0d1117] dark:border-gray-700
${!editMode && "bg-gray-100 dark:bg-[#111]"}`}
                      />

                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Email</label>

                      <Field
                        type="email"
                        name="email"
                        disabled={!editMode}
                        value={values.email}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 rounded border dark:bg-[#0d1117] dark:border-gray-700
${!editMode && "bg-gray-100 dark:bg-[#111]"}`}
                      />

                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Phone Number</label>

                      <Field
                        type="text"
                        name="phone"
                        disabled={!editMode}
                        value={values.phone}
                        maxLength={10}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 rounded border dark:bg-[#0d1117] dark:border-gray-700
${!editMode && "bg-gray-100 dark:bg-[#111]"}`}
                      />

                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Role</label>

                      <input
                        disabled
                        value={profile.role || ""}
                        className="mt-1 w-full p-2 rounded border bg-gray-200 dark:bg-[#1b1f24]"
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProfile;
