class AgebSerializer < ActiveModel::Serializer

  def attributes
    { type: "Feature", properties: properties, geometry: geometry }
  end

  def properties
    { pob1: object.pob1,
      densidad: object.densidad,
      eco4_r: object.eco4_r,
      eco25_r: object.eco25_r,
      disc_r: object.disc1_r,
      viv0: object.viv0,
      viv1_r: object.viv1_r,
      viv28_r: object.viv28_r,
      nse: object.nse,
      gmu: object.gmu }
  end

  def geometry
    { type: "Polygon", coordinates: coordinates }
  end

  def coordinates
    object.coordinate_list
  end
end
