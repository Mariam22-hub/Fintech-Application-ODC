const router = require("express").Router();

const {

    getChildProducts,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,

} = require ("../controllers/productController");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").get(getChildProducts).put(updateProduct).delete(deleteProduct);

module.exports = router;