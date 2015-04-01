##
#  Represents an Ageb entity with geo-statistical fields and a geometrical property 
#
class Ageb < ActiveRecord::Base
  include Geography
  
  ##
  #  The fields to use on the query for optimization
  #
  def selected_fields
    "gid, cvegeo, pob1, eco4, eco25, eco25_r, disc1, disc1_r, viv28, viv28_r, viv0, viv1, viv1_r, densidad, eco4_r, empleo, sup, empleo_r, nse, processed_geom, gmu"
  end

  ##
  #  This method is on charge of pre-processing the_geom 
  #
  def prepare_geom
    return if self.geom.nil?
    
    factory = RGeo::GeoJSON::EntityFactory.instance
    feature = factory.feature(self.geom, nil, { 
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

  ##
  #  Evals the processed_geom text which is a stringified ruby hash
  #
  def coordinate_list
    eval(self.processed_geom)[0] || []
  end
  
  ##
  #  Bulk pre-processes all the agebs on this database
  #
  def self.process_geoms
    Ageb.all.each do |ageb|
      ageb.prepare_geom
    end
    
    p "Unprocessed features (marked for deletion): #{Ageb.where(:processed_geom => nil).count}"
    
    Ageb.where(:processed_geom => nil).map { |ageb| ageb.destroy }
  end
end
