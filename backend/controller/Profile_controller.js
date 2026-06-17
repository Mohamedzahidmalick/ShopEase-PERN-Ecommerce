const {
  updateUserProfileService,
  updateAdminProfileService,
} = require("../services/profile_services");



/* ================= USER ================= */

exports.updateProfile = async (req, res) => {

  try {

    const user_id = req.user.id;

    const { name, phone_no } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath =
        "/profile_uploads/" +
        req.file.filename;
    }

    const user =
      await updateUserProfileService(
        user_id,
        name,
        phone_no,
        imagePath
      );

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update failed",
    });

  }

};



/* ================= ADMIN ================= */

exports.updateAdminProfile = async (
  req,
  res
) => {

  try {

    const admin_id = req.user.id;

    const { name, phone_no } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath =
        "/profile_uploads/" +
        req.file.filename;
    }

    const admin =
      await updateAdminProfileService(
        admin_id,
        name,
        phone_no,
        imagePath
      );

    res.json({
      message: "Admin updated",
      user: {
        ...admin,
        role: "admin",
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update failed",
    });

  }

};