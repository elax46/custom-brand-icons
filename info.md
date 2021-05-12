[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs) [![hacs_badge](https://img.shields.io/badge/Buy-Me%20a%20Coffee-critical)](https://www.buymeacoffee.com/elax46)

# Custom brand icons
Custom brand icons for Home Assistant

![2FA](https://res.cloudinary.com/dcongin7u/image/upload/v1620853194/example_pwvozi.jpg)

## Use
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

### Make icons available in all home assistant (Optional)

The icons will only be added to the Lovelace user interface. If you want them to be available in all Home Assistant add this code to the `frontend` section of your` configuration.yaml`

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/custom-brand-icons/custom-brand-icons.js
```

A system restart is required after this step
