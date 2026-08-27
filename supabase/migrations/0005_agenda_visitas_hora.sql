-- Agrega hora opcional a agenda_visitas. La fecha se elige al agendar (o se
-- fija de antemano al agendar desde un día puntual del calendario); la hora
-- puede completarse después y es lo único editable de una cita ya agendada
-- desde el calendario de la app.
alter table agenda_visitas add column hora time;
