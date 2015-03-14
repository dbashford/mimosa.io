exports.config = {
  modules:[
    "copy",
    "rename",
    "less",
    "hogan-static",
    "minify-html",
    "minify-css"],
  copy: {
    extensions:["png", "html","js", "jpg", "ico",
                "eot", "svg", "ttf", "woff", "woff2"]
  },
  minifyHtml: {
    options: {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true
    }
  },
  rename: {
    map:[
      [/public\/html\/([a-z]+)\.html$/, "$1.html"]
    ]
  },
  hoganStatic: {
    partials:["html/partials"],
    globals: {
      version: "2.3.32"
    },
    contexts: {
      about: {
        title:"FAQ/Tips - Mimosa",
        desc:"Common questions and issues.",
        header:"FAQ & Mimosa Tips",
        lead:"Questions answered & tricks discussed"
      },
      commands: {
        title:"Commands - Mimosa",
        desc:"At the command line is where Mimosa's magic happens.",
        header:"Commands",
        lead:"Interact with your project via the command line"
      },
      configuration: {
        title:"Configuration - Mimosa",
        desc:"While preferring as little config as possible, Mimosa is hugely configurable.",
        header:"Configuration",
        lead:"Configuration explained & Mimosa core's configuration options"
      },
      extend: {
        title:"How to Build Mimosa Modules - Mimosa",
        desc:"Mimosa is extensible, making it easy to add your own functionality via modules.",
        header:"Building A Mimosa Module",
        lead:"Plug custom functionality into Mimosa"
      },
      modules: {
        title:"Modules - Mimosa",
        desc:"Mimosa is pluggable so new functionality can be added.",
        header:"Modules",
        lead:"Extend Mimosa's default functionality"
      },
      started: {
        title:"Get Started - Mimosa",
        desc:"Getting started is super easy, you'll be coding in no time.",
        header:"Get Started",
        lead:"Installation and project setup. You'll be coding in minutes."
      },
      index: {
        title:"Mimosa - A build tool for modern web development",
        desc: "A lightning-fast build tool for modern web development. Mimosa includes support for JavaScript, CSS, and template compilers, bower, linting, optimization, serving, RequireJS support, and Live Reload. It is also modular and pluggable for authoring your own functionality.",
      }
    }
  }
}
