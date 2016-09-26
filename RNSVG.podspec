require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = 'RNSVG'
  s.version          = package['version']
  s.summary          = package['description']
  s.license          = package['license']
  s.homepage         = 'https://github.com/zimo888/react-native-xsy-upgrade'
  s.authors          = 'zimo'
  s.source           = { :git => 'https://github.com/zimo888/react-native-xsy-upgrade.git', :tag => "v#{s.version}" }
  s.source_files     = 'ios/**/*.{h,m}'
  s.preserve_paths  = "**/*.js"
  s.platform         = :ios, "7.0"
  s.dependency         'React/Core'  
end