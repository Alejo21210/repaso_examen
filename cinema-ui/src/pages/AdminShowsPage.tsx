import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Shows, listShowsApi, createShowsApi, updateShowsApi, deleteShowsApi } from "../api/shows.api";

export default function AdminShowsPage() {
  const [items, setItems] = useState<Shows[]>([]);
  const [movie_title, setMovieTile] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar shows. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!movie_title.trim()) return setError("Nombre requerido");

      if (price) await updateShowsApi(price, movie_title.trim());
      else await createShowsApi(movie_title.trim());

      setMovieTile("");
      setPrice(null);
      await load();
    } catch {
      setError("No se pudo guardar show. ¿Token admin?");
    }
  };

  const startEdit = (m: Shows) => {
    setPrice(m.id);
    setMovieTile(m.movie_title);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowsApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar show. ¿Reservas asociadas? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Shows (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Movie title show" value={movie_title} onChange={(e) => setMovieTile(e.target.value)} fullWidth />
            <TextField label="Salas" value={room} onChange={(e) => setRoom(e.target.value)} fullWidth />
          <Button variant="contained" onClick={save}>{price ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setMovieTile(""); setPrice(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Pelicula</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.movie_title}</TableCell>
                <TableCell>{m.room}</TableCell>
                <TableCell>{m.price}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}