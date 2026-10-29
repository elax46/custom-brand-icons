[![GitHub release (latest by date)](https://img.shields.io/github/v/release/elax46/custom-brand-icons?style=for-the-badge)](https://github.com/elax46/custom-brand-icons/releases/latest)
[![GitHub Downloads](https://img.shields.io/github/downloads/elax46/custom-brand-icons/total?style=for-the-badge)](https://github.com/elax46/custom-brand-icons/releases)
[![MIT License][mit-shield]][mit-license]
![GitHub file size in bytes](https://img.shields.io/github/size/elax46/custom-brand-icons/dist/custom-brand-icons.js?label=entry%20size&style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/elax46/custom-brand-icons?style=for-the-badge)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/elax46)

[mit-license]: https://opensource.org/licenses/MIT
[mit-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge

# Custom brand icons

![logo](https://res.cloudinary.com/dcongin7u/image/upload/v1775920018/cbi-logo_pho7hp.png)

#### Custom brand icons use the prefix `phu:`
#### Append Name (of the icon) after `phu:`
- Example: `phu:eggs` <img src="/icon-svg/eggs.svg" title="Preview" alt="Preview" width="24"/>
- Example: `phu:chicken` <img src="/icon-svg/chicken.svg" title="Preview" alt="Preview" width="24"/>


# Icon Requests

Want an icon? [contribute to the project](#developer-workflow).

![2FA](https://res.cloudinary.com/dcongin7u/image/upload/v1620853194/example_pwvozi.jpg)

## Iconify

All icons are available in the [framework Iconify](https://github.com/iconify). You can use icons using the prefix `cbi`. Anyone who uses this icon set via the framework is reminded to comply with the license. For commercial purposes you can contact us

- For all information  visit the website https://iconify.design
- For use visit https://iconify.design/docs/usage/
- Browse Icons  https://icon-sets.iconify.design/cbi/


## Available Icons

To view all available icons, you can go to the following address. The icon viewer also allows you to generate a `custom brand-icons.js` with only the icons you want, allowing you to streamline the icon pack and eliminate loading issues.
 -  [Icon Finder](https://elax46.github.io/custom-brand-icons/)

# Installation Methods

#### Marketplace

We recommend installing Custom brand icons card via [Marketplace](https://hacs.xyz)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=elax46&repository=custom-brand-icons&category=frontend)

After installing through Marketplace:
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

> [!IMPORTANT]
> The pack is now split across several files. If you are upgrading a manual
> installation, replacing only `custom-brand-icons.js` will leave you with no
> icons at all — download the chunks too.

1. Download **all** the files attached to the [latest release](/releases/latest) — `custom-brand-icons.js` plus every `cbi-*.js` chunk.
2. Copy them **all into the same directory**, `<config>/www/custom-brand-icons/`, creating it if needed. The entry file loads the chunks from alongside itself, so they must stay together.

3. Add the following to the `frontend` section of your `configuration.yaml`

    ```yaml
    frontend:
      extra_module_url:
        - /local/custom-brand-icons/custom-brand-icons.js
    ```

4. (Optional) YAML mode users. Add the following to your lovelace configuration using the Raw Config editor under Configure UI or ui-lovelace.yaml.

    ```yaml
    resources:
      - type: js
        url: /local/custom-brand-icons/custom-brand-icons.js
    ```

5. Restart Home Assistant.

---

# User Manual

#### Custom brand icons use the prefix `phu:`
#### Append Name (of the icon) after `phu:`
- Example: `phu:eggs` <img src="/icon-svg/eggs.svg" title="Preview" alt="Preview" width="24"/>
- Example: `phu:chicken` <img src="/icon-svg/chicken.svg" title="Preview" alt="Preview" width="24"/>

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

#### Hard Reload (browser cache issue)
- Reload browser by holding CTRL and pressing F5.
- For Mac, hold ⌘ CMD and ⇧ SHIFT, then press R.

#### Redownload Integration
1. From settings, select on *Marketplace*.
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


#### Create a smaller version of the icon pack

1. Go to [icon viewer](https://elax46.github.io/custom-brand-icons/)
2. Select all the icons you want to add to your HA instance
3. Download the js file and install it manually in Home Assistant

---

# Developer Workflow

### Make your own `svg` icon

- To make an icon in svg format you can use different programs starting from illustrator, inkview, or [Inkscape](https://inkscape.org/).
- Verify `svg` icons are set properly by using text editor of your choice ([Notepad++](https://notepad-plus-plus.org/), Notepad, or Visual Studio Code).
- Rules on Icon size and contraints are [HERE](https://github.com/elax46/custom-brand-icons/discussions/1021), 
- The `svg` code must contain **viewbox**. No transform, translate, or scale.
- Make sure to add color: **#44739e**. Every custom brand icon uses this color.
- all icons must have a nomenclature NOT in camelcase but of the type `part1name-part2name`
- Once done, add the svg file in the folder `icon-svg` found in the root of the repo.

- the icon must ***not be composed of multiple paths but a single** one as shown in the example below

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

### How to integrate icons?

- You can open a [PR](#contributions-and-pull-requests) towards the dev branch
- Using the template [issue](https://github.com/elax46/custom-brand-icons/issues/new?template=icon_request.yml)


###  ( optional ) if you want to generate the icon package locally

> [!WARNING]  
>You need to have Node.js installed to use automatic generation.

Go to the local folder where the `custom-icons-builder.js` file is located and run `node custom-icons-builder.cjs` The script will generate a new `custom brand-icons` file with the updated icons.

If everything went well you will see a message like this

```js
✅ Build completed
📁 Generated: dist/custom-brand-icons.js + XX chunks
🔢 Total icons: XXXX
📦 Chunks: XX (budget XXX.X KB each)
📐 Chunk size: min XX.X KB · median XXX.X KB · max XXX.X KB
🪶 Entry size: XX.X KB
🧱 Chunk total: X.XX MB
```

The icon data lives in the `cbi-*.js` chunks, which the entry loads on demand: a page fetches only the chunks holding the icons it renders, so a dashboard using a handful of icons downloads a fraction of the set, while one using hundreds ends up fetching most of it. Keep the whole `dist/` directory together.

The [icon finder](https://elax46.github.io/custom-brand-icons/) page loads the pack as a classic script and reads the whole icon set synchronously, which the chunked entry cannot provide. `script/build-finder-bundle.mjs` reassembles the old single-file form out of the chunks in `dist/`, so the finder serves exactly the icon data the release ships; CI runs it when publishing that page, and the result is never a release asset.

(Optional) In case you want to create your own prefix you can edit the last line of the `custom-brand-icons.js`

```js
window.customIconsets["yourprefix"] = getIcon;
```

### Normalize script

> [!WARNING]  
>You need to have Node.js installed to use.

> [!NOTE]  
> This procedure can be performed locally to verify that the icons meet the required requirements and that they are compliant and minimized as best as possible.

Thanks to the work of @SoulSolistice, a `normalize-icons.mjs` has been introduced that performs the following operations:

- `viewBox="0 0 24 24"`
- geometry scaled to fit within `MAX_GEO` x `MAX_GEO` (aspect preserved), default 20x20
- geometry centered at `viewBox / 2`, default 12,12
- paths only output, baked coordinates, no transforms
- fill color is fixed to BRAND_FILL, default `#44739e`
- --clean: svgo --> normalize --> svgo (because normalization expands path data)
- --vrt: ImageMagick montage ... --> script/vrt.png as "Visual Regression Test"
- default input/output (when not specified): custom-brand-icons/icon-svg


#### Installation & use:
* Run `npm i` in `custom-brand-icons` folder to install requirements
* Run `npm run clean:vrt` to clean the current icons (will be overwritten). Also creates `vrt.png` in the `scripts` folder as "Visual Regression Test". This needs ImageMagick installed.


### Running locally using docker
This repository contains a docker-compose file that performs the two tasks above:
1. Runs the `node custom-icons-builder.cjs` script using node 22 to generate custom icons.
2. Builds a local Docker image with node 22 and ImageMagick and then normalizes and cleans up the generated files using `npm run clean:vrt`.

To perform these tasks, run one of the following commands:
```sh
docker compose up build
docker compose up normalize --build
```


### Contributions and Pull Requests

> [!IMPORTANT]
> **Contributions Rules:** All Pull Requests must be targeted to the `dev` branch. 
> PRs opened against `main` will be automatically closed by our bot.

After adding your svg icon in `icon-svg` folder . Open pull request on the **[dev branch](https://github.com/elax46/custom-brand-icons/pulls)**. You should create a **new feature branch** on your fork (e.g., `feat/add-new-icon`) and submit your PR from there.

