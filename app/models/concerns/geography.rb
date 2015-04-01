module Geography
  module ClassMethods
    
    def selected_fields
      "*"
    end
    
    def build_polygon_from_params(coordinates_)
      return nil if coordinates_.nil?
      return nil if (coordinates_[:sw].blank? || coordinates_[:ne].blank? || coordinates_[:ne] == "{}" || coordinates_[:sw] == "{}")
      lat_sw, lon_sw = coordinates_[:sw].split(',').map { |n| n.to_f }
      lat_ne, lon_ne = coordinates_[:ne].split(',').map { |n| n.to_f }

      geo_factory = RGeo::Cartesian.factory(srid: 4326)
      sw=geo_factory.point(lon_sw, lat_sw)
      ne=geo_factory.point(lon_ne, lat_ne)
      RGeo::Cartesian::BoundingBox.create_from_points(sw, ne).to_geometry
    end

    def filter_nearby(viewport)
      window=build_polygon_from_params(viewport)
      if self.respond_to?(:the_geom)
        self.select(selected_fields).where{st_intersects(the_geom, window)}
      else
        self.select(selected_fields).where{st_intersects(geom, window)}
      end
    end

    def find_nearby(viewport=nil)
      if viewport.nil?
        self.all
      else
        self.filter_nearby(viewport)
      end
    end
  end

  def apply_geo(coordinates)
    return self if coordinates.nil? || (coordinates["lon"].blank? || coordinates["lat"].blank?)
    self.coordinates = "POINT(#{coordinates["lon"].to_f} #{coordinates["lat"].to_f})"
    self
  end

  # Requires a path variable on the mixed-in class
  def to_points_list(style=:plain)
    points_list = style.eql?(:plain) ? String.new : Array.new
    return points_list if path.nil?
    path.points.each do |point|
      points_list << "#{point.y}|#{point.x} " if style.eql?(:plain)
      points_list << [point.y, point.x] if style.eql?(:json)
    end
    return points_list.chop if style.eql?(:plain)
    points_list
  end

  def lat
    coordinates.lat
  end

  def lon
    coordinates.lon
  end

  def coordinates_to_s
    %-"#{coordinates.to_s}"-
  end

  def self.included(base)
    base.extend(ClassMethods)
  end
end
