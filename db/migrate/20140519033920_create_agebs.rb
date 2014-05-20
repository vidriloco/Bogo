class CreateAgebs < ActiveRecord::Migration
  def change
    create_table :agebs do |t|
      t.integer       :gid
      t.string        :cvegeo
      t.float        :pob1
      t.float        :sup1
      t.float        :sup2
      t.float        :eco4
      t.float        :eco25_r
      
      t.float        :disc1
      t.float        :disc1_r
      t.float        :viv28
      t.float        :viv28_r
      t.float        :viv0
      t.float        :viv1
      t.float        :viv1_r
      t.text         :nse_proxy
      t.text         :gmu2010
      t.integer      :densidad
      t.integer      :densidad_2
      t.float        :eco4_r
      t.string       :stc
      t.string       :ste
      t.string       :mb
      t.string       :mxb
      t.string       :tren
      t.polygon      :the_geom, :geographic => true
      
      
      t.timestamps
    end
  end
end
