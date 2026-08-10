[![GitHub release (latest by date)](https://img.shields.io/github/v/release/elax46/custom-brand-icons?style=for-the-badge)](https://github.com/elax46/custom-brand-icons/releases/latest)
[![GitHub Downloads](https://img.shields.io/github/downloads/elax46/custom-brand-icons/total?style=for-the-badge)](https://github.com/elax46/custom-brand-icons/releases)
[![MIT License][mit-shield]][mit-license]
![GitHub file size in bytes](https://img.shields.io/github/size/elax46/custom-brand-icons/dist/custom-brand-icons.js?label=plugin%20size&style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/elax46/custom-brand-icons?style=for-the-badge)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/elax46)

[mit-license]: https://opensource.org/licenses/MIT
[mit-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge

# Custom brand icons
Custom brand icons for Home Assistant


![logo](https://res.cloudinary.com/dcongin7u/image/upload/v1775920018/cbi-logo_pho7hp.png)

# Install

 1. Add the following to the `frontend` section of your `configuration.yaml`

  ```yaml
frontend:
  extra_module_url:
    - /local/community/custom-brand-icons/custom-brand-icons.js
```
2. (optional) Or add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml if using YAML mode.

```yaml
resources:
  - type: js
    url:  /local/community/custom-brand-icons/custom-brand-icons.js
```

# Use
you can use icons by entering the prefix `phu:`

Example of integration in the card

```yaml
entities:
  - entity: light.lampada_entrance
    icon: 'phu:go'
    name: Go
  - entity: light.monitor_2_right
    icon: 'phu:play'
    name: play 1
  - entity: light.monitor_2_left
    icon: 'phu:play'
    name: play 2
show_header_toggle: false
title: Custom brand icons
type: entities
```

A system restart is required after this step

# Icons/Brands Available
See the full list on [Icon Finder](https://elax46.github.io/custom-brand-icons/).
