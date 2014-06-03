namespace :transform do
  desc "Pre-processes geometry"
  task preprocess_geoms: :environment do
    Ageb.process_geoms
  end

end
