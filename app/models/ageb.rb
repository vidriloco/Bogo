class Ageb < ActiveRecord::Base
  include Geography

  def prepare_geom
    if self.the_geom.nil?
      self.processed_geom = "[]"
    else
      self.processed_geom = self.the_geom.as_text.gsub('MULTIPOLYGON ', '').gsub('(', '[').gsub(')', ']').gsub(', ', ',').gsub(/([\d.-]*) ([\d.-]*)/, '[\1, \2]')
    end
    self.update_attribute(:processed_geom, processed_geom)
  end

  def coordinate_list
    eval(self.processed_geom)[0] || []
  end

  def self.process_geoms
    Ageb.all.each do |ageb|
      ageb.prepare_geom
    end
  end
end
