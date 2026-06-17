const {
  addWishlistService,
  removeWishlistService,
  getWishlistService
} = require("../services/wishlist_services");

exports.addToWishlist = async (req, res) => {
  try {

    const buyer_id = req.user.id;
    const { product_id } = req.body;

    await addWishlistService(buyer_id, product_id);

    res.json({ message: "Added to wishlist" });

  } catch (error) {

    res.status(500).json({ message: "Failed to add wishlist" });

  }
};


exports.removeFromWishlist = async (req, res) => {

  try {

    const buyer_id = req.user.id;
    const { product_id } = req.params;

    await removeWishlistService(buyer_id, product_id);

    res.json({ message: "Removed from wishlist" });

  } catch {

    res.status(500).json({ message: "Failed to remove wishlist" });

  }

};


exports.getWishlist = async (req, res) => {

  try {

    const buyer_id = req.user.id;

    const wishlist = await getWishlistService(buyer_id);

    res.json(wishlist);

  } catch {

    res.status(500).json({ message: "Failed to fetch wishlist" });

  }

};