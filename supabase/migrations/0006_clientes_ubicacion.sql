-- Coordenadas GPS capturadas desde el celular al agregar/editar un cliente
-- ("Registrar dirección con Google Maps" en la app de staff), además del
-- campo `direccion` de texto libre que ya existía. Ambas son opcionales e
-- independientes: se puede tener una sin la otra.
alter table clientes add column direccion_lat double precision;
alter table clientes add column direccion_lng double precision;
