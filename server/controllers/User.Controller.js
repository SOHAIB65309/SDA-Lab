import User from "../models/User.model.js";

const getAllUser = async (req, res, next) => {
  try {
    const allUser = await User.find();
    res.status(200).json(allUser);
  } catch (error) {
    console.log("Hello");
    res.status(400).json(error);
  }
};

const createUser = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Log incoming data
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser); // Use 201 Created for successful creation
    } catch (error) {
      console.error("Error creating user:", error); // Log full error to server console
      
      // If it's a validation error, return a user-friendly message
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ message: "Validation error", errors: messages });
      } else {
        res.status(400).json({ message: "An error occurred", error: error.message });
      }
    }
  };
  
const getOneUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.json(foundUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateOneUserById = async (req, res, next) => {
  const { id } = req.params;
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, options);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteOneUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  createUser,
  getOneUser,
  updateOneUserById,
  deleteOneUser,
  getAllUser,
};
