function setExpirationDate(days) {
  days = new Date()
  days.setDate(days.getDate() + 7)
  days = days.toISOString().slice(0, -5)
  return days
}
module.exports = {
  setExpirationDate,
}
