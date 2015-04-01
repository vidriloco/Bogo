# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140520053036) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "agebs", primary_key: "gid", force: true do |t|
    t.string  "cvegeo",         limit: 13
    t.float   "pob1"
    t.float   "eco4"
    t.float   "eco25"
    t.float   "eco25_r"
    t.float   "disc1"
    t.float   "disc1_r"
    t.float   "viv28"
    t.float   "viv28_r"
    t.float   "viv0"
    t.float   "viv1"
    t.float   "viv1_r"
    t.integer "densidad"
    t.float   "eco4_r"
    t.integer "empleo"
    t.float   "sup"
    t.integer "empleo_r"
    t.string  "nse",            limit: 50
    t.string  "gmu",            limit: 50
    t.decimal "sup1"
    t.spatial "geom",           limit: {:srid=>4326, :type=>"multi_polygon"}
    t.text    "processed_geom"
  end

  add_index "agebs", ["geom"], :name => "agebs_geom_idx", :spatial => true

end
