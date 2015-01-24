exports.config = {
  modules:["copy", "rename", "adhoc-module"],
  rename: {
    map:[
      [/public\/html\/([a-z]+)\.html$/, "$1.html"]
    ]
  },
  adhocModule: {
    modules:[
      require("./scripts/hogan-compile")({
        partials:["html/partials"],
        globals: {

        },
        contexts: {
          about: {
          },
          commands: {
            title:"Commands - Mimosa",
            desc:"At the command line is where Mimosa's magic happens.",
            header:"Commands",
            lead:"Interact with your project via the command line"
          },
          configuration: {

          },
          extend: {

          },
          index: {

          },
          modules: {

          },
          started: {

          }
        }
      })
    ]
  }
}