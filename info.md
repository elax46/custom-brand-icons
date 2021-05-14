[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs) [![hacs_badge](https://img.shields.io/badge/Buy-Me%20a%20Coffee-critical)](https://www.buymeacoffee.com/elax46)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=377L3FU33TLSL)
# Custom brand icons
Custom brand icons for Home Assistant

![2FA](https://res.cloudinary.com/dcongin7u/image/upload/v1620853194/example_pwvozi.jpg)

# Install

 1. Add the folowing to the `frontend` section of your `configuration.yaml`

  ```yaml
frontend:
  extra_module_url:
    - /local/community/custom-brand-icons/custom-brand-icons.js.js
```
2. (optional) Or add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml if using YAML mode.

```yaml
resources:
  - type: js
    url:  /local/community/custom-brand-icons/custom-brand-icons.js.js
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

### Make icons available in all home assistant (Optional)

The icons will only be added to the Lovelace user interface. If you want them to be available in all Home Assistant add this code to the `frontend` section of your` configuration.yaml`

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/custom-brand-icons/custom-brand-icons.js
```

A system restart is required after this step
