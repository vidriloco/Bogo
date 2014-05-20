class AgebSerializer < ActiveModel::Serializer
  #{"type":"Feature","properties":{"CVEGEO":"130690001004A","pob1":341,"sup1":178.865,"sup2":178.865,"eco4":134,"eco25":0,"eco25_r":0.759531,"disc1":8,"disc1_r":2.3,"viv28":18,"viv28_r":18.8,"viv0":109,"viv1":12,"viv1_r":11.009174,"NSE_proxy":null,"GMU2010":null,"densidad":2,"densidad_2":2,"eco4_r":39.2962},
  #"geometry":{"type":"Polygon","coordinates":[[[-98.9659095339188,19.82765971650816],[-98.95852051569902,19.822179097851482],[-98.96071261105268,19.82244373475266],[-98.96961711769137,19.817332900724097],[-98.97655297581444,19.820113447973785],[-98.97844400279541,19.82996465895926],[-98.9659095339188,19.82765971650816]]]}}
  def attributes
    { type: "Feature", properties: properties, geometry: geometry }
  end
  
  def properties
    { pob1: object.pob1, sup1: object.sup1, sup2: object.sup2, eco4: object.eco4, eco25: object.eco25, eco25_r: object.eco25_r, disc1: object.disc1, disc1_r: object.disc1_r, viv28: object.viv28, viv28_r: object.viv28_r, viv0: object.viv0, viv1: object.viv1, viv1_r: object.viv28, NSE_proxy: object.viv28_r, GMU2010: object.viv0, densidad: object.viv1, densidad_2: object.densidad_2, eco4_r: object.eco4_r}
  end
  
  def geometry
    { type: "Polygon", coordinates: coordinates }
  end
  
  def coordinates
    object.coordinate_list
  end
end
