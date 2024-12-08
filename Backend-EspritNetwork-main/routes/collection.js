const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");

router.get('/getall', collectionController.getAllCollections);
router.post('/add', collectionController.addCollection);
router.get('/getbyid/:id', collectionController.getcollectionById);
router.delete('/delete/:id', collectionController.deletecollection);
router.put('/update/:id', collectionController.updatedcollection);
router.post('/assign/:collectionId/:userId', collectionController.assignUserToCollection);
router.delete('/remove/:collectionId/:userId', collectionController.removeUserFromCollection);
router.get('/getusers/:id', collectionController.getUsersByCollectionId);





module.exports = router;