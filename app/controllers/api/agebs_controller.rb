class Api::AgebsController < ApplicationController
  
  respond_to :json
  
  def index
    @agebs = Ageb.find_nearby(params[:viewport])
    respond_with(@agebs, :each_serializer => AgebSerializer)
  end
end