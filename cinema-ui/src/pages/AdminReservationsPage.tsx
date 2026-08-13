import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Shows, listShowsApi } from "../api/shows.api";
import { type Reservations, listReservationsAdminApi, createReservationsApi, updateReservationsApi, deleteReservationsApi } from "../api/reservations.api";

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservations[]>([]);
  const [shows, setShows] = useState<Shows[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);

  const [customer_name, setCustomerName] = useState("");
  const [seats, setSeats] = useState("");
  const [status, setStatus] = useState("");


  const load = async () => {
    try {
      setError("");
      const data = await listReservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if (!customer_name.trim() || !status.trim()) return setError("Shows y status son requeridos");

      const payload = {
        show: Number(show),
        customer_name: customer_name.trim(),
        seats: seats.trim(),
        status: status.trim(),
        
      };

      if (editId) await updateReservationsApi(editId, payload);
      else await createReservationsApi(payload as any);

      setEditId(null);
      setCustomerName("");
      setStatus("");
      setColor("");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservations) => {
    setEditId(v.id);
    setShows(v.show);
    setCustomerName(v.customer_name);
    setAnio(v.anio);
    setStatus(v.status);
    setColor(v.color || "");
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationsApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">Shows</InputLabel>
              <Select
                labelId="show-label"
                label="Shows"
                value={show}
                onChange={(e) => setShows(Number(e.target.value))}
              >
                {shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Modelo" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCustomerName(""); setStatus(""); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Shows</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_nombre ?? v.show}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}