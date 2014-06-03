class AgebSerializer < ActiveModel::Serializer

  def attributes
    eval(object.processed_geom) unless object.processed_geom.nil?
  end

end
