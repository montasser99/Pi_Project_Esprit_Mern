const collection = require("../models/collection");
const Collection = require("../models/collection");
const User = require("../models/user");

async function getAllCollections(req, res) {
	try {
		const collection = await Collection.find().populate("user");
		res.status(200).json(collection);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function addCollection(req, res) {
	try {
		const { titre, description, image, user, users } = req.body;
		const collection = new Collection({
			titre,
			description,
			image,
			user,
			users,
		});
		await collection.save();
		res
			.status(201)
			.json({ message: "Collection added successfully", collection });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
async function getcollectionById(req, res) {
	try {
		const collection = await Collection.findById(req.params.id).populate(
			"users"
		); // Use populate to include user details
		res.status(200).json(collection);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getUsersByCollectionId(req, res) {
	try {
		const collection = await Collection.findById(req.params.id).populate(
			"users"
		);
		const users = collection.users.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			specialite: user.specialite,
			pic: user.pic,

			// Ajoutez d'autres propriétés d'utilisateur que vous souhaitez renvoyer
		}));
		res.status(200).json(users);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function deletecollection(req, res) {
	try {
		const deletedcollection = await collection.findByIdAndDelete(req.params.id);
		res
			.status(200)
			.json({ message: "collection deleted successfully", deletedcollection });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function updatedcollection(req, res) {
	try {
		const updatedcollection = await collection.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res
			.status(200)
			.json({ message: "collection updated successfully", updatedcollection });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function assignUserToCollection(req, res) {
	const { collectionId, userId } = req.params;
	try {
		const collection = await Collection.findById(collectionId).populate(
			"users"
		);
		const user = await User.findById(userId);

		if (!collection || !user) {
			return res.status(404).json({ message: "Collection or user not found" });
		}

		const userExists = collection.users.some((u) => u._id.equals(user._id));

		if (userExists) {
			return res
				.status(400)
				.json({ message: "Ce candidat est dejà affecté à cette collection" });
		}

		collection.users.push(user);
		await collection.save();

		res.json({ message: "User added to collection successfully", collection });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}
async function removeUserFromCollection(req, res) {
	const { collectionId, userId } = req.params;
	try {
		const collection = await Collection.findById(collectionId).populate(
			"users"
		);
		const user = await User.findById(userId);

		if (!collection || !user) {
			return res.status(404).json({ message: "Collection or user not found" });
		}

		collection.users.pull(user);
		await collection.save();

		res.json({
			message: "User removed from collection successfully",
			collection,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function checkUserAssigned(req, res) {
	const { userId } = req.params;

	try {
		const collections = await Collection.find({ users: userId });

		if (collections.length > 0) {
			return res.json({ assigned: true, collections });
		} else {
			return res.json({ assigned: false });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

module.exports = {
	assignUserToCollection,
	getAllCollections,
	addCollection,
	getcollectionById,
	deletecollection,
	updatedcollection,
	removeUserFromCollection,
	getUsersByCollectionId,
	checkUserAssigned,
};
