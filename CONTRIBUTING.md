# Developer Workflow

### Make your own `svg` icon

- To make an icon in svg format you can use different programs starting from illustrator, inkview, or [Inkscape](https://inkscape.org/).
- Verify `svg` icons are set properly by using text editor of your choice ([Notepad++](https://notepad-plus-plus.org/), Notepad, or Visual Studio Code).
- The size of the image must be **24px by 24px**.
- The size of the icon itself must be **20px by 20px**.
- The `svg` code must contain **viewbox**. No transform, translate, or scale.
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
