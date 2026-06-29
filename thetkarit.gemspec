# frozen_string_literal: true

require_relative "gem-lib/thetkarit/version"

Gem::Specification.new do |spec|
  spec.name = "thetkarit"
  spec.version = Thetkarit::VERSION
  spec.authors = ["phothinmg"]
  spec.email = ["phothinmg@disroot.org"]

  spec.summary = "The Burmese calendar calculations."
  spec.description = "The Burmese calendar calculations focus on Burmese calendar and astronomy studies."
  spec.homepage = "https://github.com/phothinmg/thetkarit"
  spec.license = "Apache-2.0"
  spec.required_ruby_version = ">= 3.2.0"
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["rubygems_mfa_required"] = "true"

  spec.require_paths = ["gem-lib"]
end
