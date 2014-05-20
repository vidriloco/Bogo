class AddFieldsToAgebsTable < ActiveRecord::Migration
  def up
    add_column :agebs, :geom, :text
  end

  def down
    remove_column :agebs, :geom
  end
end
