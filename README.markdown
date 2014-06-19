== README

This document explains how to deploy the ITPD México DOT visualization application. 

### Introduction

This application requires Ruby on Rails v 4.0 and the PostgreSQL database. Additional libraries are also required, they are all listed on the Gemfile and should get satisfied by running `bundle install`.

The application, as of the writing of this document, consists on two groups of layers that work on a different basis:

1. The *AGEBS* layer which has to be imported on the database and then be pre-processed. 
2. The *Radius* layers with ranges from 500, 800, 1000 and 2000 meters. These are included on the radius/index.js.erb and get rendered 
   depending on the request parameter. 

### Database setup

For getting the application to a fully deployed state from an AGEB shapefile, you need to execute the script file on: lib/import.sh . Read the instructions located on that file.
On this application, are included two PG dumps: **content.dump** and **content.sql**. Those include all the data required for the application to run with the latest version of the AGEB file included on the data downloadable file. 

### JS 

The main javascript file is `welcome.js`, on it is defined all the code that builds the user interaction with the application. Notice the `var prod_server` and `var dev_server` variables, also check the `var default_server` variable which points to either one of the former variables to switch the production URL, so that the ajax petitions issued to the remote server (production or development) are correctly working. 

