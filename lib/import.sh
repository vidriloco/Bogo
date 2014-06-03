# Importa un archivo shp con un SRID 4326 a una base de datos en PostgreSQL con funciones de Postgis cargadas
# y después aplica los cambios necesarios para preparar la base de datos para una aplicación de Rails y finalmente
# pre-procesa los datos de la columna geográfica a una columna de texto con geojson

# $1 Ruta al archivo shape
# $2 Nombre de la tabla donde insertar los contenidos del shape
# $3 Nombre de la base de datos
# $4 Nombre del usuario
# $5 Nombre de la tabla con postgis

echo "Drop existing db"
dropdb $3 -U $4
echo "Create db"
createdb $3 -T $5 -U $4 
echo "Import shapefile"
shp2pgsql -I -i -D -s 4326 $1 $2 | psql -h localhost -d $3 -U $4
echo "Attempting to migrate"
rake db:migrate
echo "Upgrading migration"
psql -h localhost -d $3 -U $4 -c "INSERT INTO schema_migrations (version) VALUES ('20140519033920');"
echo "Re-migrate"
rake db:migrate
echo "Pre-process geometries for optimization"
rake transform:preprocess_geoms
echo "Done!!"
