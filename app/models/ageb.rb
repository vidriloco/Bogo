class Ageb < ActiveRecord::Base
  include Geography

  def prepare_geom
    if self.the_geom.nil?
      self.geom = "[]"
    else
      self.geom = self.the_geom.as_text.gsub('MULTIPOLYGON ', '').gsub('(', '[').gsub(')', ']').gsub(', ', ',').gsub(/([\d.-]*) ([\d.-]*)/, '[\1, \2]')
    end
    self.update_attribute(:geom, geom)
  end

  def coordinate_list
    eval(self.geom)[0]
  end

  def self.process_geoms
    Ageb.all.each do |ageb|
      ageb.prepare_geom
    end
  end
end
