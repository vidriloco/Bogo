# DotDF: A visualiser of public transportation infrastructure development

![](src/screenshots/heatmap.png)

### Introduction

This web-based visualiser was developed by request of ITDP México for it's campaign _DOTDF_  in order to add facts backed up on science and data to the discussion around the public transport infrastructure in Mexico City in terms of how it's topology benefits the different socioeconomical groups of people that live in the city and it's surroundings and also as an space to present proposals towards the next corridors of public transport the city should build in the following years. 

### Showcase

You can take a look at the visualiser running on this video: https://youtu.be/HlYY_s3d_ZY

Some additional pictures of the main features:

#### Heatmap
![](src/screenshots/heatmap.png)

#### Radius map
![](src/screenshots/radius.png)

#### Topography map
![](src/screenshots/network.png)


### Technical description

This application is a web-based application based on the _Ruby on Rails_ framework on it's version `4.0` and the _PostgreSQL_ database. The version of _Ruby_ recommended is _ruby-1.9.3_, _Ruby_ is the programming language on which this web-based visualiser is written.

The application, as of the writing of this document, consists on two groups of layers that work on a different aspects of what is seen above the map visualisation:

1. The *AGEBS* layer which has to be imported on the database and then be pre-processed. An *AGEB* is the most basic geostadistical area according to the INEGI.
2. The *Radius* layers with ranges 500, 800, 1000 and 2000 meters contain geostadistical information relevant to each one of the public transportation stops displayed on the map. The information is shown per station when hovering on it. The data is structured under the `radius` directory.

### Preparation and deployment instructions

For getting the visualisation running, follow the steps below:

1. Install the right _Ruby_ version: `rvm install ruby-1.9.3-p551` (RVM is a tool for managing different versions of `Ruby`)
2. Fetch the required dependencies `bundle install`. Make sure you are running this command under the ruby version installed above. Check command `rvm use` for more information.
3. Prepare the database by updating the details of your database setup in `config/database.yml` under _Production_ or _Development_ environment, depending on your needs.
4. From the root directory of this project run the following script: `sh lib/import.sh src/shapes/agebs/AGEBs.shp <table_name> <database_name> <user_name_in_database_realm>`
5. Wait until the script has finished: You should see in the last lines a message counting `"Processed feature: 5664"`. If this is not the case, then make sure you have the command `shp2pgsql` available on your command line.

### Alternative deployment instructions

1. Install the right _Ruby_ version: `rvm install ruby-1.9.3-p551` (RVM is a tool for managing different versions of `Ruby`)
2. Fetch the required dependencies `bundle install`. Make sure you are running this command under the ruby version installed above. Check command `rvm use` for more information.
3. Prepare the database by updating the details of your database setup in `config/database.yml` under _Production_ or _Development_ environment, depending on your needs.
4. Use the _db_dump/bogo.sql_ file to restore the data from this file into the database you have configured in the previous step. Check the instructions for data restore in the PostgreSQL version you are using. 

### Last BUT very IMPORTANT: 

The main javascript file is `welcome.js`, on it is defined all the code that builds the user interaction with the application. Notice the `var prod_server` and `var dev_server` variables, also check the `var default_server` variable which points to either one of the former variables to switch the production URL, so that the ajax petitions issued to the remote server (production or development) are correctly working. 