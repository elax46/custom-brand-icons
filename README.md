[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs) [![hacs_badge](https://img.shields.io/badge/Buy-Me%20a%20Coffee-critical)](https://www.buymeacoffee.com/elax46)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=377L3FU33TLSL)


# Custom brand icons

Custom brand icons for Home Assistant

![2FA](https://res.cloudinary.com/dcongin7u/image/upload/v1620853194/example_pwvozi.jpg)


At the moment I have integrated only the main icons of Philips Hue products!

 ---
## Philips Hue

These are the official icons from the [philips developer channel](https://developers.meethue.com/develop/application-design-guidance/icon-pack/)

| Icon | Name |
|------|:--------------:|
| ![Preview](./icon-svg/Bollard.svg) | Bollard |
| ![Preview](./icon-svg/CeilingRound.svg) | CeilingRound |
| ![Preview](./icon-svg/CeilingSquare.svg) | CeilingSquare |
| ![Preview](./icon-svg/DeskLamp.svg) | DeskLamp |
| ![Preview](./icon-svg/DoubleSpot.svg) | DoubleSpot |
| ![Preview](./icon-svg/FloorLantern.svg) | FloorLantern |
| ![Preview](./icon-svg/FloorShade.svg) | FloorShade |
| ![Preview](./icon-svg/FloorSpot.svg) | FloorSpot |
| ![Preview](./icon-svg/PendantLong.svg) | PendantLong |
| ![Preview](./icon-svg/PendantRound.svg) | PendantRound |
| ![Preview](./icon-svg/SingleSpot.svg) | SingleSpot|
| ![Preview](./icon-svg/TableShade.svg) | TableShade | 
| ![Preview](./icon-svg/WallLantern.svg) | WallLantern |
| ![Preview](./icon-svg/WallShade.svg) | WallShade |
| ![Preview](./icon-svg/WallSpot.svg) | WallSpot |
| ![Preview](./icon-svg/bulbCandle.svg) | bulbCandle |
| ![Preview](./icon-svg/bulbFlood.svg) | bulbFlood |
| ![Preview](./icon-svg/bulbFoh.svg) | bulbFoh |
| ![Preview](./icon-svg/bulbGeneralGroup.svg) | bulbGeneralGroup |
| ![Preview](./icon-svg/bulbGroup.svg) | bulbGroup |
| ![Preview](./icon-svg/bulbsClassic.svg) | bulbsClassic |
| ![Preview](./icon-svg/bulbsFilament.svg) | bulbsFilament |
| ![Preview](./icon-svg/bulbsSpot.svg) | bulbsSpot |
| ![Preview](./icon-svg/bulbsSultan.svg) | bulbsSultan |
| ![Preview](./icon-svg/BridgesV1.svg) | BridgesV1 |
| ![Preview](./icon-svg/BridgesV2.svg) | BridgesV2 |
| ![Preview](./icon-svg/Dimmerswitch.svg) | Dimmerswitch |
| ![Preview](./icon-svg/Friendsofhue.svg) | Friendsofhue |
| ![Preview](./icon-svg/MotionSensor.svg) | MotionSensor|
|  ![Preview](./icon-svg/devicesPlug.svg) |  devicesPlug | 
|  ![Preview](./icon-svg/devicesTap.svg) |  devicesTap | 
|  ![Preview](./icon-svg/Bloom.svg) |  Bloom |
|  ![Preview](./icon-svg/go.svg) |  go | 
|  ![Preview](./icon-svg/play.svg) |  play| 
|  ![Preview](./icon-svg/Iris.svg) |  Iris | 
|  ![Preview](./icon-svg/Lightstrip.svg) |  Lightstrip | 
| ![Preview](./icon-svg/RecessedFloor.svg) | RecessedFloor |
|  ![Preview](./icon-svg/roomsAttic.svg) |  roomsAttic | 
|  ![Preview](./icon-svg/roomsBalcony.svg) |  roomsBalcony | 
|  ![Preview](./icon-svg/roomsBathroom.svg) |  roomsBathroom | 
|  ![Preview](./icon-svg/roomsBedroom.svg) |  roomsBedroom | 
|  ![Preview](./icon-svg/roomsCarport.svg) |  roomsCarport | 
|  ![Preview](./icon-svg/roomsCloset.svg) |  roomsCloset | 
|  ![Preview](./icon-svg/roomsComputer.svg) |  roomsComputer | 
|  ![Preview](./icon-svg/roomsDining.svg) |  roomsDining| 
|  ![Preview](./icon-svg/roomsDriveway.svg) |  roomsDriveway | 
| ![Preview](./icon-svg/roomsGym.svg) |  roomsGym | 
|  ![Preview](./icon-svg/roomsHallway.svg) |  roomsHallway | 
|  ![Preview](./icon-svg/roomsKitchen.svg) |  roomsKitchen | 
|  ![Preview](./icon-svg/roomsLiving.svg) |  roomsLiving |
|  ![Preview](./icon-svg/roomsMancave.svg) |  roomsMancave | 
|  ![Preview](./icon-svg/roomsNursery.svg) |  roomsNursery | 
|  ![Preview](./icon-svg/roomsKidsbedroom.svg) |  roomsKidsbedroom |
|  ![Preview](./icon-svg/roomsOffice.svg) |  roomsOffice | 
|  ![Preview](./icon-svg/roomsOther.svg) |  roomsOther | 
| ![Preview](./icon-svg/roomsOutdoorSocialtime.svg) | roomsOutdoorSocialtime |
| ![Preview](./icon-svg/roomsPool.svg) | roomsPool |
| ![Preview](./icon-svg/roomsPorch.svg) | roomsPorch |
|![Preview](./icon-svg/roomsRecreation.svg) | roomsRecreation |
| ![Preview](./icon-svg/roomsStaircase.svg)| roomsStaircase| 
| ![Preview](./icon-svg/roomsStorage.svg) | roomsStorage |
| ![Preview](./icon-svg/roomsOutdoor.svg) | roomsOutdoor |
| ![Preview](./icon-svg/roomsStudio.svg) | roomsStudio |
| ![Preview](./icon-svg/roomsTerrace.svg) | roomsTerrace |
| ![Preview](./icon-svg/roomsToilet.svg) | roomsToilet |

# Install

## HACS

We recommend installing Custom brand icons card via [Home Assistant Community Store](https://hacs.xyz)
 
 1. Add the folowing to the `frontend` section of your `configuration.yaml`

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

 ##  Manual Installation

To add custom repositories please follow [this guide](https://hacs.xyz/docs/faq/custom_repositories/). Set URL to `https://github.com/elax46/custom-brand-icons` and category to `Lovelace`.
1. Download `custom-brand-icons.js` file from the [latest release](https://github.com/elax46/custom-brand-icons/releases/latest).
2. Copy the `custom-brand-icons.js` file into `<config>/www/` the directory where your `configuration.yaml` resides.

3. Add the folowing to the `frontend` section of your `configuration.yaml`

```yaml
frontend:
  extra_module_url:
    - /local/custom-brand-icons.js
```

Or add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml if using YAML mode.

```yaml
resources:
  - type: js
    url: /local/custom-brand-icons.js
```

Restart home-assistant.

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
# Customize the prefix

In case you want to create your own perfix you can edit the last line of the `custom-brand-icons.js`

```js
  window.customIconsets["yourprefix"] = getIcon;
```
# Don't see the icon?

It probably depends on the cache. Open Home assistant from an incognito window and check that the icon loads if yes then it depends on the cache, otherwise double check the installation

# Help me insert more icons!

***Attention I remind you that the icons must be in svg format***

If you like, you can help me expand the number of icons available. Just add to the variable  `var icons`

let's take the first string for example:

```js
"Bollard": [0, 0, 32.0, 32.0, "string"]
```
* `Bollard` = icon name

* `0, 0, 32.0, 32.0` = this data can be recovered from the svg file `transform="scale(0, 0, 32.0, 32.0)` ***If this data is not present in the file you can leave the one indicated by me***

* `String` = this data can be recovered from the svg file  `<path d="M21,12.5 C21,13.33 18.76,...."`
---
Do you like these icons? Support the project with a pizza 🍕🍕

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/elax46)
