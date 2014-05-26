class AgebSerializer < ActiveModel::Serializer

  def attributes
    { type: "Feature", properties: properties, geometry: geometry }
  end

  def properties
    { pob1: object.pob1,
      sup1: object.sup,
      eco4: object.eco4,
      eco25: object.eco25,
      eco25_r: object.eco25_r,
      disc1: object.disc1,
      disc_r: object.disc1_r,
      viv28: object.viv28,
      viv28_r: object.viv28_r,
      viv0: object.viv0,
      viv1: object.viv1,
      viv1_r: object.viv28,
      nse: object.nse,
      gmu: object.gmu,
      densidad: object.viv1,
      eco4_r: object.eco4_r }
  end

  def geometry
    { type: "Polygon", coordinates: coordinates }
  end

  def coordinates
    object.coordinate_list
  end
end
