# frozen_string_literal: true

# cspell:disable
require_relative "version"

module Thetkarit
  # module Thetkarit::Astro
  module Astro
    # Calculates the Mahabote of the given Burmese year.
    def mahabote(burmese_year, week_day_index)
      mb = %w[Binga Ahtun Yaza Adipati Marana Thike Puti]
      index = (burmese_year - week_day_index) % 7
      { mb_index: index, mb_zartar: mb[index] }
    end
  end
end
