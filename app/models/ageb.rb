class Ageb < ActiveRecord::Base
  include Geography

  def prepare_geom
    return if self.the_geom.nil?
    
    factory = RGeo::GeoJSON::EntityFactory.instance
    feature = factory.feature(self.the_geom, nil, { 
        pob1: self.pob1,
        densidad: self.densidad,
        eco4_r: self.eco4_r,
        eco25_r: self.eco25_r,
        disc_r: self.disc1_r,
        viv0: self.viv0,
        viv1_r: self.viv1_r,
        viv28_r: self.viv28_r,
        nse: self.nse,
        gmu: self.gmu 
    })
    self.update_attribute(:processed_geom, RGeo::GeoJSON.encode(feature).inspect)
    p "Processed feature: #{self.gid}"
  end

  def coordinate_list
    eval(self.processed_geom)[0] || []
  end

  def self.process_geoms
    Ageb.all.each do |ageb|
      ageb.prepare_geom
    end
    
    p "Unprocessed features (marked for deletion): #{Ageb.where(:processed_geom => nil).count}"
    
    Ageb.where(:processed_geom => nil).map { |ageb| ageb.destroy }
  end
end
