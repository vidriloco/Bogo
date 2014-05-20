class Ageb < ActiveRecord::Base
  include Geography
  
  def coordinate_list
    return [] if self.the_geom.nil?
    eval(self.the_geom.as_text.gsub('MULTIPOLYGON ', '').gsub('(', '[').gsub(')', ']').gsub(', ', ',').gsub(/([\d.-]*) ([\d.-]*)/, '[\1, \2]'))[0]
  end
end
