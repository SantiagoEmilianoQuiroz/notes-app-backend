import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;

    if (!dbURI) {
      throw new Error(
        "La variable MONGODB_URI no está definida en el archivo .env",
      );
    }

    await mongoose.connect(dbURI);
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    throw error;
  }
};
