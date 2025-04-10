// index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get("/api/prueba", (req, res) => {
  res.send("API funcionando correctamente");
});

//==================== ESTUDIANTES ====================

// Obtener todos los estudiantes
app.get("/api/estudiantes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM estudiantes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al consultar estudiantes");
  }
});

// Crear un estudiante
app.post("/api/estudiantes", async (req, res) => {
  const { nombre, correo } = req.body;
  if (!nombre || !correo) {
    return res.status(400).json({ message: "Nombre y correo son obligatorios" });
  }

  try {
    await pool.query(
      "INSERT INTO estudiantes (nombre, correo) VALUES ($1, $2)",
      [nombre, correo]
    );
    res.status(201).json({ message: "Estudiante creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear estudiante", error: error.message });
  }
});

// Actualizar un estudiante
app.put("/api/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ message: "Nombre y correo son obligatorios" });
  }

  try {
    const result = await pool.query(
      "UPDATE estudiantes SET nombre = $1, correo = $2 WHERE id = $3",
      [nombre, correo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.status(200).json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar estudiante", error: error.message });
  }
});

// Eliminar un estudiante
app.delete("/api/estudiantes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM estudiantes WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.status(200).json({ message: `Estudiante con ID ${id} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar estudiante", error: error.message });
  }
});

//==================== CURSOS ====================

// Obtener todos los cursos
app.get("/api/cursos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cursos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al consultar cursos");
  }
});

// Crear curso
app.post("/api/cursos", async (req, res) => {
  const { nombre, creditos } = req.body;
  if (!nombre || !creditos) {
    return res.status(400).json({ message: "Nombre y créditos son obligatorios" });
  }

  try {
    await pool.query("INSERT INTO cursos (nombre, creditos) VALUES ($1, $2)", [
      nombre,
      creditos,
    ]);
    res.status(201).json({ message: "Curso registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar curso", error: error.message });
  }
});

// Actualizar curso
app.put("/api/cursos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, creditos } = req.body;

  if (!nombre || !creditos) {
    return res.status(400).json({ message: "Nombre y créditos son obligatorios" });
  }

  try {
    const result = await pool.query(
      "UPDATE cursos SET nombre = $1, creditos = $2 WHERE id = $3",
      [nombre, creditos, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.status(200).json({ message: "Curso actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar curso", error: error.message });
  }
});

// Eliminar curso
app.delete("/api/cursos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM cursos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.status(200).json({ message: `Curso con ID ${id} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar curso", error: error.message });
  }
});

//==================== INSCRIPCIONES ====================

// Obtener todas las inscripciones
app.get("/api/inscripciones", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inscripciones");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al consultar inscripciones");
  }
});

// Crear inscripción
app.post("/api/inscripciones", async (req, res) => {
  const { estudiante_id, curso_id, fecha_inscripcion } = req.body;

  if (!estudiante_id || !curso_id || !fecha_inscripcion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const existente = await pool.query(
      "SELECT * FROM inscripciones WHERE estudiante_id = $1 AND curso_id = $2",
      [estudiante_id, curso_id]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ message: "El estudiante ya está inscrito en este curso" });
    }

    await pool.query(
      "INSERT INTO inscripciones (estudiante_id, curso_id, fecha_inscripcion) VALUES ($1, $2, $3)",
      [estudiante_id, curso_id, fecha_inscripcion]
    );
    res.status(201).json({ message: "Inscripción creada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear inscripción", error: error.message });
  }
});

// Actualizar inscripción
app.put("/api/inscripciones/:id", async (req, res) => {
  const { id } = req.params;
  const { estudiante_id, curso_id, fecha_inscripcion } = req.body;

  if (!estudiante_id || !curso_id || !fecha_inscripcion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const result = await pool.query(
      "UPDATE inscripciones SET estudiante_id = $1, curso_id = $2, fecha_inscripcion = $3 WHERE id = $4",
      [estudiante_id, curso_id, fecha_inscripcion, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    res.status(200).json({ message: "Inscripción actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar inscripción", error: error.message });
  }
});

// Eliminar inscripción
app.delete("/api/inscripciones/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM inscripciones WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    res.status(200).json({ message: `Inscripción con ID ${id} eliminada` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar inscripción", error: error.message });
  }
});

//==================== DETALLES CON JOIN ====================

app.get("/api/inscripciones/detalles", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        inscripciones.id AS inscripcion_id,
        estudiantes.nombre AS estudiante,
        cursos.nombre AS curso,
        cursos.creditos,
        inscripciones.fecha_inscripcion
      FROM inscripciones
      INNER JOIN estudiantes ON inscripciones.estudiante_id = estudiantes.id
      INNER JOIN cursos ON inscripciones.curso_id = cursos.id
      ORDER BY inscripciones.fecha_inscripcion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalles de inscripciones:", error);
    res.status(500).json({
      message: "Error al obtener detalles de inscripciones",
      error: error.message,
    });
  }
});

//==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

