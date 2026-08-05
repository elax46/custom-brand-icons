# Developer Workflow

### Make your own `svg` icon

- To make an icon in svg format you can use different programs starting from illustrator, inkview, or [Inkscape](https://inkscape.org/).
- Verify `svg` icons are set properly by using text editor of your choice ([Notepad++](https://notepad-plus-plus.org/), Notepad, or Visual Studio Code).
- Rules on Icon size and contraints are ([HERE](https://github.com/elax46/custom-brand-icons/discussions/1021), 
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


###  ( optional ) if you want to generate the icon package locally

> [!WARNING]  
>You need to have Node.js installed to use automatic generation.

Go to the local folder where the `custom-icons-builder.js` file is located and run `node custom-icons-builder.js` The script will generate a new `custom brand-icons` file with the updated icons.

If everything went well you will see a message like this

```js
✅ Build completed
📁 Generated file: dist/custom-brand-icons.js
🔢 Total icons: XXXX
```

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




### Contributions and Pull Requests

> [!IMPORTANT]
> **Contributions Rules:** All Pull Requests must be targeted to the `dev` branch. 
> PRs opened against `main` will be automatically closed by our bot.

After adding your svg icon in `icon-svg` folder . Open pull request on the **[dev branch](https://github.com/elax46/custom-brand-icons/pulls)**. You should create a **new feature branch** on your fork (e.g., `feat/add-new-icon`) and submit your PR from there.

