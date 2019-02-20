
function thing() {
  return new Promise((resolve, reject) => {
    resolve(console.log('Script has Run!'))
  })
}

module.exports = thing