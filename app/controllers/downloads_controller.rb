##
#  Downloads controller
#
class DownloadsController < ApplicationController
  ##
  #  Allows the user to download the methodological note which was used for building the data used on this application
  #
  def note
    send_file Rails.root.join('public/Nota-metodologica-DOT.pdf'), :type => 'application/pdf', :disposition => 'inline'
  end
  
  ##
  #  Allows the user to download the data used on this application
  #
  def data
    send_file Rails.root.join('public/DOT-data.zip'), :type => 'application/zip', :disposition => 'inline'
  end

end
