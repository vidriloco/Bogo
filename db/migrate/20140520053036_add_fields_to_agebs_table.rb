class AddFieldsToAgebsTable < ActiveRecord::Migration
  def up
    add_column :agebs, :processed_geom, :text
  end

  def down
    remove_column :agebs, :processed_geom
  end
end
