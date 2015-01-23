exports.config = {
  modules:["copy", "rename"],
  rename: {
    map:[
      [/public\/html\/([a-z]+)\.html$/, "$1.html"]
    ]
  }
}