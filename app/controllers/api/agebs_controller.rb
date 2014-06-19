##
#  API responder for AGEBS
#
class Api::AgebsController < ApplicationController
  
  respond_to :json
  
  ##
  #  Fetches the agebs visible on the current map viewport and responds with a JSON response
  #
  def index
    @agebs = Ageb.find_nearby(params[:viewport])
    respond_with(@agebs, :each_serializer => AgebSerializer)
  end
end