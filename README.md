
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/elax46/custom-brand-icons)](https://github.com/elax46/custom-brand-icons/releases/latest)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]
![GitHub file size in bytes](https://img.shields.io/github/size/elax46/custom-brand-icons/dist/custom-brand-icons.js?label=plugin%20size)
![GitHub last commit](https://img.shields.io/github/last-commit/elax46/custom-brand-icons)

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

# Custom brand icons

![logo](https://res.cloudinary.com/dcongin7u/image/upload/v1707320837/cbi-logo.jpg)

#### Custom brand icons use the prefix `phu:`
#### Append Name (of the icon) after `phu:`
- Example: `phu:eggs` ![Preview](/icon-svg/eggs.svg)
- Example: `phu:chicken` ![Preview](/icon-svg/chicken.svg)

# Icon Requests

Want an icon? Open a [custom icon request](https://github.com/elax46/custom-brand-icons/issues/new?assignees=elax46&labels=icon-request&template=insertion-of-new-icons.md&title=Custom+Icon+request) or [contribute to the project](#developer-workflow).
-  Provide a **svg file and jpg logo of your request (we also are not mind readers and dont know every icon globaly so if no name is present please add it** and a image along with your request.
-  links to SVG's or Images will be ignored you must upload the files into your request, ignoring this will result in request being ignored. (if you can not be bothered to spend a few minutes doing this, why should we spend time making it).
-  For those who [made their own icons](#developer-workflow), open pull requests on the **[dev branch](https://github.com/elax46/custom-brand-icons/pulls)**.

### Make sure to [install](#installation-methods) `custom-brand-icons.js` into `configuration.yaml` or `ui-lovelace.yaml`

![2FA](https://res.cloudinary.com/dcongin7u/image/upload/v1620853194/example_pwvozi.jpg)

## Iconify

All icons are available in the [framework Iconify](https://github.com/iconify). You can use icons using the prefix `cbi`. Anyone who uses this icon set via the framework is reminded to comply with the license. For commercial purposes you can contact us

- For all information  visit the website https://iconify.design
- For use visit https://iconify.design/docs/usage/
- Browse Icons  https://icon-sets.iconify.design/cbi/


## Available Icons

To view all the available icons you can go to the following address
 -  [Icon Finder](https://elax46.github.io/custom-brand-icons/)

# Installation Methods

#### HACS

We recommend installing Custom brand icons card via [Home Assistant Community Store](https://hacs.xyz)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=elax46&repository=custom-brand-icons&category=frontend)

After installing through HACS:
1. Add the following lines to your `configuration.yaml`

    ```yaml
    frontend:
      extra_module_url:
        - /local/community/custom-brand-icons/custom-brand-icons.js
    ```

2. (Optional) YAML mode users. Add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml.

    ```yaml
    resources:
      - type: js
        url: /local/community/custom-brand-icons/custom-brand-icons.js
    ```

#### Manual Installation

To add custom repositories please follow [this guide](https://hacs.xyz/docs/faq/custom_repositories/). Set URL to `` and category to `Lovelace`.

1. Download `custom-brand-icons.js` file from the [latest release](/releases/latest).
2. Copy the `custom-brand-icons.js` file into `<config>/www/` the directory where your `configuration.yaml` resides.

3. Add the following to the `frontend` section of your `configuration.yaml`

    ```yaml
    frontend:
      extra_module_url:
        - /local/custom-brand-icons.js
    ```

4. (Optional) YAML mode users. Add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml.

    ```yaml
    resources:
      - type: js
        url: /local/custom-brand-icons.js
    ```

5. Restart Home Assistant.

---

# User Manual

#### Custom brand icons use the prefix `phu:`
#### Append Name (of the icon) after `phu:`
- Example: `phu:eggs` ![Preview](/icon-svg/eggs.svg)
- Example: `phu:chicken` ![Preview](/icon-svg/chicken.svg)

Example of custom brand icons a lovelace card:

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

---

# Don't see the icon?

### Cache issue HomeAssistant 2024.1.1

Some addons (including official) have had some [cache issues since 2024.1.1]([https://](https://github.com/elax46/custom-brand-icons/issues/560)), here are a few work arounds to try

1. first go to settings, dashboard and 3 dots click resorces, add resource

    ```yaml
    /hacsfiles/custom-brand-icons/custom-brand-icons.js?hacstag=366862031202420
    ```

2. Add this second resource too
    ```yaml
    /local/community/custom-brand-icons/custom-brand-icons.js
    ```


#### Hard Reload (browser cache issue)
- Reload browser by holding CTRL and pressing F5.
- For Mac, hold ⌘ CMD and ⇧ SHIFT, then press R.

#### Redownload Integration
1. From left sidebar, select on *HACS*.
2. Select on *Integrations*.
3. From the top header bar (Integrations, Frontend), select *Frontend*.
4. Search *custom-brand-icons* on the search bar.
5. Select *Custom brand icons*.
6. From the top right, select the 3 vertical dots which opens a dropdown menu.
7. Select *Redownload*.
8. **Hard reload** browser.

#### Reinstall Integration
1. Open the dropdown menu from **Step 6** of **Redownload Integration**.
2. Select *Remove*, then select *Remove* again on the popup.
3. This should bring you back to /hacs/frontend
4. From the top right, select the 3 vertical dots which opens a dropdown menu.
5. Select on *Custom repositories*.
6. Find *Custom brand icons* and select it.
7. On the bottom right, select the big blue *Download* icon.
8. **Hard reload** browser.

# Thanks for your support

Thanks, as always, to the precious contribution to [@rchiileea](https://github.com/rchiileea) for the creation of the required icons!
Do you like these icons? Support the project with a pizza 🍕🍕

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/elax46)

## StarGazers
[![Stargazers repo roster for @elax46/custom-brand-icons](https://reporoster.com/stars/elax46/custom-brand-icons)](/stargazers)

---

# Developer Workflow

### Make your own `svg` icon

- To make an icon in svg format you can use different programs starting from illustrator, inkview, or [Inkscape](https://inkscape.org/).
- Verify `svg` icons are set properly by using text editor of your choice ([Notepad++](https://notepad-plus-plus.org/), Notepad, or Visual Studio Code).
- The size of the SVG must be **24px by 24px**.
- The `svg` code must contain **viewbox**. The size of the viewbox must be **24px by 24px**. No transform, translate, or scale.
- The icon in the box must have a **2px border** around it minumum and should **not** protrude into this area.
- Make sure to add color: **#44739e**. Every custom brand icon uses this color.
- Once done, add the svg file in the folder `icon-svg` found in the root of the repo.

Example svg file below:

```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<!-- path d="..." is unique for each icon -->

<svg
   width="24"
   height="24"
   viewBox="0 0 24 24"
   version="1.1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
   <path
     style="fill:#44739e"
     d="..."
    \>
  </svg>
```


### Modify `custom-brand-icons.js` file

Add the following entry to the `var icons` variable (list) of the `custom-brand-icons.js` file

Example entry:

```js
"Bollard": [0, 0, 24.0, 24.0, "string"]
```

- `Bollard` = svg icon name used for `phu:`
- `0, 0, 24.0, 24.0` = this data can be recovered from the svg file `viewBox="0 0 24 24"`
  -  ***If this data is not present, you can leave the one indicated by me.***
- `string` = this data can be recovered from the svg file `<path d="M21,12.5 C21,13.33 18.76,...."` In particular you will have to enter only the part of the vector code `"M21,12.5 C21,13.33 18.76"`. 
  - For an example, take a look at the [icons already inserted](dist/custom-brand-icons.js).

(Optional) In case you want to create your own perfix you can edit the last line of the `custom-brand-icons.js`

```js
window.customIconsets["yourprefix"] = getIcon;
```

### Update `README.md`
- Remember to also update the `README.md` file by inserting the icon's path and the name for `phu:`.


### Contributions and Pull Requests
After adding your svg icon in `icon-svg`, modifying `custom-brand-icons.js`, and updating `README.md.`
Open pull requests on the **[dev branch](https://github.com/elax46/custom-brand-icons/pulls)**.
