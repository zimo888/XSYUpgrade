require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = 'XSYUpgrade'
  s.version          = package['version']
  s.summary          = package['description']
  s.license          = package['license']
  s.homepage         = 'https://github.com/zimo888/XSYUpgrade'
  s.authors          = 'zimo'
  s.source           = { :git => 'https://github.com/zimo888/XSYUpgrade.git', :tag => "#{s.version}" }
  s.source_files     = 'ios/**/*.{h,m,c}'
  s.preserve_paths  = "**/*.js"
  s.platform         = :ios, "7.0"
  s.dependency        'React/Core'
end
