import express from "express";
import Note from "../models/noteModels.js";
const router = express.Router();

// Obtener todas las notas
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Obtener una nota por su id
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Crear una nueva nota
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = new Note({
      title,
      description,
    });
    const savedNote = await note.save();
    res
      .status(201)
      .json({ message: "Nota creada exitosamente", note: savedNote });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Eliminar una nota existente
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res.status(200).json({ message: "Nota eliminada exitosamente" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Actualizar una nota existente
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res
      .status(200)
      .json({ message: "Nota actualizada exitosamente", note: updatedNote });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
