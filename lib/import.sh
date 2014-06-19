# Importa un archivo shp (AGEBS) con un SRID 4326 a una base de datos en PostgreSQL con funciones de Postgis cargadas
# y después aplica los cambios necesarios para preparar la base de datos para una aplicación de Rails y finalmente
# pre-procesa los datos de la columna geográfica a una columna de texto con geojson.
# Requiere los parámetros siguientes en el orden en el que aparecen:

# $1 Ruta al archivo shape
# $2 Nombre de la tabla donde insertar los contenidos del shape
# $3 Nombre de la base de datos
# $4 Nombre del usuario
# $5 Nombre de una tabla geoespacial existente 

# ========== ENGLISH

# This script imports a shape file (AGEB) with SRID 4326 to an already spatial enabled PostgreSQL database 
# it then executes the migrations required for database preparation for the rails application and 
# pre-processes the spatial column on the Ageb table to a json text column.
# Requieres the following ordered params:

# $1 Shape file route
# $2 Table name where the shapefile contents will be dumped
# $3 Database name
# $4 Username
# $5 Spatial enabled existen DB

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
