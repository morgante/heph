###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration
activate :directory_indexes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

###
# Redirects
###

redirect "google.html", to: "/internships/google"
redirect "facebook.html", to: "/internships/facebook"
redirect ".well-known/keybase.txt.html", to: "https://gist.githubusercontent.com/morgante/9899709/raw/627116ae34ce28a07f4ee77eb8550782c8fb48db/gistfile1.txt"
redirect "drf.html", to: "https://drive.google.com/file/d/0B0RTahF1SjYvdXROeWMtY0tEeFE/edit?usp=sharing"
redirect "valentine/2013.html", to: "http://fierce-eyrie-7449.herokuapp.com"
redirect "resume.html", to: "http://me.morgante.net/resume.pdf"
redirect "calendar.html", to: "http://me.morgante.net/schedule"

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end
