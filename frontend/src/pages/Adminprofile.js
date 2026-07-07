import React, { useEffect, useContext, useState } from "react";
import Layout from "../components/AdminLayout";
import { AuthContext } from "../Context/AuthContext";
import api from "../services/Api";
import { toast } from "react-toastify";

const AdminProfile = () => {
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

  // image upload preview

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // load user from context

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email|| "",
        phone: user.phone_no|| "",
        role: user.role|| "",
      });
    }
  }, [user]);

  // save

  const handleSave = async () => {
    
    if (
      profile.name === user.name &&
      profile.phone === user.phone_no &&
      !imageFile
    ) {
      toast.info("Noting changed");
      return;
    }

    const formData = new FormData();

    formData.append("name", profile.name);
    formData.append("phone_no", profile.phone);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const token=localStorage.getItem("admin_token");
      console.log("TOKEN:",token);
      const res = await api.put("/profile/admin", formData, {
        headers: {
          Authorization:`Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data.user);

      const Updateduser = {
        ...res.data.user,
        role: "admin",
      };

      localStorage.setItem("user", JSON.stringify(Updateduser));

      login(Updateduser);

      //window.location.reload();

      //setImageFile(null);
      //setImagePreview(null);

      toast.success("Admin profile updated");
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-start w-full min-h-screen p-6 bg-gray-100 dark:bg-[#0d1117]">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Profile
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage your admin account information.
          </p>

          <div className="bg-white dark:bg-[#161b22] shadow rounded-lg p-6">
            {/* IMAGE */}

            <div className="flex items-center gap-6">
              <img
  src={
    imagePreview
      ? imagePreview
      : user?.image
        ? `${process.env.REACT_APP_API_URL}${user.image}`
        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  }
  className="w-28 h-28 rounded-full border"
  alt=""
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

            <div className="grid grid-cols-2 gap-5 mt-6">
              <div>
                <label>Full Name</label>

                <input
                  name="name"
                  value={profile.name || ""}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  value={profile.email || ""}
                  disabled
                  className="w-full p-2 border rounded bg-gray-200"
                />
              </div>

              <div>
                <label>Phone</label>

                <input
                  name="phone"
                  value={profile.phone || ""}
                  disabled={!editMode}
                  maxLength={10}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label>Role</label>

                <input
                  value={profile.role || ""}
                  disabled
                  className="w-full p-2 border bg-gray-200"
                />
              </div>
            </div>

            {/* buttons */}

            <div className="mt-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
