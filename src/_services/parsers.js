export const isAccepted = function(status){
  return status == "ACCEPTE" | status == "ACCEPTEE" |status == "ACCEPTÉE" | status == "ACCEPTéE"
}

export const isRefused = function(status){
  return status == "REFUSE" | status == "REFUSEE" |status == "REFUSÉE" | status == "REFUSéE"
}
